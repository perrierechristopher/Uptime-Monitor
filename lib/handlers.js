// Request handlers

// Dependencies
const _data = require("./data");
const helpers = require("./helpers");
const config = require("./config");
const _url = require("url");
const dns = require("dns");
const _performance = require("perf_hooks").performance;
const util = require("util");
const debug = util.debuglog("performance");

//Define the handlers
let handlers = {};

// HTML HANDLERS ----------------------------------

// Index handler
handlers.index = (data, callback) => {
  // callback(undefined, undefined, 'html') // Make status code default 200 and body empty html string, but default to JSON

  if (data.method === "get") {
    // Prepare data for interpolation
    let templateData = {
      "head.title": "Uptime Monitoring - Made Simple",
      "head.description":
        "We offer free, simple uptime monitoring for HTTP/HTTPS sites of all kind",
      "body.title": "Uptime Monitoring",
      "body.class": "index",
    };

    // Read in the index template as a string
    helpers.getTemplate("index", templateData, (err, str) => {
      if (!err && str) {
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, (err, finalstr) => {
          if (!err && finalstr) {
            // Return that page as html
            callback(200, finalstr, "html");
          } else {
            callback(500, undefined, "html");
          }
        });
      } else {
        callback(500, undefined, "html");
      }
    });
  } else {
    callback(405, undefined, "html");
  }
};

// Create Account
handlers.accountCreate = (data, callback) => {
  if (data.method === "get") {
    // Prepare data for interpolation
    let templateData = {
      "head.title": "Create an Account",
      "head.description": "Signup is easy and only takes a few seconds",
      "body.class": "accountCreate",
    };

    // Read in the index template as a string
    helpers.getTemplate("accountCreate", templateData, (err, str) => {
      if (!err && str) {
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, (err, finalstr) => {
          if (!err && finalstr) {
            // Return that page as html
            callback(200, finalstr, "html");
          } else {
            callback(500, undefined, "html");
          }
        });
      } else {
        callback(500, undefined, "html");
      }
    });
  } else {
    callback(405, undefined, "html");
  }
};

// Create New Session
handlers.sessionCreate = (data, callback) => {
  if (data.method === "get") {
    // Prepare data for interpolation
    let templateData = {
      "head.title": "Login to your Account",
      "head.description":
        "Please enter your phone and password to access your account",
      "body.class": "sessionCreate",
    };

    // Read in the index template as a string
    helpers.getTemplate("sessionCreate", templateData, (err, str) => {
      if (!err && str) {
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, (err, finalstr) => {
          if (!err && finalstr) {
            // Return that page as html
            callback(200, finalstr, "html");
          } else {
            callback(500, undefined, "html");
          }
        });
      } else {
        callback(500, undefined, "html");
      }
    });
  } else {
    callback(405, undefined, "html");
  }
};

// Session Deleted
handlers.sessionDeleted = (data, callback) => {
  if (data.method === "get") {
    // Prepare data for interpolation
    let templateData = {
      "head.title": "Logged Out",
      "head.description": "You have been logged out of your account",
      "body.class": "sessionDeleted",
    };

    // Read in the index template as a string
    helpers.getTemplate("sessionDeleted", templateData, (err, str) => {
      if (!err && str) {
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, (err, finalstr) => {
          if (!err && finalstr) {
            // Return that page as html
            callback(200, finalstr, "html");
          } else {
            callback(500, undefined, "html");
          }
        });
      } else {
        callback(500, undefined, "html");
      }
    });
  } else {
    callback(405, undefined, "html");
  }
};

// Edit your account
handlers.accountEdit = (data, callback) => {
  if (data.method === "get") {
    // Prepare data for interpolation
    let templateData = {
      "head.title": "Account Settings",
      "body.class": "accountEdit",
    };

    // Read in the index template as a string
    helpers.getTemplate("accountEdit", templateData, (err, str) => {
      if (!err && str) {
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, (err, finalstr) => {
          if (!err && finalstr) {
            // Return that page as html
            callback(200, finalstr, "html");
          } else {
            callback(500, undefined, "html");
          }
        });
      } else {
        callback(500, undefined, "html");
      }
    });
  } else {
    callback(405, undefined, "html");
  }
};

