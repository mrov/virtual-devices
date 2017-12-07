Dependencias node e npm package manager, python3...

Passo a passo de como rodar

1 - Bote os endereços no arquivo de endereços.<br/>

2 - Crie uma virtualenv na pasta raiz do projeto<br/>
    virtualenv -p python3 venv<br/>

3 - Ative o ambiente virtual toda vez que for rodar um dispositivo *.py <br/>
    source venv/bin/activate<br/>

4 - Instale o mosquitto na virtualenv<br/>
    pip install paho-mqtt<br/>

5 - Execute os mosquittos (brokers)<br/>
    mosquitto -p (Porta)<br/>

6 - Execute os *.py com o seguinte comando, sendo N numero de instancias <br/>
    python *.py -s N<br/>

7 - É recomendado para um pc o maximo de 500 dispositivos pois consome mta memoria.<br/>
<br/>
Assim que todos dispositivos estiverem rodando e conectados com seus devidos brokers, Siga os passos abaixo para rodar a API REST.
<br/>
1 - Execute o comando no terminal.<br/>
    npm install<br/>

2 - Logo após instalar todos os pacotes do node, execute o service.js<br/>
    node service.js<br/>