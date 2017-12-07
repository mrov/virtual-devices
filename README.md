Dependencias node e npm package manager, python3...

Passo a passo de como rodar

1 - Bote os endereços no arquivo de endereços.

2 - Crie uma virtualenv na pasta raiz do projeto
    virtualenv -p python3 venv

3 - Ative o ambiente virtual toda vez que for rodar um dispositivo *.py
    source venv/bin/activate

4 - Instale o mosquitto na virtualenv
    pip install paho-mqtt

5 - Execute os mosquittos (brokers)
    mosquitto -p (Porta)

6 - Execute os *.py com o seguinte comando, sendo N numero de instancias 
    python *.py -s N

7 - É recomendado para um pc o maximo de 500 dispositivos pois consome mta memoria.

Assim que todos dispositivos estiverem rodando e conectados com seus devidos brokers, Siga os passos abaixo para rodar a API REST.

1 - Execute o comando no terminal.
    npm install

2 - Logo após instalar todos os pacotes do node, execute o service.js
    node service.js