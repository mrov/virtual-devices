const zmq = require('zmq')
const express = require('express')
const app = express()

app.listen(9090)


var responder = zmq.socket('rep');

var restservers = [] //lista de strings dos address (com porta) de servidores rests disponíveis 
var devices = {} //dicionário com key como dispositivo e value como o address do seu manager mqtt


responder.on('message', function (request) {
    var req = JSON.parse(request.toString())
    var res = {code: 200}
    switch (req.type) {
        case "ADD_REST": //{address}
            restservers.push(req.address)
            break
        case "UPDATE_MANAGER": //{device, address}
            devices[req.device] = req.address
            break
        case "GET_MANAGER": //{device}
           if (devices[req.device] === undefined) {
                res.code = 405
                res.data = "Não encontrou dispositivo"
            } else {
                res.address = devices[req.device]
            }
            break
        default:
            res.code = 404
    }
    console.log(JSON.stringify(restservers) )
    responder.send(JSON.stringify(JSON.stringify(res)) );
})

responder.bind('tcp://*:8081', function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Iniciado dns na 8081…");
    }
});

process.on('SIGINT', function () {
    responder.close();
});


app.get('/', (req, res) => {
    res.end('opa :D')
})

var last = -1 //indice de ultimo server redirecionado 
app.get('/device[s]?/*', function(req, res){
    if (restservers.length == 0) {
        res.status(500).end('Sem servidores disponíveis momento.')
        return
    }
    res.redirect(restservers[++last%restservers.length] ) //redireciona com heuristica simples
})


app.get('*', (req, res) => {
    res.status(404).end()
})