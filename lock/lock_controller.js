var mqtt = require('mqtt');
var lock = mqtt.connect("mqtt://localhost:5002");
var locks = {};
 
lock.on('connect', function () {
  lock.subscribe('drivers/smart_lock')
})

lock.on('message', function (topic, message) {
  // message is Buffer
  let mensagem = message.toString();
  let n = mensagem.indexOf(";");
  let id = mensagem.slice(0,n);
  let state = mensagem.slice(n+1,n+2);
  //console.log("mensagem: " + message + " indice do ponto e virgula: " + n + " id: " + id + " Estado: " + state);
  locks[id] = state;
});

/**
 * @param {string} newState o estado do dispositivo
 * @param {string} deviceId o id do dispositivo
 */
function lockChangeState(newState, deviceId){
  lock.publish('commands/smart_lock/' + deviceId, newState);
  return({code: 200, data: "done"});
}

/**
 * @param {string} deviceId o id do dispositivo
 */
function lockGetTemp(deviceId){
  console.log(locks[deviceId]);
  return locks[deviceId];
}


lockChangeState("1", "15");
setTimeout(() => {
  lockGetTemp("15");  
}, 1000);