// Delete your account
handlers.accountDeleted = (data, callback) => {
  if (data.method === "get") {
    // Prepare data for interpolation
    let templateData = {
      "head.title": "Account Deleted",
      "head.description": "Your account has been deleted",
      "body.class": "accountDeleted",
    };

    // Read in the index template as a string
    helpers.getTemplate("accountDeleted", templateData, (err, str) => {
      if (!err && str) {
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, (err, finalstr) => {
          if (!err && finalstr) {
            // Return that page as html
            callback(200, finalstr, "html");
          } else {
            callback(500, undefined, "html");
          }
        });
      } else {
        callback(500, undefined, "html");
      }
    });
  } else {
    callback(405, undefined, "html");
  }
};

// Create a new check
handlers.checksCreate = (data, callback) => {
  if (data.method === "get") {
    // Prepare data for interpolation
    let templateData = {
      "head.title": "Create a new check",
      "body.class": "checksCreate",
    };

    // Read in the index template as a string
    helpers.getTemplate("checksCreate", templateData, (err, str) => {
      if (!err && str) {
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, (err, finalstr) => {
          if (!err && finalstr) {
            // Return that page as html
            callback(200, finalstr, "html");
          } else {
            callback(500, undefined, "html");
          }
        });
      } else {
        callback(500, undefined, "html");
      }
    });
  } else {
    callback(405, undefined, "html");
  }
};

// Dahsboard (view all checks)
handlers.checksList = (data, callback) => {
  if (data.method === "get") {
    // Prepare data for interpolation
    let templateData = {
      "head.title": "Dashboard",
      "body.class": "checksList",
    };

    // Read in the index template as a string
    helpers.getTemplate("checksList", templateData, (err, str) => {
      if (!err && str) {
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, (err, finalstr) => {
          if (!err && finalstr) {
            // Return that page as html
            callback(200, finalstr, "html");
          } else {
            callback(500, undefined, "html");
          }
        });
      } else {
        callback(500, undefined, "html");
      }
    });
  } else {
    callback(405, undefined, "html");
  }
};

// Edit a check
handlers.checksEdit = (data, callback) => {
  if (data.method === "get") {
    // Prepare data for interpolation
    let templateData = {
      "head.title": "Check Details",
      "body.class": "checksEdit",
    };

    // Read in the index template as a string
    helpers.getTemplate("checksEdit", templateData, (err, str) => {
      if (!err && str) {
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, (err, finalstr) => {
          if (!err && finalstr) {
            // Return that page as html
            callback(200, finalstr, "html");
          } else {
            callback(500, undefined, "html");
          }
        });
      } else {
        callback(500, undefined, "html");
      }
    });
  } else {
    callback(405, undefined, "html");
  }
};

// Favicon
handlers.favicon = (data, callback) => {
  if (data.method === "get") {
    helpers.getStaticAsset("favicon.ico", (err, data) => {
      if (!err && data) {
        callback(200, data, "favicon");
      } else {
        callback(500);
      }
    });
  } else {
    callback(405);
  }
};

handlers.public = (data, callback) => {
  if (data.method === "get") {
    let trimmedAssetName = data.trimmedPath.replace("public/", "").trim();
    if (trimmedAssetName.length > 0) {
      helpers.getStaticAsset(trimmedAssetName, (err, data) => {
        if (!err && data) {
          let contentType = "plain";

          if (trimmedAssetName.indexOf(".css") > -1) {
            contentType = "css";
          }
          if (trimmedAssetName.indexOf(".png") > -1) {
            contentType = "png";
          }
          if (trimmedAssetName.indexOf(".jpg") > -1) {
            contentType = "jpg";
          }
          if (trimmedAssetName.indexOf(".ico") > -1) {
            contentType = "favicon";
          }

          callback(200, data, contentType);
        } else {
          callback(404);
        }
      });
    } else {
    }
  } else {
    callback(405);
  }
};

