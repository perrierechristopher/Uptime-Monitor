// Worker related tasks

//Dependencies
const path = require("path");
const fs = require("fs");
const _data = require("./data");
const https = require("https");
const http = require("http");
const helpers = require("./helpers");
const url = require("url");
const _logs = require("./logs");
const util = require("util");
const debug = util.debuglog('workers')

// Instantiate the worker object
let workers = {}

// Lookup all checks, get their data and send to a validator
workers.gatherAllChecks = () => {
    // Get all the checks that exists in the system
    _data.list('checks', (err, checks) => {
        if (!err && checks && checks.length > 0) {
            checks.forEach(check => {
                //Read from the checks collection
                _data.read('checks', check, (err, originalCheckData) => {
                    if (!err && originalCheckData) {
                        // Pass the data to check validator
                        workers.validateCheckData(originalCheckData)
                    } else {
                        debug("Error reading one of the checks data");
                    }
                })

            });
        } else {
            debug("Error: could not find any checks to process")
        }
    })
}

// Sanity-check the check-data
workers.validateCheckData = (originalCheckData) => {
    originalCheckData = typeof (originalCheckData) === "object" && originalCheckData !== null ? originalCheckData : {}
    originalCheckData.id = typeof (originalCheckData.id) === "string" && originalCheckData.id.trim().length === 20 ? originalCheckData.id.trim() : false
    originalCheckData.userPhone = typeof (originalCheckData.userPhone) === "string" && originalCheckData.userPhone.trim().length === 9 ? originalCheckData.userPhone.trim() : false
    originalCheckData.protocol = typeof (originalCheckData.protocol) === "string" && ['http', 'https'].indexOf(originalCheckData.protocol) > -1 ? originalCheckData.protocol : false
    originalCheckData.url = typeof (originalCheckData.url) === "string" && originalCheckData.url.trim().length > 0 ? originalCheckData.url.trim() : false
    originalCheckData.method = typeof (originalCheckData.method) === "string" && ['post', 'get', 'put', 'delete'].indexOf(originalCheckData.method) > -1 ? originalCheckData.method : false
    originalCheckData.successCodes = typeof (originalCheckData.successCodes) == 'object' && originalCheckData.successCodes instanceof Array && originalCheckData.successCodes.length > 0 ? originalCheckData.successCodes : false
    originalCheckData.timeoutSeconds = typeof (originalCheckData.timeoutSeconds) === "number" && originalCheckData.timeoutSeconds % 1 === 0 && originalCheckData.timeoutSeconds >= 1 && originalCheckData.timeoutSeconds <= 5 ? originalCheckData.timeoutSeconds : false

    // Set the keys that may not be set if the workers have never seen this check before
    originalCheckData.state = typeof (originalCheckData.state) === "string" && ['up', 'down'].indexOf(originalCheckData.state) > -1 ? originalCheckData.state : 'down'
    originalCheckData.lastChecked = typeof (originalCheckData.lastChecked) === "number" && originalCheckData.lastChecked > 0 ? originalCheckData.lastChecked : false

    // If all the checks pass, pass the data along to the next step in the process
    if (originalCheckData.id &&
        originalCheckData.userPhone &&
        originalCheckData.protocol &&
        originalCheckData.url &&
        originalCheckData.method &&
        originalCheckData.successCodes &&
        originalCheckData.timeoutSeconds) {
        workers.performCheck(originalCheckData)
    } else {
        debug('Error: One of the checks is not properly formatted, Skipping it')
    }
}

// Perform the check, send the originalCheckData and the outcome of the check process to the next step in the process

workers.performCheck = (originalCheckData) => {

    // Prepare initial check outcome
    let checkOutcome = {
        'error': false,
        'responseCode': false
    }

    // Mark that the outcome has not been sent yet
    let outcomeSent = false

    // Parse the hostname and the path out of the original check data
    let parsedUrl = url.parse(originalCheckData.protocol + '://' + originalCheckData.url, true)

    let hostname = parsedUrl.hostname
    let path = parsedUrl.path // Using path and not pathname because of the querystring 

    // Construct the request
    let requestDetails = {
        'protocol': originalCheckData.protocol + ':',
        'hostname': hostname,
        'method': originalCheckData.method.toUpperCase(),
        'path': path,
        'timeout': originalCheckData.timeoutSeconds * 1000
    }

    // Instantiate the request object using either http or https module
    let _moduleToUse = originalCheckData.protocol === 'http' ? http : https;

    let req = _moduleToUse.request(requestDetails, (res) => {
        // Garb the status of the sent request
        let status = res.statusCode;

        // Update the checkOutcome and pass the data along
        checkOutcome.responseCode = status;
        if (!outcomeSent) {
            workers.processCheckOutcome(originalCheckData, checkOutcome)
            outcomeSent = true;
        }
    })

    // Bind to the error event so it does not get thrown
    req.on('error', (e) => {
        // Update the checkOutcome and pass the data along
        checkOutcome.error = {
            'error': true,
            'value': e
        }

        if (!outcomeSent) {
            workers.processCheckOutcome(originalCheckData, checkOutcome)
            outcomeSent = true
        }
    })

    // Bind to the timeout event
    req.on('timeout', function () {
        // Update the checkOutcome and pass the data along
        checkOutcome.error = { 'error': true, 'value': 'timeout' };
        if (!outcomeSent) {
            workers.processCheckOutcome(originalCheckData, checkOutcome);
            outcomeSent = true;
        }
    });

    // End the request
    req.end()

}

