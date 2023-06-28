// Primary file for the API

// Dependencies
const server = require('./lib/server')
const workers = require('./lib/worker')
const cli = require("./lib/cli")

// Declare app
let app = {}

// Init function
app.init = (callback) => {
    // Start server
    server.init()

    // Start worker
    workers.init()

    // Start the CLI, but make sure it starts last
    setTimeout(()=>{
        cli.init()
        callback()
    }, 50)
}

// Slef invoking only if required directly
if(require.main === module) {
    app.init(()=>{})
}






// Export the app
module.exports = app