// Example Error
handlers.exampleError = (data, callback) => {
  let err = new Error("This is an example error");
  throw err;
};

// JSON API HANDLERS ------------------------------
// Users
handlers.users = (data, callback) => {
  let acceptableMethods = ["post", "get", "put", "delete"];
  if (acceptableMethods.indexOf(data.method) !== -1) {
    handlers._users[data.method](data, callback);
  } else {
    callback(405); // For method not allowed
  }
};

// Container for users sub methods
handlers._users = {};

// Users-post
// Required data: firstName, lastName, phone, password, tosA
handlers._users.post = (data, callback) => {
  //Check fields if they are all filled
  let firstName =
    typeof data.payload.firstName === "string" &&
    data.payload.firstName.trim().length > 0
      ? data.payload.firstName.trim()
      : false;
  let lastName =
    typeof data.payload.lastName === "string" &&
    data.payload.lastName.trim().length > 0
      ? data.payload.lastName.trim()
      : false;
  let phone =
    typeof data.payload.phone === "string" &&
    data.payload.phone.trim().length === 9
      ? data.payload.phone.trim()
      : false;
  let password =
    typeof data.payload.password === "string" &&
    data.payload.password.trim().length > 0
      ? data.payload.password.trim()
      : false;
  let tosAgreement =
    typeof data.payload.tosAgreement === "boolean" &&
    data.payload.tosAgreement === true
      ? true
      : false;

  if (firstName && lastName && phone && password && tosAgreement) {
    //Make sure that the user doesn't already exist
    _data.read("users", phone, (err, data) => {
      if (err) {
        // Hash the password
        let hashedPassword = helpers.hash(password);

        // Create the user object
        if (hashedPassword) {
          let userObject = {
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            password: hashedPassword,
            tosAgreement: true,
          };

          // Store the user
          _data.create("users", phone, userObject, (err) => {
            if (!err) {
              callback(200);
            } else {
              callback(500, { Error: "Could not create the new user" });
            }
          });
        } else {
          callback(500, { Error: "Could not hash the user's password" });
        }
      } else {
        // User already exists
        callback(400, {
          Error: "A user with that phone number already exists",
        });
      }
    });
  } else {
    callback(400, { Error: "Missing required fields" });
  }
};

// Users - get
// Required data: phone
// Optional data: none
// @TODO Only let an authenticated user access their object. Not anyone else's object

handlers._users.get = (data, callback) => {
  // Check if the phone number is valid
  let phone =
    typeof data.queryStringObject.phone === "string" &&
    data.queryStringObject.phone.trim().length === 9
      ? data.queryStringObject.phone.trim()
      : false;
  if (phone) {
    // Get the token from the headers
    let token =
      typeof data.headers.token === "string" ? data.headers.token : false;

    // Verify that the given token is valid
    handlers._tokens.verifyToken(token, phone, (tokenIsValid) => {
      if (tokenIsValid) {
        // Lookup the user
        _data.read("users", phone, (err, data) => {
          if (!err && data) {
            // Remove the hashed password from the user object before returning it
            delete data.password;
            callback(200, data);
          } else {
            callback(404);
          }
        });
      } else {
        callback(403, {
          Error: "Missing required token in header, or token is invalid",
        });
      }
    });
  } else {
    callback(400, { Error: "Missing required fields" });
  }
};

