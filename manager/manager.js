const zmq = require('zmq')
const express = require('express')
const ip = require("ip")
// require('events').EventEmitter.prototype._maxListeners = 13;

var addressbroker = "localhost:5000"
global.address = addressbroker
var addressdns = "localhost:8081"
global.addressdns = addressdns

var portManager = '9999'
global.localaddress = ip.address() + ':' + portManager


var air_controller = require('./mqtt/air/air_controller.js');
var lamp_controller = require('./mqtt/lamp/lamp_controller.js');
var lock_controller = require('./mqtt/lock/lock_controller.js');
var therm_controller = require('./mqtt/therm/therm_controller.js');

var responder = zmq.socket('rep');


responder.on('message', function (request) {
    var req = JSON.parse(request.toString())
    var res = { code: 200 }
    switch (req.type) {
        case "GET": //{device, id}
            var device = req.device
            var deviceId = req.id
            switch (device) {
                case "air":
                    res.data = air_controller.airGetTemp(deviceId)
                    break
                case "lamp":
                    res.data = lamp_controller.lampGetState(deviceId)
                    break
                case "lock":
                    res.data = lock_controller.lockGetState(deviceId)
                    break
                case "therm":
                    res.data = therm_controller.thermGetTemp(deviceId)
                    break
                default:
                    res.code = 404
            }
            break
        case "PATCH": //{device, id, attr}
            console.log('patch')
            var device = req.device
            var deviceId = req.id
            var attr = req.attr
            switch (device) {
                case "air":
                    var temperature = attr;
                    res.data = { code: air_controller.airChangeTemp(temperature, deviceId) }
                    break
                case "lamp":
                    var state = attr;
                    res.data = { code: lamp_controller.lampChangeStatus(state, deviceId) }
                    break
                case "lock":
                    var state = attr;
                    res.data = { code: lock_controller.lockChangeState(state, deviceId) }
                    break
                default:
                    res.code = 404
                    return
            }
            break
        case "GETS": //{ device }
            var device = req.device
            switch (device) {
                case "air":
                    res.data = air_controller.everyAirs()
                    break
                case "lamp":
                    res.data = lamp_controller.everyLamps()
                    break
                case "lock":
                    res.data = lock_controller.everyLocks()
                    break
                case "therm":
                    res.data = therm_controller.everyTherms()
                    break
                default:
                    res.code = 404
            }
            break
        case "PATCHS": //{device, attr}
            var device = req.device
            var attr = req.attr
            switch (device) {
                case "air":
                    var temp = attr;
                    res.data = { code: air_controller.setEveryAirs(temp) }
                    break
                case "lamp":
                    var state = attr;
                    res.data = { code: lamp_controller.setEveryLamps(state) }
                    break
                case "lock":
                    var state = attr;
                    res.data = { code: lock_controller.setEveryLocks(state) }
                    break
                default:
                    res.code = 404
            }
            break
        case "ALL":
            var result = [];
            result.push({ "Airs": air_controller.everyAirs() })
            result.push({ "Lamps": lamp_controller.everyLamps() });
            result.push({ "Locks": lock_controller.everyLocks() });
            result.push({ "Therms": therm_controller.everyTherms() });
            res.data = result
            break
    }
    responder.send(JSON.stringify(res))
})

// init = async () => {
//     await new Promise(res => 
    responder.bind('tcp://*:' + portManager, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Manager ok");
            // res()
        }
    })
    // )
// }
// init()

process.on('SIGINT', function () {
    responder.close();
});

