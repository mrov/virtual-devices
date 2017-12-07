var mqtt = require('mqtt');
var air  = mqtt.connect("mqtt://localhost:5000");
var virtual_airs = {};

air.on('connect', function () {
  air.subscribe('drivers/virtual_air')
})

air.on('message', function (topic, message) {
  // message is Buffer
  let mensagem = message.toString();
  let n = mensagem.indexOf(":");
  let id = mensagem.slice(0,n);
  let temp = mensagem.slice(n+2,);
  //console.log("mensagem: " + message + " indice dos 2 pontos: " + n + " id: " + id + " temperatura: " + temp);
  virtual_airs[id] = temp;
});

/**
 * @param {string} newTemp a nova temperatura do dispositivo
 * @param {string} deviceId o id do dispositivo
 */
exports.airChangeTemp = function (newTemp, deviceId){
  air.publish('commands/air_conditioner/' + deviceId, newTemp);
  return("Comando enviado com sucesso.");
}

/**
 * @param {string} deviceId o id do dispositivo
 */
exports.airGetTemp = function (deviceId){
  //console.log(virtual_airs[deviceId]);
  return virtual_airs[deviceId];
}

exports.everyAirs = function (){
  var arrayVirtualAirs = [];
  for (const key in virtual_airs) {
    if (virtual_airs.hasOwnProperty(key)) {
      const virtual_air = {id: key, temp: virtual_airs[key]};
      arrayVirtualAirs.push(virtual_air);
    }
  }
  return arrayVirtualAirs;
}

exports.setEveryAirs = function(newTemp){
  for (const key in virtual_airs) {
    if (virtual_airs.hasOwnProperty(key)) {
      air.publish('commands/air_conditioner/' + key, newTemp)
    }
  }
  return "Todas os Air Conditioners alteradas para " + newTemp;
}