// Users-put
// Required data: phone
// Optional data: Everything else
handlers._users.put = (data, callback) => {
  // Check for required field
  let phone =
    typeof data.payload.phone === "string" &&
    data.payload.phone.trim().length === 9
      ? data.payload.phone.trim()
      : false;

  // Check for optional field
  let firstName =
    typeof data.payload.firstName === "string" &&
    data.payload.firstName.trim().length > 0
      ? data.payload.firstName.trim()
      : false;
  let lastName =
    typeof data.payload.lastName === "string" &&
    data.payload.lastName.trim().length > 0
      ? data.payload.lastName.trim()
      : false;
  let password =
    typeof data.payload.password === "string" &&
    data.payload.password.trim().length > 0
      ? data.payload.password.trim()
      : false;

  if (phone) {
    if (firstName || lastName || password) {
      // Get the token from the headers
      let token =
        typeof data.headers.token === "string" ? data.headers.token : false;

      // Verify that the given token is valid
      handlers._tokens.verifyToken(token, phone, (tokenIsValid) => {
        if (tokenIsValid) {
          //Lookup for users
          _data.read("users", phone, (err, userData) => {
            if (!err && data) {
              if (firstName) {
                userData.firstName = firstName;
              }

              if (lastName) {
                userData.lastName = lastName;
              }

              if (password) {
                userData.password = helpers.hash(password);
              }
            } else {
              callback(400, { Error: "User does not exist" });
            }

            //Store the new update

            _data.update("users", phone, userData, (err) => {
              if (!err) {
                callback(200);
              } else {
                callback(500, { Error: "Could not update user" });
              }
            });
          });
        } else {
          callback(403, {
            Error: "Missing required token in header, or token is invalid",
          });
        }
      });
    } else {
      callback(400, { Error: "Missing fields to update" });
    }
  } else {
    callback(400, { Error: "Missing required field" });
  }
};

// Users-delete
// Required field : phone
handlers._users.delete = (data, callback) => {
  // Check if phone number is valid
  let phone =
    typeof data.queryStringObject.phone === "string" &&
    data.queryStringObject.phone.trim().length === 9
      ? data.queryStringObject.phone.trim()
      : false;
  if (phone) {
    // Get the token from the headers
    let token =
      typeof data.headers.token === "string" ? data.headers.token : false;

    // Verify that the given token is valid
    handlers._tokens.verifyToken(token, phone, (tokenIsValid) => {
      if (tokenIsValid) {
        // Lookup the user
        _data.read("users", phone, (err, userData) => {
          if (!err && data) {
            // Remove the user from data
            _data.delete("users", phone, (err) => {
              if (!err) {
                // Delete each of the checks associated with the user
                let userChecks =
                  typeof userData.checks === "object" &&
                  userData.checks instanceof Array
                    ? userData.checks
                    : [];
                let checksToDelete = userChecks.length;

                if (checksToDelete > 0) {
                  let checksDeleted = 0;
                  let deletionErrors = false;

                  // Loop through checks
                  userChecks.forEach((checkId) => {
                    //Delete the check
                    _data.delete("checks", checkId, (err) => {
                      if (err) {
                        deletionErrors = true;
                      }
                      checksDeleted++;
                      if (checksDeleted == checksToDelete) {
                        if (!deletionErrors) {
                          callback(200);
                        } else {
                          callback(500, {
                            Error:
                              "Errors encountered while attempting to delete all of the user's checks, some may not have been deleted successfully",
                          });
                        }
                      }
                    });
                  });
                }
              } else {
                callback(500, { Error: "Could not delete specified user" });
              }
            });
          } else {
            callback(400, { Error: "Could not find specified user" });
          }
        });
      } else {
        callback(403, {
          Error: "Missing required token in header, or token is invalid",
        });
      }
    });
  } else {
    callback(400, { Error: "Missing required field" });
  }
};

// Tokens

handlers.tokens = (data, callback) => {
  let acceptableMethods = ["post", "get", "put", "delete"];
  if (acceptableMethods.indexOf(data.method) !== -1) {
    handlers._tokens[data.method](data, callback);
  } else {
    callback(405); // For method not allowed
  }
};

// Containers for all the token methods
handlers._tokens = {};

