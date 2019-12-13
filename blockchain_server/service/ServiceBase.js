
var Web3jService = require('../nodejs-sdk/packages/api').Web3jService;
const { getAbi } = require('../utils/base');
const utils = require('../nodejs-sdk/packages/api/common/utils');
var { ContractsDir, ContractsOutputDir, ContractName } = require('../constant');
const { getContractAddress } = require('../utils/base');

let web3jService = new Web3jService();
let contractName = 'Receivables.sol'

exports.call = function(functionName, parameters) {
    return new Promise(function(resolve, reject) {
        let contractAddress = getContractAddress(ContractName);
        let abi = getAbi(contractName);
            
        if (!abi) {
            throw new Error(`no abi file for contract ${contractName}`);
        }

        for (let item of abi) {
            if (item.name === functionName && item.type === 'function') {
                if (item.inputs.length !== parameters.length) {
                    throw new Error(`wrong number of parameters for function \`${item.name}\`, expected ${item.inputs.length} but got ${parameters.length}`);
                }

                functionName = utils.spliceFunctionSignature(item);
                if (item.constant) {
                    web3jService.call(contractAddress, functionName, parameters).then(result => {
                        let status = result.result.status;
                        let ret = {
                            status: status
                        };
                        let output = result.result.output;
                        if (output !== '0x') {
                            ret.output = utils.decodeMethod(item, output);
                        }
                        resolve(ret);
                    });
                } else {
                    web3jService.sendRawTransaction(contractAddress, functionName, parameters).then(result => {
                        let txHash = result.transactionHash;
                        let status = result.status;
                        let ret = {
                            transactionHash: txHash,
                            status: status
                        };
                        let output = result.output;
                        if (output !== '0x') {
                            ret.output = utils.decodeMethod(item, output);
                        }
                        resolve(ret);
                    });
                } 
            }
        }
    });
}