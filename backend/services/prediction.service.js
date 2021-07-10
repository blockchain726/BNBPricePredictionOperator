"use strict"

const express = require('express');
const Web3 = require('web3');
// const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545/'); //testnet
 const web3 = new Web3('https://bsc-dataseed.binance.org/');
const BNBPricePredictionABI = require('../abi/bnbpriceprediction.json')

const predictionAddress = '0x4DB0A53781941ef951dF4b1f8996b2844B046cc3';
const privateKey = ''; ///Change it to your operator Private Key

const XHR = require('xhr2-cookies').XMLHttpRequest
XHR.prototype._onHttpRequestError = function (request, error) {
  if (this._request !== request) {
      return;
  }
  // A new line
  console.log(error, 'request')
  this._setError();
  request.abort();
  this._setReadyState(XHR.DONE);
  this._dispatchProgress('error');
  this._dispatchProgress('loadend');
};

let predictionData = [];
predictionData.curEpoch = -1;
predictionData.genesisStartOnce = false;
predictionData.genesisLockOnce = false;
predictionData.intervalBlocks = 100;
predictionData.bufferBlocks = 10;
predictionData.curRound = [];
predictionData.genesisIntervalTimer = null;
predictionData.executeIntervalTimer = null;

class Service {
    constructor() {

    }
    async currentEpoch() {
        let predictionContract = new web3.eth.Contract(BNBPricePredictionABI, predictionAddress);
        try {
            let result = await predictionContract.methods.currentEpoch().call();
            return result;

        } catch (error) {
            console.error(error);
            throw error;
        };
    }
    async round(epoch) {
        let predictionContract = new web3.eth.Contract(BNBPricePredictionABI, predictionAddress);
        try {
            let result = await predictionContract.methods.rounds(epoch).call();
            return result;
        } catch (error) {
            console.error(error);
            throw error;
        };
    }
    async bufferBlocks() {
        let predictionContract = new web3.eth.Contract(BNBPricePredictionABI, predictionAddress);
        try {
            let result = await predictionContract.methods.bufferBlocks().call();
            return result;

        } catch (error) {
            console.error(error);
            throw error;
        };
    }
    async genesisStartRound() {
        // if (predictionData.genesisStartOnce == true) return;
        var privKey = privateKey;
        let predictionContract = new web3.eth.Contract(BNBPricePredictionABI, predictionAddress);
        console.log("........ Genesis Start Round .........");
        try {
            var encoded = predictionContract.methods.genesisStartRound().encodeABI()
            var tx = {
                gasLimit: web3.utils.toHex(620000),
                to: predictionAddress,
                data: encoded
            }
            let signed = await web3.eth.accounts.signTransaction(tx, privKey);
            let transactionHash = await web3.eth.sendSignedTransaction(signed.rawTransaction);
            predictionData.curEpoch = await this.currentEpoch();
            predictionData.curRound = await this.round(predictionData.curEpoch);
            predictionData.genesisStartOnce = true;
            console.log("....... Genesis Start Round Success .......");
        } catch (error) {
            console.error(error);
            throw error;
        };
    }
    async setBufferBlocks() {
        // if (predictionData.genesisStartOnce == true) return;
        var privKey = privateKey;
        let predictionContract = new web3.eth.Contract(BNBPricePredictionABI, predictionAddress);
        console.log("........ Set Buffer Blocks .........");
        try {
            var encoded = predictionContract.methods.setBufferBlocks(10).encodeABI()
            var tx = {
                gasLimit: web3.utils.toHex(620000),
                to: predictionAddress,
                data: encoded
            }
            let signed = await web3.eth.accounts.signTransaction(tx, privKey);
            let transactionHash = await web3.eth.sendSignedTransaction(signed.rawTransaction);
            console.log("....... Set Buffer Blocks Success .......");
        } catch (error) {
            console.error(error);
            throw error;
        };
    }
    async genesisLockRound() {
        // if (!predictionData.genesisStartOnce || predictionData.genesisLockOnce == true) return;
        var privKey = privateKey;
        let predictionContract = new web3.eth.Contract(BNBPricePredictionABI, predictionAddress);
        console.log("........ Genesis Lock Round .........");
        try {
            var encoded = predictionContract.methods.genesisLockRound().encodeABI()
            var tx = {
                gasLimit: web3.utils.toHex(620000),
                to: predictionAddress,
                data: encoded
            }
            let signed = await web3.eth.accounts.signTransaction(tx, privKey);
            let transactionHash = await web3.eth.sendSignedTransaction(signed.rawTransaction);
            predictionData.curEpoch = await this.currentEpoch();
            predictionData.curRound = await this.round(predictionData.curEpoch);
            predictionData.genesisLockOnce = true;
            console.log("....... Genesis End Round Success .......");
        } catch (error) {
            console.error(error);
            throw error;
        };
    }
    async executeRound() {
        // if (!predictionData.genesisStartOnce || !predictionData.genesisLockOnce) return;
        var privKey = privateKey;
        let predictionContract = new web3.eth.Contract(BNBPricePredictionABI, predictionAddress);
        console.log("....... Execute Round .......");
        try {
            var encoded = predictionContract.methods.executeRound().encodeABI()
            var tx = {
                gasLimit: web3.utils.toHex(620000),
                to: predictionAddress,
                data: encoded
            }
            let signed = await web3.eth.accounts.signTransaction(tx, privKey);
            let transactionHash = await web3.eth.sendSignedTransaction(signed.rawTransaction);
            predictionData.curEpoch = await this.currentEpoch();
            predictionData.curRound = await this.round(predictionData.curEpoch);
            console.log("...... Execute Round Success .......");
        } catch (error) {
            console.error(error);
            throw error;
        };
    }
}

