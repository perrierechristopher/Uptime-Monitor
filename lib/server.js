
// Dependencies
const http = require('http');
const https = require("https");
const { StringDecoder } = require('string_decoder');
const url = require("url");
const fs = require("fs");
const handlers = require("./handlers");
const helpers = require("./helpers");
const path = require("path")
//const StringDecoder = require("string_decoder").StringDecoder;
const config = require("./config");
const util = require("util");
const debug = util.debuglog('server')

// Instantiate the server module object
let server = {}

// The server should respond to all requests with a string
server.httpServer = http.createServer(async (req, res) => {
    server.unifiedServers(req, res);
})

// Instantiates https server

server.httpsServerOptions = {
    'key': fs.readFileSync(path.join(__dirname, '/../https/key.pem')),
    'cert': fs.readFileSync(path.join(__dirname,'/../https/cert.pem')),
}

server.httpsServer = https.createServer(server.httpsServerOptions, async (req, res) => {
    server.unifiedServers(req, res)
})

// All the server logic for both http and https servers
server.unifiedServers = (req, res) => {
    // Get the url and parse it
    let parsedUrl = url.parse(req.url, true);

    // Get path from url
    let path = parsedUrl.pathname; //untrimmed path the user required

    let trimmedPath = path.replace(/^\/+|\/+$/g, "")

    // Get the query string as an object
    let queryStringObject = parsedUrl.query;

    // Get the HTTP Method
    let method = req.method.toLowerCase();

    // Get the headers as an object
    let headers = req.headers;

    // Get the payload
    let decoder = new StringDecoder('utf-8')
    let buffer = ''
    req.on("data", (data) => {
        buffer += decoder.write(data);
    })

    req.on("end", () => {

        buffer += decoder.end()

        //Choose the handler this request should go to
        let chosenHandler = typeof (server.router[trimmedPath]) !== 'undefined' ? server.router[trimmedPath] : handlers.notFound

        // If the request is within the public directory, use the public handler instead
        chosenHandler = trimmedPath.indexOf('public/') > -1 ? handlers.public : chosenHandler;

        // Construct the data object to send to the handler

        let data = {
            trimmedPath: trimmedPath,
            queryStringObject: queryStringObject,
            method: method,
            headers: headers,
            payload: helpers.parseJsonToObject(buffer)
        }

        // Route the request to the handler specified in the router
        try {
            chosenHandler(data, (statusCode, payload, contentType) => {
                server.processHandlerResponse(res, method, trimmedPath, statusCode, payload, contentType);
               
            })
        } catch(e) {
            debug(e)
            server.processHandlerResponse(res, method, trimmedPath, 500, {'Error' : 'An unknown error has occured'}, 'json')
        }
        

    })

}

// Process the response from the handler
server.processHandlerResponse = (res, method, trimmedPath, statusCode, payload, contentType) => {
     // Determine the type of response (fallback to JSON)
     contentType = typeof(contentType) === "string" ? contentType : "json"

     // Use the status code called back by the handler, or default to 200
     statusCode = typeof (statusCode) === "number" ? statusCode : 200;            

     // Return the response-parts that are content-specific
     let payloadString = ''
     if (contentType === 'json') {
         res.setHeader("Content-Type", "application/json");
         payload = typeof (payload) === 'object' ? payload : {};
         payloadString = JSON.stringify(payload);
     } 

     if ( contentType === "html" ) {
         res.setHeader("Content-Type", "text/html");
         payloadString = typeof (payload) === "string" ? payload : '';
     }

     if ( contentType === "favicon" ) {
         res.setHeader("Content-Type", "image/x-icon");
         payloadString = typeof (payload) !== "undefined" ? payload : '';
     }

     if ( contentType === "css" ) {
         res.setHeader("Content-Type", "text/css");
         payloadString = typeof (payload) !== "undefined" ? payload : '';
     }

     if ( contentType === "png" ) {
         res.setHeader("Content-Type", "image/png");
         payloadString = typeof (payload) !== "undefined" ? payload : '';
     }

     if ( contentType === "jpg" ) {
         res.setHeader("Content-Type", "image/jpeg");
         payloadString = typeof (payload) !== "undefined" ? payload : '';
     }

     if ( contentType === "plain" ) {
         res.setHeader("Content-Type", "text/plain");
         payloadString = typeof (payload) !== "undefined" ? payload : '';
     }



     // Return the response parts that are common to all content-types
     res.writeHead(statusCode)
     res.end(payloadString);

     // If the reponse is 200, print green otherwise print red
     if (statusCode === 200) {
         debug('\x1b[32m%s\x1b[0m', method.toUpperCase() + ' /' + trimmedPath + ' ' + statusCode);
     } else {
         debug('\x1b[31m%s\x1b[0m', method.toUpperCase() + ' /' + trimmedPath + ' ' + statusCode);
     }
}


// Define a request router
server.router = {
    '': handlers.index,
    'account/create': handlers.accountCreate,
    'account/edit': handlers.accountEdit,
    'account/deleted': handlers.accountDeleted,
    'session/create': handlers.sessionCreate,
    'session/deleted': handlers.sessionDeleted,
    'checks/all' : handlers.checksList,
    'checks/create' : handlers.checksCreate,
    'checks/edit' : handlers.checksEdit,
    'ping': handlers.ping,
    'api/users': handlers.users,
    'api/tokens': handlers.tokens,
    'api/checks': handlers.checks,
    'favicon.ico' : handlers.favicon,
    'public' : handlers.public,
    'examples/error' : handlers.exampleError
}

// Init function
server.init = () => {
    // Start the http server
    server.httpServer.listen(config.httpPort, () => {

        console.log('\x1b[36m%s\x1b[0m', "The server is listening on port " + config.httpPort)

        //console.log("The server is listening on port", config.httpPort);
    })

    // Start the https server

    server.httpsServer.listen(config.httpsPort, () => {

        console.log('\x1b[35m%s\x1b[0m', "The server is listening on port " + config.httpsPort)

        //console.log("The server is listening on port", config.httpsPort);
    })
}


// Module export server
module.exports = server