//Tokens post
// Required data: phone, password
// Optional data: none
handlers._tokens.post = (data, callback) => {
  _performance.mark("Entered function");
  let phone =
    typeof data.payload.phone === "string" &&
    data.payload.phone.trim().length === 9
      ? data.payload.phone.trim()
      : false;
  let password =
    typeof data.payload.password === "string" &&
    data.payload.password.trim().length > 0
      ? data.payload.password.trim()
      : false;

  _performance.mark("Inputs validated");
  if (phone && password) {
    // Lookup the user who matches that phone number
    _performance.mark("Beginning user lookup");
    _data.read("users", phone, (err, userData) => {
      _performance.mark("User lookup complete");
      if (!err && userData) {
        _performance.mark("Beginning password hashing");
        let hashedPassword = helpers.hash(password);
        _performance.mark("Password hashing complete");
        if (hashedPassword === userData.password) {
          // If valid, create a new token with a random name. Set expiration date 1 hour

          _performance.mark("Creating data for token");
          let tokenId = helpers.createRandomString(20);
          let expires = Date.now() + 1000 * 60 * 60; // 1 hour
          let tokenObject = {
            phone: phone,
            id: tokenId,
            expires: expires,
          };

          // Store the token
          _performance.mark("Beginning storing token");
          _data.create("tokens", tokenId, tokenObject, (err) => {
            _performance.mark("Storing token complete");

            // Gather all the measurements
            _performance.measure(
              "Beginning to end",
              "Entered function",
              "Storing token complete"
            );
            _performance.measure(
              "Validating user input",
              "Entered function",
              "Inputs validated"
            );
            _performance.measure(
              "User lookup",
              "Beginning user lookup",
              "User lookup complete"
            );
            _performance.measure(
              "Password hashing",
              "Beginning password hashing",
              "Password hashing complete"
            );
            _performance.measure(
              "Token data creation",
              "Creating data for token",
              "Beginning storing token"
            );
            _performance.measure(
              "Token storing",
              "Beginning storing token",
              "Storing token complete"
            );

            // Log out all the measurements
            let measurements = _performance.getEntriesByType("measure");
            measurements.forEach((measurement) => {
              debug(
                "\x1b[33m%s\x1b[0m",
                measurement.name + " " + measurement.duration
              );
            });

            if (!err) {
              callback(200, tokenObject);
            } else {
              callback(500, { Error: "Could not create the new token" });
            }
          });
        } else {
          callback(400, {
            Error:
              "Password did not match the specified user's stored password",
          });
        }
      } else {
        callback(400, { Error: "Cannot find the specified user" });
      }
    });
  } else {
    callback(400, { Error: "Missing required field(s)" });
  }
};

//Tokens get
handlers._tokens.get = (data, callback) => {
  let id =
    typeof data.queryStringObject.id === "string" &&
    data.queryStringObject.id.trim().length === 20
      ? data.queryStringObject.id.trim()
      : false;
  if (id) {
    // Lookup the user
    _data.read("tokens", id, (err, tokenData) => {
      if (!err && tokenData) {
        // Return tokenData
        callback(200, tokenData);
      } else {
        callback(404, { Error: "Token not found" });
      }
    });
  } else {
    callback(400, { Error: "Missing required fields" });
  }
};

// Tokens put
// Required data: phone, extend
// Optional data: none
handlers._tokens.put = (data, callback) => {
  let id =
    typeof data.payload.id === "string" && data.payload.id.trim().length === 20
      ? data.payload.id.trim()
      : false;
  let extend =
    typeof data.payload.extend === "boolean" && data.payload.extend === true
      ? true
      : false;

  if (id && extend) {
    _data.read("tokens", id, (err, tokenData) => {
      if (!err && tokenData) {
        //Check to make sure token has not expired
        if (tokenData.expires > Date.now()) {
          // Set expiration date 1h from now
          tokenData.expires = Date.now() + 1000 * 60 * 60; // add 1h

          // Store the new updates
          _data.update("tokens", id, tokenData, (err) => {
            if (!err) {
              callback(200, tokenData);
            } else {
              callback(500, { Error: "Could not update the token" });
            }
          });
        } else {
          callback(400, {
            Error: "Token has already expired and cannot be extended",
          });
        }
      } else {
        callback(400, { Error: "Specified token does not exist" });
      }
    });
  } else {
    callback(400, { Error: "Missing required field(s) or field(s) invalid" });
  }
};

