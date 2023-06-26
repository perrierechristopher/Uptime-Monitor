// Library that demonstrates something throwing when it's init() is calling




// Container for the mofule
let example = {}

// Exit function
example.init = () => {
    // This is an error create intentionally that is not defined
    let foo = bar
}


// Export the module
module.exports = example