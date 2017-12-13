const zmq       = require('zmq')
const requester = zmq.socket('req')

req = async (address, port) => {
    requester.connect('tcp://' + address + ':' + port)
    requester.send(JSON.stringify({type: "ADD_REST", address: 'https://google.com'}) );

    var s = await new Promise(res => {
        requester.on('message', function(msg) {
            res(msg.toString())
        })
    })
    console.log(s ) 

}
req('localhost',8081)