//Tokens delete
// Required data: id
// Optional data: none
handlers._tokens.delete = (data, callback) => {
  // Check if ID is valid
  let id =
    typeof data.queryStringObject.id === "string" &&
    data.queryStringObject.id.trim().length === 20
      ? data.queryStringObject.id.trim()
      : false;

  if (id) {
    // Lookup for token
    _data.read("tokens", id, (err, data) => {
      if (!err && data) {
        // Remove the user from data
        _data.delete("tokens", id, (err) => {
          if (!err) {
            callback(200);
          } else {
            callback(500, { Error: "Could not delete specified token" });
          }
        });
      } else {
        callback(400, { Error: "Could not find specified token" });
      }
    });
  } else {
    callback(400, { Error: "Missing required field" });
  }
};

// Verify if a given token is valid for a given user

handlers._tokens.verifyToken = (id, phone, callback) => {
  // Lookup for a given token
  _data.read("tokens", id, (err, tokenData) => {
    if (!err && tokenData) {
      // Check that the token is for the given user and has not expired
      if (tokenData.phone === phone && tokenData.expires > Date.now()) {
        callback(true);
      } else {
        callback(false);
      }
    } else {
      callback(false);
    }
  });
};

// Checks
handlers.checks = (data, callback) => {
  let acceptableMethods = ["post", "get", "put", "delete"];
  if (acceptableMethods.indexOf(data.method) !== -1) {
    handlers._checks[data.method](data, callback);
  } else {
    callback(405); // For method not allowed
  }
};

// Containers for all the token methods
handlers._checks = {};

// Checks - post
/* Required data: 
 - protocol: http/https, 
 - url: to be checked, 
 - method: post, get, put, delete, 
 - successCodes: array of codes to be treated as success, 
 - timeoutSeconds: timeout
*/

