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
exports.lampChangeStatus = function (newState, deviceId){
  if (Number(newState) > 1 || Number(newState) < 0) {
    return (408)
  }
  else{
    lamp.publish('devices/smart_lamp/' + deviceId, newState);
    return(200);
  }
}


/**
 * @param {string} deviceId o id do dispositivo
 */
exports.lampGetState = function (deviceId){
  if(typeof lamps[deviceId] === "undefined"){
    return {code: 404 , data: "Device not found"}
  }
  else{
    return {code: 200, data: {state: lamps[deviceId]}};
  }
}

exports.everyLamps = function (){
  var arrayLamps = [];
  for (const key in lamps) {
    if (lamps.hasOwnProperty(key)) {
      const lamp = {id: key, state: lamps[key]};
      arrayLamps.push(lamp);
    }
  }
  return arrayLamps;
}

exports.setEveryLamps = function(newState){
  if (Number(newState) > 1 || Number(newState) < 0) {
    return (408)
  }
  else{
    for (const key in lamps) {
      if (lamps.hasOwnProperty(key)) {
        lamp.publish('devices/smart_lamp/' + key, newState)
      }
    }
    return (200);
  }
}