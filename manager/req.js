const zmq       = require('zmq')
var requester = zmq.socket('req')

exports.req = async (address, data) => {
    // try {
    console.log(typeof (address) + " " + address + ' ' + JSON.stringify(data) )
    requester.connect('tcp://' + address)
    requester.send(JSON.stringify(data) );

    var s = await new Promise(res => {
        requester.on('message', function(msg) {
            res(msg.toString())
            // requester.close()
        })
    })
    requester.disconnect('tcp://' + address)
    // requester.close()
    // } catch (e){
    //     // console.log(e)
    // }
    return JSON.parse(s)
}

var requester2 = zmq.socket('req')
requester2.connect('tcp://' + global.addressdns)
exports.dns = async (data) => {
    try {
    requester2.send(JSON.stringify(data) );
    console.log('req2 ' + JSON.stringify(data) )
    var s = await new Promise(res => {
        requester2.on('message', function(msg) {
            res(msg.toString())
            // requester2.close()
        })
    })
        return JSON.parse(s)
    } catch (e){
        console.log('e123 ' + e)
    }
}