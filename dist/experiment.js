"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const TronWeb = require('tronweb');
let fullNode = 'https://api.trongrid.io';
let solidityNode = 'https://api.trongrid.io';
let eventServer = 'https://api.trongrid.io';
const runAll = (transaction) => __awaiter(void 0, void 0, void 0, function* () {
    const toAddress = transaction.to_address;
    const privateKey = transaction.private_key;
    const amount = Math.floor(parseFloat(transaction.amount) * 1000000);
    const contractAddress = transaction.contract_address;
    const apiKey = transaction.api_key;
    console.log(contractAddress);
    const tronWeb = new TronWeb({
        fullHost: 'https://api.trongrid.io',
        headers: { "TRON-PRO-API-KEY": apiKey },
        privateKey: privateKey
    });
    const fromAddress = tronWeb.address.fromPrivateKey(privateKey);
    const transferTRX = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const txn = yield tronWeb.transactionBuilder.sendTrx(toAddress, amount, fromAddress);
            const signedTransaction = yield tronWeb.trx.sign(txn, privateKey);
            const final = yield tronWeb.trx.broadcast(signedTransaction);
            return final;
        }
        catch (error) {
            throw error;
        }
    });
    const transferContractAddress = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let contract = yield tronWeb.contract().at(contractAddress);
            let result = yield contract.transfer(toAddress, amount);
            let output = yield result.send({
                feeLimit: 40000000
            });
            return { txid: output };
        }
        catch (error) {
            console.error("trigger smart contract error", error);
            throw error;
        }
    });
    if (!contractAddress) {
        return yield transferTRX();
    }
    else {
        return yield transferContractAddress();
    }
});
exports.default = runAll;