handlers._checks.post = (data, callback) => {
  let protocol =
    typeof data.payload.protocol === "string" &&
    ["https", "http"].indexOf(data.payload.protocol) > -1
      ? data.payload.protocol
      : false;
  let url =
    typeof data.payload.url === "string" && data.payload.url.trim().length > 0
      ? data.payload.url.trim()
      : false;
  let method =
    typeof data.payload.method === "string" &&
    ["post", "get", "put", "delete"].indexOf(data.payload.method) > -1
      ? data.payload.method
      : false;
  let successCodes =
    typeof data.payload.successCodes === "object" &&
    data.payload.successCodes instanceof Array &&
    data.payload.successCodes.length > 0
      ? data.payload.successCodes
      : false;
  let timeoutSeconds =
    typeof data.payload.timeoutSeconds === "number" &&
    data.payload.timeoutSeconds % 1 === 0 &&
    data.payload.timeoutSeconds >= 1 &&
    data.payload.timeoutSeconds <= 5
      ? data.payload.timeoutSeconds
      : false;

  if (protocol && url && method && successCodes && timeoutSeconds) {
    //Get the token from the headers
    let token =
      typeof data.headers.token === "string" ? data.headers.token : false;

    // Look up the user
    _data.read("tokens", token, (err, tokenData) => {
      if (!err && tokenData) {
        let userPhone = tokenData.phone;

        // Lookup the user data
        _data.read("users", userPhone, (err, userData) => {
          if (!err && userData) {
            let userChecks =
              typeof userData.checks === "object" &&
              userData.checks instanceof Array
                ? userData.checks
                : [];

            //Verify that the user has less than the number of max-checks-per-user

            if (userChecks.length < config.maxChecks) {
              // Verify that the URL given has DNS entries (and therefore can resolve)
              let parsedUrl = _url.parse(protocol + "://" + url, true);
              let hostName =
                typeof parsedUrl.hostname == "string" &&
                parsedUrl.hostname.length > 0
                  ? parsedUrl.hostname
                  : false;

              dns.resolve(hostName, (err, records) => {
                if (!err && records) {
                  //Create a random id for the check
                  let checkId = helpers.createRandomString(20);

                  // Create the check object, and include the user's phone
                  let checkObject = {
                    id: checkId,
                    userPhone: userPhone,
                    protocol: protocol,
                    url: url,
                    method: method,
                    successCodes: successCodes,
                    timeoutSeconds: timeoutSeconds,
                  };

                  // Save the object
                  _data.create("checks", checkId, checkObject, (err) => {
                    if (!err) {
                      // Add the check id to the user's object
                      userData.checks = userChecks;
                      userData.checks.push(checkId);

                      // Save the new user data
                      _data.update("users", userPhone, userData, (err) => {
                        if (!err) {
                          callback(200, checkObject);
                        } else {
                          callback(500, {
                            Error: "Could not update the user with new check",
                          });
                        }
                      });
                    } else {
                      callback(500, {
                        Error: "Could not create the new check",
                      });
                    }
                  });
                } else {
                  callback(400, {
                    Error:
                      "The hostname of the URL entered did not resolve to any DNS entry",
                  });
                }
              });
            } else {
              callback(400, {
                Error:
                  "The user already has maximum number of checks: " +
                  config.maxChecks,
              });
            }
          } else {
            callback(403);
          }
        });
      } else {
        callback(403);
      }
    });
  } else {
    callback(400, { Error: "Missinf required inputs or inputs are invalid" });
  }
};

// Checks - get
// Required data : id
// Optional data : none

handlers._checks.get = (data, callback) => {
  // Check if the id number is valid
  let id =
    typeof data.queryStringObject.id === "string" &&
    data.queryStringObject.id.trim().length === 20
      ? data.queryStringObject.id.trim()
      : false;
  if (id) {
    // Lookup the check
    _data.read("checks", id, (err, checkData) => {
      if (!err && checkData) {
        // Get the token from the headers
        let token =
          typeof data.headers.token === "string" ? data.headers.token : false;

        // Verify that the given token is valid and belongs to the one who created the check
        handlers._tokens.verifyToken(
          token,
          checkData.userPhone,
          (tokenIsValid) => {
            if (tokenIsValid) {
              // Return the check data
              callback(200, checkData);
            } else {
              callback(403);
            }
          }
        );
      } else {
        callback(404);
      }
    });
  } else {
    callback(400, { Error: "Missing required fields" });
  }
};

