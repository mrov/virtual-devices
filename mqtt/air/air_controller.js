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
exports.airChangeTemp = function (newTemp, deviceId){ //recebe nova temperatura no intervalo de 0 a 35 graus
  if(Number(newTemp) > 35 || Number(newTemp) < 0){return (407)}
  air.publish('commands/air_conditioner/' + deviceId, newTemp);
  return(200);
}

/**
 * @param {string} deviceId o id do dispositivo
 */
exports.airGetTemp = function (deviceId){ //retorna temperatura atual
  if(typeof virtual_airs[deviceId] === "undefined"){
    return {code: 404 , data: "Device not found"}
  }
  else{
    // console.log(virtual_airs[deviceId]);
    return {code: 200, data: {temperature: virtual_airs[deviceId]}};
  }
}

exports.everyAirs = function (){ //pega a temperatura atual de todos
  var arrayVirtualAirs = [];
  for (const key in virtual_airs) {
    if (virtual_airs.hasOwnProperty(key)) {
      const virtual_air = {id: key, temp: virtual_airs[key]};
      arrayVirtualAirs.push(virtual_air);
    }
  }
  return arrayVirtualAirs;
}

exports.setEveryAirs = function(newTemp){ // seta uma nova temperatura para todos ao mesmo tempo
  if(Number(newTemp) > 35 || Number(newTemp) < 0){
    return (407)
  }
  else{
    for (const key in virtual_airs) {
      if (virtual_airs.hasOwnProperty(key)) {
        air.publish('commands/air_conditioner/' + key, newTemp)
      }
    }
    return (200);
  }
}