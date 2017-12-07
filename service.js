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

app.get('/device/air/:id', function(req, res){
    var deviceId = req.params.id;
    res.send(air_controller.airGetTemp(deviceId));
})

app.get('/device/lamp/:id', function(req, res){
    var deviceId = req.params.id;
    res.send(lamp_controller.lampGetState(deviceId));
});

app.get('/device/lock/:id', function(req, res){
    var deviceId = req.params.id;
    res.send(lock_controller.lockGetState(deviceId));
});

app.get('/device/therm/:id', function(req, res){
    var deviceId = req.params.id;
    res.send(therm_controller.thermGetTemp(deviceId));
});


app.patch('/device/air/:id', function(req, res){
    var deviceId = req.params.id;
    var temperature = req.body.temperature;
    var state = req.body.state;
    var result = {code: air_controller.airChangeTemp(temperature,deviceId)};
    res.send(result);
})

app.patch('/device/lamp/:id' , function(req, res){
    var deviceId = req.params.id;
    var state = req.body.state;
    var result = {code: lamp_controller.lampChangeStatus(state,deviceId)};
    res.send(result);
})

app.patch('/device/lock/:id' , function(req, res){
    var deviceId = req.params.id;
    var state = req.body.state;
    var result = {code: lock_controller.lockChangeState(state,deviceId)};
    res.send(result);
})

app.patch('/device/therm/:id' , function(req, res){
    res.send({code: 405});
})

app.get('/devices/air' , function(req, res){
    var result = {code: 200, data: air_controller.everyAirs()}
    res.send(result);
})

app.get('/devices/lamp' , function(req, res){
    var result = {code: 200, data: lamp_controller.everyLamps()}
    res.send(result);
})

app.get('/devices/lock' , function(req, res){
    var result = {code: 200, data: lock_controller.everyLocks()}
    res.send(result);
})

app.get('/devices/therm' , function(req, res){
    var result = {code: 200, data: therm_controller.everyTherms()}
    res.send(result);
})

app.patch('/devices/air' , function(req, res){
    var temp = req.body.temperature;
    res.send({code: air_controller.setEveryAirs(temp)});
})

app.patch('/devices/lamp' , function(req, res){
    var state = req.body.state;
    res.send({code: lamp_controller.setEveryLamps(state)});
})

app.patch('/devices/lock' , function(req, res){
    var state = req.body.state;
    res.send({code: lock_controller.setEveryLocks(state)});
})

app.patch('/devices/therm' , function(req, res){
    res.send({code: 405});
})

app.get('/devices' , function(req, res){
    var result = [];
    result.push({"Airs": air_controller.everyAirs()})
    result.push({"Lamps": lamp_controller.everyLamps()});
    result.push({"Locks": lock_controller.everyLocks()});
    result.push({"Therms": therm_controller.everyTherms()});
    res.send({code: 200 , data: result});
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
