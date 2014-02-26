// Constants
var PORT = 5000;

// The requirements
var express = require('express');
var app = express();
app.use(express.static(__dirname));
app.listen(PORT)
console.log('server started');