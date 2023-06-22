// Helpers for various tasks


//Dependencies
const crypto = require('crypto')
const config = require('./config')
const https = require('https')
const queryString = require('querystring')
const path = require("path")
const fs = require("fs")

// Container for all the helpers
let helpers = {}

helpers.hash = (str) => {
    if (typeof (str) === "string" && str.length > 0) {

        let hash = crypto.createHmac("sha256", config.hashingSecret).update(str).digest('hex')

        return hash
    }
}

// Parse a JSON string to an object in all cases, without throwing

helpers.parseJsonToObject = (str) => {
    try {
        var object = JSON.parse(str)

        return object

    } catch (e) {
        return {}
    }
}

// Create a string of random alphanumeric characters of a given length

helpers.createRandomString = (strLength) => {
    strLength = typeof (strLength) === "number" && strLength > 0 ? strLength : false;
    if (strLength) {
        // Define all the possible characters that could go into a string
        const possibleCharacters = `abcdefghijklmnopqrstuvwxyz1234567890`

        // Start the final string
        let str = ''
        for (let i = 1; i <= strLength; i++) {
            // Get a random character from the possibleCharacters string and append it
            let randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length))
            str += randomCharacter
        }

        return str
    }
}

// Send an SMS messages via Twilio
helpers.sendTwilioSms = (phone, msg, callback) => {
    // Validate parameters
    phone = typeof (phone) === 'string' && phone.trim().length === 9 ? phone.trim() : false
    msg = typeof (msg) === 'string' && msg.trim().length > 0 && msg.trim().length <= 1600 ? msg.trim() : false

    if (phone && msg) {
        //Configure the request payload
        let payload = {
            'From': config.twilio.fromPhone,
            'To': '+233' + phone,
            'Body': msg
        }

        //Stringify the payload
        let stringpayload = queryString.stringify(payload)

        // Configure the request details
        let requestDetails = {
            'protocol': 'https:',
            'hostname': 'api.twilio.com',
            'method': 'POST',
            'path': '/2010-04-01/Accounts/' + config.twilio.accountSid + '/Messages.json',
            'auth': config.twilio.accountSid + ':' + config.twilio.authToken,
            'headers': {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-length': Buffer.byteLength(stringpayload)
            }
        }

        // Instantiate the request object
        let req = https.request(requestDetails, (res) => {
            // Grab the status of the sent request
            let status = res.statusCode

            // callback successfully if the request went through
            if (status === 200 || status === 201) {
                callback(false)
            } else {
                callback('Status code returned was ' + status)
            }
        })

        // Bind to the error event so it doesn't get thrown
        req.on('error', (e) => {
            callback(e);
        })

        // Add the payload
        req.write(stringpayload)

        // End the request
        req.end();

    } else {
        callback('Given parameters were missing or invalid')
    }
}

// Get the string content of a template
helpers.getTemplate = (templateName, data, callback) => {
    templateName = typeof (templateName) === "string" && templateName.length > 0 ? templateName : false
    data = typeof (data) === "object" && data !== null ? data : {}
    if (templateName) {
        let templateDir = path.join(__dirname, "/../templates/")
        fs.readFile(templateDir + templateName + '.html', 'utf8', (err, str) => {
            if (!err && str && str.length > 0) {
                // Do interpolation on the string
                let finalString = helpers.interpolate(str, data)
                callback(false, finalString)
            } else {
                callback('No template could be found')
            }
        })

    } else {

        callback('A valid template name was not specified')
    }
}

// Add the unviversal header and footer to a string, and pass provided data object to the header and footer for interpolation
helpers.addUniversalTemplates = (str, data, callback) => {
    str = typeof (str) === "string" && str.length > 0 ? str : '';
    data = typeof (data) === "object" && data !== null ? data : {};

    // Get the header
    helpers.getTemplate('_header', data, (err, headerString) => {
        if (!err && headerString) {
            // Get the footer 
            helpers.getTemplate('_footer', data, (err, footerString) => {
                if (!err && footerString) {
                    // Add them all together
                    let fullString = headerString + str + footerString
                    callback(false, fullString)
                } else {
                    callback('Could not find the footer template')
                }
            })
        } else {
            callback('Could not find the header template')
        }
    })
}

// Take a given string and a data object and find/replace all the keys within it
helpers.interpolate = (str, data) => {
    str = typeof (str) === "string" && str.length > 0 ? str : ''
    data = typeof (data) === "object" && data !== null ? data : {}

    // Add the templateGlobals to the data object, prepending their key names with globals
    for (let keyName in config.templateGlobals) {
        if (config.templateGlobals.hasOwnProperty(keyName)) {
            data['global.' + keyName] = config.templateGlobals[keyName]
        }
    }

    // For each key in the data object, insert its value into the string at the corresponding place
    for (let key in data) {
        if (data.hasOwnProperty(key) && typeof (data[key]) === "string") {
            let replace = data[key]
            let find = '{' + key + '}'
            str = str.replace(find, replace)
        }
    }

    return str
}

// Get the contents of a static (public) asset
helpers.getStaticAsset = (fileName, callback) => {
    fileName = typeof (fileName) === "string" && fileName.length > 0 ? fileName : false

    if (fileName) {
        let publicDir = path.join(__dirname, '/../public/')
        fs.readFile(publicDir + fileName, (err, data) => {
            if (!err && data) {
                callback(false, data)
            } else {
                callback('No file could be found')
            }
        })
    } else {
        callback('A valid file name was not specified')
    }
}















// Export Module
module.exports = helpers
