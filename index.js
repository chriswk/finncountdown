var path = require('path');
global.appRoot = path.resolve(__dirname);
var server = require("./server/server");
server.createServer(process.env.PORT || 3000);