let service = new Service;

const executeIntervalFunc = async () => {
    const blockNumber = await web3.eth.getBlockNumber();
    console.log(blockNumber);
    console.log(predictionData.curRound.lockBlock);
    if (blockNumber >= predictionData.curRound.lockBlock && blockNumber <= predictionData.curRound.lockBlock + predictionData.bufferBlocks) {
        console.log("Executed");
        clearInterval(predictionData.executeIntervalTimer);
        await service.executeRound();
        predictionData.executeIntervalTimer = setInterval(executeIntervalFunc, 1000);
    }        
}
const genesisStartFunc = async () => {
    const blockNumber = await web3.eth.getBlockNumber();
    if (blockNumber >= predictionData.curRound.lockBlock && blockNumber <= predictionData.curRound.lockBlock + predictionData.bufferBlocks) {
        clearInterval(predictionData.genesisIntervalTimer);
        await service.genesisLockRound();
        predictionData.executeIntervalTimer = setInterval(executeIntervalFunc, 1000);
    }
    console.log(blockNumber);
};  

module.exports = class PredictionService {

    constructor() {
    }
  
    async executeMarket(req, res) {
        await service.genesisStartRound();
        console.log(predictionData.curEpoch);
        console.log(predictionData.curRound);
        predictionData.genesisIntervalTimer = setInterval(genesisStartFunc, 1000);
        return {
            success: true
        }
    }

    async pauseMarket(req, res) {
        var privKey = privateKey;
        let predictionContract = new web3.eth.Contract(BNBPricePredictionABI, predictionAddress);
        console.log("....... Pause Market .......");
        try {
            let encoded = predictionContract.methods.pause().encodeABI()
            var tx = {
                gasLimit: web3.utils.toHex(620000),
                to: predictionAddress,
                data: encoded
            }
            let signed = await web3.eth.accounts.signTransaction(tx, privKey);
            let transactionHash = await web3.eth.sendSignedTransaction(signed.rawTransaction);
            console.log("....... Pause Market Successed .......");
            return {
                success: true
            }
        } catch (error) {
            console.error(error);
            throw error;
        };
    }

    async claimTreasury(req, res) {
        var privKey = privateKey;
        let predictionContract = new web3.eth.Contract(BNBPricePredictionABI, predictionAddress);
        console.log("....... Claim Treasury .......");
        try {
            let encoded = predictionContract.methods.claimTreasury().encodeABI()
            var tx = {
                gasLimit: web3.utils.toHex(620000),
                to: predictionAddress,
                data: encoded
            }
            let signed = await web3.eth.accounts.signTransaction(tx, privKey);
            let transactionHash = await web3.eth.sendSignedTransaction(signed.rawTransaction);
            console.log("....... Claim Treasury Successed .......");
            return {
                success: true
            }
        } catch (error) {
            console.error(error);
            throw error;
        };
    }

    async setTreasuryRate(req, res) {
        var privKey = privateKey;
        let predictionContract = new web3.eth.Contract(BNBPricePredictionABI, predictionAddress);
        console.log("....... Set Treasury Rate .......");
        try {
            let treasuryRate = req.body.rate;
            let encoded = predictionContract.methods.setTreasuryRate(treasuryRate).encodeABI()
            var tx = {
                gasLimit: web3.utils.toHex(620000),
                to: predictionAddress,
                data: encoded
            }
            let signed = await web3.eth.accounts.signTransaction(tx, privKey);
            let transactionHash = await web3.eth.sendSignedTransaction(signed.rawTransaction);
            console.log("....... Set Treasury Rate Successed .......");
            return {
                success: true
            }
        } catch (error) {
            console.error(error);
            throw error;
        };
    }

    async resumeMarket(req, res) {
        var privKey = privateKey;
        let predictionContract = new web3.eth.Contract(BNBPricePredictionABI, predictionAddress);
        console.log("....... Resume Market .......");
        try {
            let encoded = predictionContract.methods.unpause().encodeABI()
            var tx = {
                gasLimit: web3.utils.toHex(620000),
                to: predictionAddress,
                data: encoded
            }
            let signed = await web3.eth.accounts.signTransaction(tx, privKey);
            let transactionHash = await web3.eth.sendSignedTransaction(signed.rawTransaction);
            console.log("....... Resume Market Successed .......");
            return {
                success: true
            }
        } catch (error) {
            console.error(error);
            throw error;
        };
    }
}
