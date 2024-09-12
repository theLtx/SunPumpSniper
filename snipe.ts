// SunPump sniper Bot
//Get Node Access on Telegram https://t.me/theltx
import zmq from "zeromq";
import TronWeb from 'tronweb';


const tronWeb = new TronWeb({
    fullNode: 'fullnode',
    solidityNode: 'soliditynode',
    privateKey: 'privatekey'
})

const HEX_PREFIX = '41';
const PumpContractAddress = "TTfvyrAz86hbZk5iDpKD78pqLGgi8C7AAw";
const yourAddress = "youraddress";
let i = 0;
let contract = undefined
let token = undefined;

//Java-tron's Built-in Message Queue for Event Subscription
let sock = zmq.socket("sub");
sock.connect("tcp://xxx:5555");  
sock.subscribe("contractLog");
console.log("Subscriber connected to port 5555");

let abi = [{"inputs": [{"name": "token","type": "address"},{"name": "AmountMin","type": "uint256"}],"name": "purchaseToken","stateMutability": "Payable","type": "Function"},{"inputs": [{"name": "token","type": "address"},{"name": "tokenAmount","type": "uint256"},{"name": "AmountMin","type": "uint256"}],"name": "saleToken","stateMutability": "Nonpayable","type": "Function"}];

let tokenAbi = [{"inputs": [{ "name": "spender", "internalType": "address",  "type": "address"},{"name": "amount","internalType": "uint256","type": "uint256"}],"name": "approve","stateMutability": "nonpayable","type": "function"},{"outputs": [{"name": "","internalType": "uint256","type": "uint256"}],"inputs": [{"name": "account","internalType": "address","type": "address"}],"name": "balanceOf","stateMutability": "view","type": "function"}];

console.log("Listening to token creation...");

sock.on("message", async function(topic, message) {

    let res = JSON.parse(message);
    let now = Date.now();
    //Check if transaction is a token creation
    if (!(res.rawData.topics[0] == "1ff0a01c8968e3551472812164f233abb579247de887db8cbb18281c149bee7a") || (i != 0)) {
        return;
    }

    if (now - res.timeStamp > 300) {
        return;
    }

    i++;
    let hexToken = res.rawData.data.substring(24, 64);
    token = hexAddressToBase58('41' + hexToken);
    try {
        console.log("Token found! Sending purchase transaction...");
        let txID = await contract.purchaseToken(token, 1000000).send({
            callValue: 60000000
        });
        console.log("Purchase Completed Successfully!");
        console.log("Transaction ID: " + txID);
        console.log("Token address: " + token);

    } catch (err) {
        console.error(err);
    }
    console.log("Sending approval transaction...");
    let tokenContract = await tronWeb.contract(tokenAbi, token);
    let approveID = await tokenContract.approve(PumpContractAddress, 1000000000000000000000000000n).send();
    console.log("Approval Transaction ID: " + approveID);
    let amount = 0;

    try {
        amount = await tokenContract["balanceOf"](yourAddress).call();
        console.log("Amount of token purchased: " + amount.toString());
    } catch (err) {
        console.log(err);
    }

    await sleep(5000);

    if (amount > 0) {
        console.log("Selling tokens...");
        let contract = await tronWeb.contract(abi, PumpContractAddress);
        let saleId = await contract.saleToken(token, amount, 10000).send();
        console.log("Tokens Sold , Transaction ID: " + saleId);
    }


});


function hexAddressToBase58(hexAddress: any): any {
    let retval = hexAddress;
    try {
        if (hexAddress.startsWith("0x")) {
            hexAddress = HEX_PREFIX + hexAddress.substring(2);
        }
        let bArr = tronWeb.utils['code'].hexStr2byteArray(hexAddress);
        retval = tronWeb.utils['crypto'].getBase58CheckAddress(bArr);
    } catch (e) {
        console.error(e); //Handle
    }
    return retval;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    contract = await tronWeb.contract(abi, PumpContractAddress);
}

main();