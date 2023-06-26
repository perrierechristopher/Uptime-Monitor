// Primary file for the API

// Dependencies
const server = require('./lib/server')
const workers = require('./lib/worker')
const cli = require("./lib/cli")
const exampleDebuggingProblem = require("./lib/exampleDebuggingProblem")

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

    let foo = 1

    // Increment foo
    foo++

    // Square foo
    foo = foo * foo

    // Convert foo to string
    foo = foo.toString()


    // Call the init script that will throw error
    exampleDebuggingProblem.init()
}

// Execute
app.init()





// Export the app
module.exports = app


