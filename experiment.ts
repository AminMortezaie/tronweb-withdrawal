const Transaction = require('./index');
const TronWeb = require('tronweb');

let fullNode = 'https://api.trongrid.io';
let solidityNode = 'https://api.trongrid.io';
let eventServer = 'https://api.trongrid.io';




const runAll = async (transaction: typeOf Transaction): Promise<any> => {
    const toAddress = transaction.to_address
    const privateKey = transaction.private_key
    const amount = Math.floor(parseFloat(transaction.amount) * 1000000)
    const contractAddress = transaction.contract_address
    const apiKey = transaction.api_key

    const tronWeb = new TronWeb({
        fullHost: 'https://api.trongrid.io',
        headers: { "TRON-PRO-API-KEY": apiKey },
        privateKey: privateKey
    });

    const fromAddress = tronWeb.address.fromPrivateKey(privateKey)

    const transferTRX = async () => {
        try {
            const txn = await tronWeb.transactionBuilder.sendTrx(toAddress, amount, fromAddress);
            const signedTransaction = await tronWeb.trx.sign(txn, privateKey);
            const final = await tronWeb.trx.broadcast(signedTransaction)
            return final;
        } catch (error) {
            throw error
        }
    }


    const transferContractAddress = async () => {
        try {
            let contract = await tronWeb.contract().at(contractAddress);
            let result = await contract.transfer(
                toAddress,
                amount
            )
            let output = await result.send({
                feeLimit: 40000000
            })
            return { txid: output }

        } catch (error) {
            throw error
        }
    }

    if (!contractAddress) {
        return await transferTRX();
    } else {
        return await transferContractAddress()
    }

}


export default runAll;