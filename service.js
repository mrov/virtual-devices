var express = require('express');
var bodyparser = require('body-parser');
var air_controller = require('./mqtt/air/air_controller.js');
var lamp_controller = require('./mqtt/lamp/lamp_controller.js');
var lock_controller = require('./mqtt/lock/lock_controller.js');
var therm_controller = require('./mqtt/therm/therm_controller.js');
var app = express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
  extended: true
}));

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/device', function(req, res){
    var type = req.query.type;
    var deviceId = req.query.id;
    var result = {};
    switch (type) {
        case "therm":
            result = {code: 200, data: {temperature: therm_controller.thermGetTemp(deviceId)}}
            break;
        case "air":
            result = {code: 200, data: {temperature: air_controller.airGetTemp(deviceId)}}
            break;
        case "lamp":
            result = {code: 200, data: {state: lamp_controller.lampGetState(deviceId)}}
            break;
        case "lock":
            result = {code: 200, data: {state: lock_controller.lockGetState(deviceId)}}
            break;
        default:
            result = {code: 406, data: "Device type not valid"};
            break;
    }
    res.send(result);
})

app.patch('/device', function(req, res){
    var type = req.query.type;
    var deviceId = req.query.id;
    var temperature = req.body.temperature;
    var state = req.body.state;
    var result = {};
    switch (type) {
        case "therm":
            result = {code: 405, data: "Invalid HTTP Verb for this device type (PATH Verb only)"}
            break;
        case "air":
            result = {code: 200, data: {temperature: air_controller.airChangeTemp(temperature,deviceId)}}
            break;
        case "lamp":
            result = {code: 200, data: {state: lamp_controller.lampChangeStatus(state,deviceId)}}
            break;
        case "lock":
            result = {code: 200, data: {state: lock_controller.lockChangeState(state,deviceId)}}
            break;
        default:
            result = {code: 406, data: "Device type not valid"};
            break;
    }
    res.send(result);
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
