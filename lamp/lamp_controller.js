var mqtt = require('mqtt');
var lamp = mqtt.connect("mqtt://localhost:5001");
var lamps = {}
 
lamp.on('connect', function () {
  lamp.subscribe('drivers/smart_lamp')
})

lamp.on('message', function (topic, message) {
  // message is Buffer
  let mensagem = message.toString();
  let n = mensagem.indexOf("=");
  let id = mensagem.slice(0,n);
  let state = mensagem.slice(n+1,n+2);
  //console.log("mensagem: " + message + " indice do '=': " + n + " id: " + id + " estado: " + state);
  lamps[id] = state;
});

/**
 * @param {string} newState Estado da lampada
 * @param {string} deviceId o id do dispositivo
 */
function lampChangeStatus(newState, deviceId){
  var intNewState = Number(newState);
  if (intNewState > 1) {
    return ({code: 405, data: "Estado inválido, por favor só pode ser 0 ou 1."})
  }
  else{
    lamp.publish('devices/smart_lamp/' + deviceId, intNewState);
    return({code: 200, data: "Done!"});
  }
}


/**
 * @param {string} deviceId o id do dispositivo
 */
function lampGetState(deviceId){
  console.log(lamps[deviceId]);
  return lamps[deviceId];
}

//airChangeTemp("33", "0");
setTimeout(() => {
  lampGetState("10");
}, 1000);
//airGetTemp(0);
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
