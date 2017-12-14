var express = require('express');
var bodyparser = require('body-parser');
var ip = require("ip")
var addressdns = "localhost:8081"
global.addressdns = addressdns
var portRest = 3000
var req2 = require('./req').req
var dns = require('./req').dns
var app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
    extended: true
}));

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.get('/device/:type/:id', async function (req, res) {
    var device = req.params.type
    var deviceId = req.params.id
    var data = await dns({ type: 'GET_DEVICE', device: device, id: deviceId })
    if (data.code != 200) {
        //falhou
        res.status(404).end('Dispositivo não encontrado')
        return
    }
    var address = data.data
    console.log(address)
    //GET address -> device e id
    console.log('req2')
    var data = await req2(address, { type: 'GET', device: device, id: deviceId })
    console.log('voltou req2')
    res.status(data.code).send(data.data)
})

app.patch('/device/:type/:id', async function (req, res) {
    var device = req.params.type
    var deviceId = req.params.id
    var data = await dns({ type: 'GET_DEVICE', device: device, id: deviceId })
    if (data.code != 200) {
        res.status(404).end('Dispositivo não encontrado')
        return
    }
    var address = data.data
    var attr = ""
    switch (device) {
        case "air":
            attr = req.body.temperature;
            break
        case "lamp":
            attr = req.body.state;
            break
        case "lock":
            attr = req.body.state;
            break
    }
    var data = await req2(address, { type: 'PATCH', device: device, id: deviceId, attr: attr })
    res.status(data.code).send(data.data)
})


app.get('/devices/:type', async function (req, res) {
    var device = req.params.type
    var data = await dns({ type: 'GET_DEVICES', device: device })
    if (data.code != 200) {
        res.status(404).end('Tipo de dispositivo não encontrado')
        return
    }
    var enderecos = data.data
    data = []
    promises = []
    enderecos.forEach(address => {
        promises.push(new Promise((res) => {
            req2(address, { type: 'GETS', device: device }).then(res2 => {
                data = data.concat(res2.data)
                res()
                console.log(data)
            })
        }))
    })
    await Promise.all(promises)
    res.status(200).send(data)
})

app.patch('/devices/:type', async function (req, res) {
    var device = req.params.type
    var data = await dns({ type: 'GET_DEVICES', device: device })
    if (data.code != 200) {
        res.status(404).end('Tipo de dispositivo não encontrado')
        return
    }
    var enderecos = data.data

    var attr = ""
    switch (device) {
        case "air":
            attr = req.body.temperature;
            break
        case "lamp":
            attr = req.body.state;
            break
        case "lock":
            attr = req.body.state;
            break
    }
    enderecos.forEach(address => {
        var values = req2(address, { type: 'PATCHS', device: device, attr: attr })
    })
    res.status(200).end()
})

app.get('/devices', async function (req, res) {
    var data = await dns({ type: 'GET_ALL_MANAGER' })
    if (data.code != 200) {
        res.status(404).end('Houve um problema :o')
        return
    }
    var enderecos = data.data
    data = []
    promises = []
    enderecos.forEach(address => {
        promises.push(new Promise((res) => {
            req2(address, {type:'ALL'}).then(res2 => {
                data = data.concat(res2.data)
                res()
            })
        }))
    })
    await Promise.all(promises)
    // enderecos.forEach(address => {
    //     var values = await req2(address, {type:'ALL'})
    //     data.concat(values.data)
    // })
    res.status(200).send(data)

})

app.listen(portRest, function () {
    console.log('Example app listening on port 3000!');
    var data = dns({ type: 'ADD_REST', address: ip.address() + ":" + portRest})
})
