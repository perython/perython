var express = require('express');
var path = require('path');

var argv = require('yargs')
            .usage('Start the server')
            .default('port', process.env.WEB_PORT || 3000)
            .alias('port', 'p')
            .describe('port', 'port to run on')
            .argv;
var server = express();

console.log(path.join(__dirname, '../static'));
server.use(express.static(path.join(__dirname, '../')));

server.listen(argv.port);

module.exports = server;
