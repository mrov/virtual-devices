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
  if (Number(newState) > 1 || Number(newState) < 0) {
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
  if(typeof locks[deviceId] === "undefined"){
    return {code: 404 , data: "Device not found"}
  }
  else{
    return {code: 200, data: {state: locks[deviceId]}};
  }
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
  if (Number(newState) > 1 || Number(newState) < 0) {
    return (408)
  }
  else{
    for (const key in locks) {
      if (locks.hasOwnProperty(key)) {
        lock.publish('commands/smart_lock/' + key, newState)
      }
    }
    return (200);
  }
}