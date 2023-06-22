// Primary file for the API

// Dependencies
const server = require('./lib/server')
const workers = require('./lib/worker')
const cli = require("./lib/cli")

// Declare app
let app = {}

// Init function
app.init = () => {
    // Start server
    server.init()

    // Start worker
    workers.init()

    // Start the CLI, but make sure it starts last
    setTimeout(()=>{
        cli.init()
    }, 50)
}

// Execute
app.init()





// Export the app
module.exports = app