// Check - put
// Required data : id
// Optional data :  protocol, url, method, successCodes, timeoutSeconds one must be sent
handlers._checks.put = (data, callback) => {
  // Check for required field
  let id =
    typeof data.payload.id === "string" && data.payload.id.trim().length === 20
      ? data.payload.id.trim()
      : false;

  // Check for optional field
  let protocol =
    typeof data.payload.protocol === "string" &&
    ["https", "http"].indexOf(data.payload.protocol) > -1
      ? data.payload.protocol
      : false;
  let url =
    typeof data.payload.url === "string" && data.payload.url.trim().length > 0
      ? data.payload.url.trim()
      : false;
  let method =
    typeof data.payload.method === "string" &&
    ["post", "get", "put", "delete"].indexOf(data.payload.method) > -1
      ? data.payload.method
      : false;
  let successCodes =
    typeof data.payload.successCodes === "object" &&
    data.payload.successCodes instanceof Array &&
    data.payload.successCodes.length > 0
      ? data.payload.successCodes
      : false;
  let timeoutSeconds =
    typeof data.payload.timeoutSeconds === "number" &&
    data.payload.timeoutSeconds % 1 === 0 &&
    data.payload.timeoutSeconds >= 1 &&
    data.payload.timeoutSeconds <= 5
      ? data.payload.timeoutSeconds
      : false;

  // Check to make sure id is valid
  if (id) {
    // Check to make sure one or more optional fields has been sent
    if (protocol || url || method || successCodes || timeoutSeconds) {
      // Lookup the check
      _data.read("checks", id, (err, checkData) => {
        if (!err && checkData) {
          // Get the token from the headers
          let token =
            typeof data.headers.token === "string" ? data.headers.token : false;

          // Verify that the given token is valid and belongs to the one who created the check
          handlers._tokens.verifyToken(
            token,
            checkData.userPhone,
            (tokenIsValid) => {
              if (tokenIsValid) {
                //Update the check where necessary
                if (protocol) {
                  checkData.protocol = protocol;
                }
                if (url) {
                  checkData.url = url;
                }
                if (method) {
                  checkData.method = method;
                }
                if (successCodes) {
                  checkData.successCodes = successCodes;
                }
                if (timeoutSeconds) {
                  checkData.timeoutSeconds = timeoutSeconds;
                }

                //Store the new updates
                _data.update("checks", id, checkData, (err) => {
                  if (!err) {
                    callback(200);
                  } else {
                    callback(500, { Error: "Could not update the check" });
                  }
                });
              } else {
                callback(403);
              }
            }
          );
        } else {
          callback(400, { Error: "Check Id does not exist" });
        }
      });
    } else {
    }
  } else {
    callback(400, { Error: "Missing required field" });
  }
};

// Checks delete
// Required data: id
handlers._checks.delete = (data, callback) => {
  // Check if ID is valid
  let id =
    typeof data.queryStringObject.id === "string" &&
    data.queryStringObject.id.trim().length === 20
      ? data.queryStringObject.id.trim()
      : false;

  if (id) {
    // Lookup the check
    _data.read("checks", id, (err, checkData) => {
      if (!err && checkData) {
        // Get the token from the headers
        let token =
          typeof data.headers.token === "string" ? data.headers.token : false;

        // Verify that the given token is valid
        handlers._tokens.verifyToken(
          token,
          checkData.userPhone,
          (tokenIsValid) => {
            if (tokenIsValid) {
              // Delete the check data
              _data.delete("checks", id, (err) => {
                if (!err) {
                  // Lookup for checks
                  _data.read("users", checkData.userPhone, (err, userData) => {
                    if (!err && userData) {
                      let userChecks =
                        typeof userData.checks === "object" &&
                        userData.checks instanceof Array
                          ? userData.checks
                          : [];

                      // Remove the delete check from their list of check
                      var checkPosition = userChecks.indexOf(id);
                      if (checkPosition > -1) {
                        userChecks.splice(checkPosition, 1);

                        // Re-save the user's data
                        _data.update(
                          "users",
                          checkData.userPhone,
                          userData,
                          (err) => {
                            if (!err) {
                              callback(200);
                            } else {
                              callback(500, {
                                Error: "Could not update specified token",
                              });
                            }
                          }
                        );
                      } else {
                        callback(500, {
                          Error: "Could not find the check on the user object",
                        });
                      }
                    } else {
                      callback(400, {
                        Error:
                          "Could not find specified user who created check",
                      });
                    }
                  });
                } else {
                  callback(500, {
                    Error: "Could not dele the specified check",
                  });
                }
              });
            } else {
              callback(403);
            }
          }
        );
      } else {
        callback(400, { Error: "The specified check ID does not exist" });
      }
    });
  } else {
    callback(400, { Error: "Missing required field" });
  }
};

// ping handler
handlers.ping = (data, callback) => {
  callback(200);
};

// Not found handler
handlers.notFound = (data, callback) => {
  callback(404);
};

module.exports = handlers;
