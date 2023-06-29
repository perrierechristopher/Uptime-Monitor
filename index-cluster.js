// Primary file for the API

// Dependencies
const server = require("./lib/server");
const workers = require("./lib/worker");
const cli = require("./lib/cli");
const cluster = require("cluster");
const os = require("os");

// Declare app
let app = {};

// Init function
app.init = (callback) => {

  // If on the master thread, start background workers and CLI
  if (cluster.isMaster) {
    // Start worker
    workers.init();

    // Start the CLI, but make sure it starts last
    setTimeout(() => {
      cli.init();
      callback();
    }, 50);

    // Fork the process

    for(let i = 0; i < os.cpus().length; i++) {
      cluster.fork()
    }
  } else {
    // Start server
    server.init();
  }
};

// Slef invoking only if required directly
if (require.main === module) {
  app.init(() => {});
}

// Export the app
module.exports = app;
