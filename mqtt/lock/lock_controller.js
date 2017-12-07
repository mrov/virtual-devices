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
exports.lockChangeState = function (newState, deviceId){
  var intNewState = Number(newState);
  if (intNewState > 1 || intNewState < 0) {
    return (408)
  }
  else{
    lock.publish('commands/smart_lock/' + deviceId, newState);
    return(200);
  }
}

/**
 * @param {string} deviceId o id do dispositivo
 */
exports.lockGetState = function (deviceId){
 // console.log(locks[deviceId]);
  return locks[deviceId];
}

exports.everyLocks = function (){
  var arrayLocks = [];
  for (const key in locks) {
    if (locks.hasOwnProperty(key)) {
      const lock = {id: key, state: locks[key]};
      arrayLocks.push(lock);
    }
  }
  return arrayLocks;
}

exports.setEveryLocks = function(newState){
  for (const key in locks) {
    if (locks.hasOwnProperty(key)) {
      lock.publish('commands/smart_lock/' + key, newState)
    }
  }
  return "Todas as locks alteradas para " + newState;
}