// Process the check outcome, update the check data as needed and trigger alert to user
// Special logic for accomodating a check that has never been tested before (don't alert that one)

workers.processCheckOutcome = (originalCheckData, checkOutcome) => {
    // Decide if the check is considered up or down
    let state = !checkOutcome.error && checkOutcome.responseCode && originalCheckData.successCodes.indexOf(checkOutcome.responseCode) > -1 ? 'up' : "down";

    // Decide if an alert is warranted
    let alertWarranted = originalCheckData.lastChecked && originalCheckData.state !== state ? true : false

    // Log the outcome of the check
    let timeOfCheck = Date.now()

    workers.log(originalCheckData, checkOutcome, state, alertWarranted, timeOfCheck)

    // Update the check data
    let newCheckData = originalCheckData
    newCheckData.state = state
    newCheckData.lastChecked = Date.now()

    // Save the updates
    _data.update('checks', newCheckData.id, newCheckData, (err) => {
        if (!err) {
            // Send the new check data to the next phase in the process if needed
            if (alertWarranted) {
                workers.alertUserToStatusChange(newCheckData)
            } else {
                debug("Check outcome has not changed, no alert needed")
            }
        } else {
            debug("Error trying to save updates to one of the checks")
        }
    })
}

// Alert the user as to a change in their check status
workers.alertUserToStatusChange = (newCheckData) => {
    let msg = 'Alert: Your check for ' + newCheckData.method.toUpperCase() + ' ' + newCheckData.protocol + '://' + newCheckData.url + ' is currently ' + newCheckData.state
    helpers.sendTwilioSms(newCheckData.userPhone, msg, (err) => {
        if (!err) {
            debug('Success: User was alerted to a status change in their check, via sms: ' + msg)
        } else {
            debug('Error: Could not send sms alert to user who had a state change in their check')
        }
    })
}

// Log the events
workers.log = (originalCheckData, checkOutcome, state, alertWarranted, timeOfCheck) => {

    // Form the log data
    let logData = {
        'check': originalCheckData,
        'outcome': checkOutcome,
        'state': state,
        'alert': alertWarranted,
        'time': timeOfCheck
    }

    // Convert data to a string
    let logString = JSON.stringify(logData)

    // Determine the name of the log file
    let logFileName = originalCheckData.id

    // Apeoend the log string to the file
    _logs.append(logFileName, logString, (err) => {
        if (!err) {
            debug('Logging to file succeeded')
        } else {
            debug('Logging file failed')
        }
    })

}

// Timer to execute the worker-process once per minute
workers.loop = () => {
    setInterval(() => {
        workers.gatherAllChecks()

    }, 1000 * 5)
}

// Rotate (compress) the log files
workers.rotateLogs = () => {
    // List all the (non compressed) log files
    _logs.list(false, (err, logs) => {
        if (!err && logs && logs.length > 0) {
            logs.forEach(logName => {
                // Compress the data to a different file
                let logId = logName.replace('.log', '')
                let newFileId = logId + '-' + Date.now();

                _logs.compress(logId, newFileId, (err) => {
                    if (!err) {
                        // Truncate the log
                        _logs.truncate(logId, (err) => {
                            if (!err) {
                                debug('Success truncating the log file')
                            } else {

                            } debug('Error truncating the log file')
                        })

                    } else {
                        debug('Error compressing one of the log files', err)
                    }
                })
            })

        } else {
            debug('Error: could not find any logs to rotate')
        }
    })
}

// Timer to execute the log rotation process once per day
workers.logRotationLoop = () => {
    setInterval(() => {
        workers.rotateLogs()

    }, 1000 * 60 * 60 * 24)
}

// Init script
workers.init = () => {

    // Send to console in yellow
    console.log('\x1b[33m%s\x1b[0m', 'Background workers are running')

    // Execute all the checks immediately
    workers.gatherAllChecks();

    // Call the loop so the checks will execute later on
    workers.loop()

    // Compress all the logs immediately
    workers.rotateLogs();

    // Call the compression loop so logs will be compressed later on
    workers.logRotationLoop()

}







// Module export worker
module.exports = workers