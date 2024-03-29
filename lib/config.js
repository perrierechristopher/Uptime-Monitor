// Create and export configuration variables


// Container for all the environments

let environments = {};

// Staging (default) environment
environments.staging = {
    'httpPort': 3000,
    'httpsPort': 3001,
    'envName': 'staging',
    'hashingSecret': 'thisIsASecret',
    'maxChecks': 5,
    'twilio' : {
        'accountSid' : 'ACb32d411ad7fe886aac54c665d25e5c5d',
        'authToken' : '9455e3eb3109edc12e3d8c92768f7a67',
        'fromPhone' : '+15005550006'
      },
      'templateGlobals': {
        'appName' : "UptimeChecker",
        'companyName' : 'My Company',
        'yearCreated' : '2018',
        'baseUrl' : 'http://localhost:3000/'
      }
};


// Testing environment 
environments.testing = {
  'httpPort': 4000,
  'httpsPort': 4001,
  'envName': 'testingi',
  'hashingSecret': 'thisIsASecret',
  'maxChecks': 5,
  'twilio' : {
      'accountSid' : 'ACb32d411ad7fe886aac54c665d25e5c5d',
      'authToken' : '9455e3eb3109edc12e3d8c92768f7a67',
      'fromPhone' : '+15005550006'
    },
    'templateGlobals': {
      'appName' : "UptimeChecker",
      'companyName' : 'My Company',
      'yearCreated' : '2018',
      'baseUrl' : 'http://localhost:3000/'
    }
};



// Production environment
environments.production = {
    'httpPort': 5000,
    'httpsPort': 5001,
    'envName': 'production',
    'hashingSecret': 'thisIsASecret',
    'maxChecks': 5,
    'twilio' : {
        'accountSid' : '',
        'authToken' : '',
        'fromPhone' : ''
    },
    'templateGlobals': {
        'appName' : "UptimeChecker",
        'companyName' : 'My Company',
        'yearCreated' : '2018',
        'baseUrl' : 'http://localhost:5000/'
      }
}

// Detwermine which environment was passed as a command-line argument
let currentEnvironment = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.toLowerCase() : "";

// Check if current environment is defined above, if not default to staging
var environmentToExport = typeof(environments[currentEnvironment]) === "object" ? environments[currentEnvironment] : environments.staging;

module.exports = environmentToExport