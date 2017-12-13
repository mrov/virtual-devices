const zmq = require('zmq')
const express = require('express')
const app = express()
const dnsport = 8081
const redirectport = 9090


var responder = zmq.socket('rep');

var restservers = [] //lista de strings dos address (com porta) de servidores rests disponíveis 
var devices = {} //dicionário com key como dispositivo e value como o address do seu manager mqtt
var managers = {} //endereco de todos managers

responder.on('message', function (request) {
    var req = JSON.parse(request.toString())
    var res = {code: 200}
    console.log('req ' + request.toString())
    switch (req.type) {
        case "ADD_REST": //{address} //adiciona um servidor rest para o redirector
            restservers.push(req.address)
            break
        case "UPDATE_DEVICE": //{id, device, address}
            if (devices[req.device] === undefined) {
                devices[req.device] = {}
            }
            devices[req.device][req.id] = req.address
            managers[req.address] = '' //adicionando endereco de manager
            break
        case "GET_DEVICE": //{device, id}
            if (devices[req.device] === undefined) {
                res.code = 405
                res.data = "Não encontrou tipo de dispositivo"
            } else if(devices[req.device][req.id] === undefined) {
                res.code = 405
                res.data = "Não encontrou o dispositivo"
            } else {
                res.data = devices[req.device][req.id]
            }
            break
        case "GET_DEVICES": //{device}
            if (devices[req.device] === undefined) {
                res.code = 405
                res.data = "Não encontrou tipo de dispositivo"
            } else {
                var data = {}
                Object.keys(devices[req.device]).forEach(e => {
                    data[devices[req.device][e]] = '' //marcando endereco
                });
                res.data = Object.keys(data)
            }
        case "GET_ALL_MANAGER":
            res.data = Object.keys(managers)
            break
        default:
            res.code = 404
    }
    //console.log(JSON.stringify(restservers) )
    responder.send(JSON.stringify(res) )
})

responder.bind('tcp://*:' + dnsport, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Iniciado dns na 8081…");
    }
});

process.on('SIGINT', function () {
    responder.close();
});

app.listen(redirectport)
console.log('Iniciando redirector na ' + redirectport)

app.get('/', (req, res) => {
    res.end('opa :D')
})

var last = -1 //indice de ultimo server redirecionado 
f_red = (req, res) => {
    if (restservers.length == 0) {
        res.status(500).end('Sem servidores disponíveis momento.')
        return
    }
    res.redirect(301, restservers[++last%restservers.length] + req.originalUrl ) //redireciona com heuristica simples
}
app.get('/device[s]?/', f_red)
app.get('/device[s]?/:type', f_red)
app.get('/device/:type/:id', f_red)


app.get('*', (req, res) => {
    res.status(404).end()
})