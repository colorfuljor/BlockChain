/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const ContractsOutputDir = require('../constant').ContractsOutputDir;

module.exports.getAbi = function (contractName) {
    if (contractName.endsWith('.sol')) {
        contractName = path.basename(contractName, '.sol');
    }

    let outputDir = ContractsOutputDir;
    let abiPath = path.join(outputDir, `${contractName}.abi`);
    if (!fs.existsSync(abiPath)) {
        return null;
    }

    return JSON.parse(fs.readFileSync(abiPath));
};

module.exports.getContractAddress = function (contractName) {
    if (contractName.endsWith('.sol')) {
        contractName = path.basename(contractName, '.sol');
    }

    let outputDir = ContractsOutputDir;
    let ContractAddressPath = path.join(outputDir, `.${contractName}.address`);
    
    if (!fs.existsSync(ContractAddressPath)) {
        return null;
    }
    // console.log(fs.readFileSync(ContractAddressPath).toString());
    return fs.readFileSync(ContractAddressPath).slice(0, fs.readFileSync(ContractAddressPath).length - 1).toString();
};
