var mqtt = require('mqtt');
var dns = require('../../req').dns
var therm = mqtt.connect("mqtt://" + global.address);
var therms = {};

therm.on('connect', function () {
  therm.subscribe('drivers/termometer');
})

therm.on('message', (topic, message) => {
  // message is Buffer
  let mensagem = message.toString();
  let n = mensagem.indexOf(">");
  let id = mensagem.slice(0,n);
  let temp = mensagem.slice(n+1,);
  //console.log("mensagem: " + message + " indice '>': " + n + " id: " + id + " temperatura: " + temp);
  therms[id] = temp;
  dns({ type: 'UPDATE_DEVICE', device: 'therm', id: id, address: global.localaddress})
});

/**
 * @param {string} deviceId o id do dispositivo
 */
exports.thermGetTemp = function (deviceId){
  if(typeof therms[deviceId] === "undefined"){
    return {code: 404 , data: "Device not found"}
  }
  else{
    return {code: 200, data: {temperature: therms[deviceId]}};
  }
}

exports.everyTherms = function (){
  var arrayTherms = [];
  for (const key in therms) {
    if (therms.hasOwnProperty(key)) {
      const therm = {id: key, temp: therms[key]};
      arrayTherms.push(therm);
    }
  }
  return arrayTherms;
}