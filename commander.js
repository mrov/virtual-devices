var mqtt = require('mqtt');
var air  = mqtt.connect("mqtt://localhost:5000");
var lamp = mqtt.connect("mqtt://localhost:5001");
var lock = mqtt.connect("mqtt://localhost:5002");
var therm = mqtt.connect("mqtt://localhost:5003");
 
air.on('connect', function () {
  air.subscribe('drivers/#')
})

/**
 * @param {string} newTemp a nova temperatura do dispositivo
 * @param {string} deviceId o id do dispositivo
 */
function airChangeTemp(newTemp, deviceId){
  air.publish('commands/air_conditioner/' + deviceId, newTemp);
  return({code: 200, data: "done"});
}


/**
 * @param {string} deviceId o id do dispositivo
 */
await function airGetTemp(deviceId){
  var result;
  air.on('message', function (topic, message) {
    // message is Buffer
    let mensagem = message.toString();
    let n = mensagem.indexOf(":");
    let id = mensagem.slice(0,n);
    let temp = mensagem.slice(n+2,);
    //console.log("mensagem: " + message + " indice dos 2 pontos: " + n + " id: " + id + " temperatura: " + temp);
    if(deviceId === id){
      result = temp;
      air.removeAllListeners();
    }
  });
}
airChangeTemp("33", "0");
console.log(airGetTemp("0"));
var result = await airGetTemp(0);
console.log(result);
//airGetTemp(0);
//airGetTemp(0);



// air.on('message', function (topic, message) {
//   // message is Buffer
//   console.log(message.toString())
// });

/*
setTimeout(() => {
    air.publish('commands/air_conditioner/0', '33');
    console.log("moabe renato");
}, 2000);
*/
