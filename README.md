# SunPumpSniper

We provide you a direct access to Tron SunPump transactions through Java-tron's Built-in Message Queue for Event Subscription.  Event subscribers can directly connect to our private node through ZeroMQ js client and receive latests SunPump transactions. For more information contact us on

 <a href="https://t.me/theltx">
        <img style="border-radius: 8px;" src="https://img.shields.io/badge/Get_Access-On_Telegram-%232CA5E0?style=for-the-badge&logo=telegram&logoColor=white" alt="Join Our Telegram">
    </a>


# Installation
````
npm install zeromq@5 tronweb
````

Then set the variables necessary for connection and execution of transactions
````
const tronWeb = new TronWeb({
    fullNode: 'fullnode',
    solidityNode: 'soliditynode',
    privateKey: 'privatekey'
})

const yourAddress = "youraddress";

sock.connect("tcp://nodeaddress:5555");  
````


# Run 
````
tsx snipe.ts
````
