## Projeto Redes de Computadores 2017.2

### Arquitetura

![arquitetura](https://i.imgur.com/YOOmrPP.png)


Tecnologias node e python 3 (devices).
Passo a passo de como rodar:

### Devices MQTT virtuais
1 - Crie uma virtualenv e ative-a:
```
$ virtualenv -p python3 env && . env/bin/active
``` 
2 - Instale o mqtt na virtualenv:
```
$ pip install paho-mqtt
```
3 - Execute o mosquitto (broker):
```
mosquitto -p (Porta)
```
4 - Execute os arquivos py dentro de manager/mqtt/<word>*</word> com o seguinte comando, sendo N o numero de instancias:
```
python *.py -s N
```

- É recomendado verificar o consumo de memoria ram se for rodar muitos dispositivos. Assim que todos dispositivos estiverem rodando e conectados com seus devidos brokers, siga os passos abaixo.
<br/>

### Sistema

O sistema foi projetado para ser distribuido, visando alcancar uma boa escalabilidade horizontal, logo cada modulo a seguir pode ser executado em uma maquina diferente, se configurada a variavel addressdns dentro dos modulos (manager, service).

1 - Para cada modulo (service, manager, dns), va ao respectivo diretorio e rode o comando:

```
$ npm install
```

2 - Logo após instalar todos os pacotes do node, execute o .js respectivo de cada modulo, que deve ser o nome dele proprio:
```
$ node dns/dns.js & node manager/manager.js & node service.js & 
```
Preferencialmente execute o dns primeiro. Se necessario mude nos outros modulos a variavel addressdns com o seu respectivo endereco. 

3 (opcinal) - Caso queira-se conectar com brokers de outros enderecos, basta mudar a variavel addressbroker de manager.js.
