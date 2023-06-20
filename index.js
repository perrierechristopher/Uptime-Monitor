// Primary file for the API

// Dependencies
const server = require('./lib/server')
const workers = require('./lib/worker')

// Declare app
let app = {}

// Init function
app.init = () => {
    // Start server
    server.init()

    // Start worker
    workers.init()
}

// Execute
app.init()





// Export the app
module.exports = app


