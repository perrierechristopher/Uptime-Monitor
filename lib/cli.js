// CLI Related Tasks

// Dependencies
const readline = require("readline");
const util = require("util");
const debug = util.debuglog('cli');
const events = require("events");
class _events extends events { };
let e = new _events()

// Instantiate the CLI module object
let cli = {};

// Input handlers
e.on("man", (str) => {
    cli.responders.help();
})

e.on("help", (str) => {
    cli.responders.help();
})

e.on("exit", (str) => {
    cli.responders.exit();
})

e.on("stats", (str) => {
    cli.responders.stats();
})

e.on("list users", (str) => {
    cli.responders.listUsers();
})

e.on("more user info", (str) => {
    cli.responders.moreUserInfo(str);
})

e.on("list checks", (str) => {
    cli.responders.listChecks(str);
})

e.on("more check info", (str) => {
    cli.responders.moreCheckInfo(str);
})

e.on("list logs", (str) => {
    cli.responders.listLogs();
})

e.on("more log info", (str) => {
    cli.responders.moreLogInfo(str);
})
// Responders object
cli.responders = {};

// Help / Man
cli.responders.help = () => {
    console.log("You asked for help");
}

cli.responders.exit = () => {
    process.exit(0)
}

cli.responders.stats = () => {
    console.log("You asked for stats");
}

cli.responders.listUsers = () => {
    console.log("You asked to list users");
}

cli.responders.moreUserInfo = (str) => {
    console.log("You asked for more user info", str);
}

cli.responders.listChecks = (str) => {
    console.log("You asked to list checks", str);
}

cli.responders.moreCheckInfo = (str) => {
    console.log("You asked for more check info", str);
}

cli.responders.listLogs = () => {
    console.log("You asked to list logs");
}

cli.responders.moreLogInfo = (str) => {
    console.log("You asked for more log info", str);
}



// Input processor
cli.processInput = (str) => {
    str = typeof (str) === 'string' && str.trim().length > 0 ? str.trim() : false;
    // Only process if the input if the user actually wrote something, otherwise ignore
    if (str) {
        // Codify the unique strings that identify the unique questions allowed to be asked
        let uniqueInputs = [
            'man',
            'help',
            'exit',
            'stats',
            'list users',
            'more user info',
            'list checks',
            'more check info',
            'list logs',
            'more log info'
        ]

        // Go through the possible inputs, emit an event when a match is found
        let matchFound = false;
        let counter = 0;
        uniqueInputs.some((input) => {
            if(str.toLowerCase().indexOf(input) > -1) {
                matchFound = true;
                // Emit an event matching the unique input and include the full string given
                e.emit(input, str)
                return true;
            }
        })

        // If no matchFound, tell the user to try again
        if(!matchFound) {
            console.log("Sorry, Try again");
        }
    }
}

// Init script

cli.init = () => {
    // Send the start message to the console, in dark blue
    console.log('\x1b[34m%s\x1b[0m', "The cli is running")

    // Start the interface
    let _interface = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: "> ",
    })

    // Create an initial prompt
    _interface.prompt();

    // Handle each line of input separately
    _interface.on("line", (str) => {
        // Send to the input processor
        cli.processInput(str)

        // Re-initiliaze the prompt afterwards
        _interface.prompt()
    })

    // If the user stops the CLI, Kill the associated process
    _interface.on("close", () => {
        process.exit(0)
    })
}












// Export the module
module.exports = cli


