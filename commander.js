var mqtt = require('mqtt')
var client  = mqtt.connect("mqtt://localhost:5001")
 

client.on('connect', function () {
  client.subscribe('drivers/#')
})
 
client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString())
})

setTimeout(() => {
    client.publish('commands/air_conditioner/0', '33');
    console.log("moabe renato");
}, 2000);
