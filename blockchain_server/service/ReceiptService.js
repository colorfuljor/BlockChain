'use strict';

var fs = require('fs'),
    path = require('path'),
    http = require('http');
var ServiceBase = require('./ServiceBase');
var Configuration = require('../nodejs-sdk/packages/api/common/configuration').Configuration;

Configuration.setConfig(path.join(__dirname, '../conf/config.json'));

/**
 * finance to bank
 * 
 *
 * financeParam FinanceParam 
 * no response value expected for this operation
 **/
exports.receiptFinancePOST = function(financeParam) {
  return new Promise(function(resolve, reject) {
    var param;
    if (Object.keys(financeParam).length <= 1) {
      param = JSON.parse(Object.keys(financeParam)[0]);
    } else {
      param = financeParam;
    }

    let functionName = 'finance';
    let parameters = [
      param.amount
    ];
    // console.log(parameters);
    ServiceBase.call(functionName, parameters).then(ret => {
      console.log(ret);
      resolve(ret);
    });
  });
}


/**
 * settle a receipt
 * 
 *
 * settleParam SettleParam 
 * no response value expected for this operation
 **/
exports.receiptSettlePOST = function(settleParam) {
  return new Promise(function(resolve, reject) {
    var param;
    if (Object.keys(settleParam).length <= 1) {
      param = JSON.parse(Object.keys(settleParam)[0]);
    } else {
      param = settleParam;
    }

    let functionName = 'settle';
    let parameters = [
      param.idx
    ];
    // console.log(parameters);
    ServiceBase.call(functionName, parameters).then(ret => {
      console.log(ret);
      resolve(ret);
    });
  });
}


/**
 * sign a receipt
 * 
 *
 * signParam SignParam 
 * no response value expected for this operation
 **/
exports.receiptSignPOST = function(signParam) {
  return new Promise(function(resolve, reject) {
    var param;
    if (Object.keys(signParam).length <= 1) {
      param = JSON.parse(Object.keys(signParam)[0]);
    } else {
      param = signParam;
    }

    let functionName = 'sign';
    let parameters = [
      param.to,
      param.amount,
      param.end
    ];
    // console.log(parameters);
    ServiceBase.call(functionName, parameters).then(ret => {
      console.log(ret);
      resolve(ret);
    });
  });
}


/**
 * transfer a receipt to another company
 * 
 *
 * transferParam TransferParam 
 * no response value expected for this operation
 **/
exports.receiptTransferPOST = function(transferParam) {
  return new Promise(function(resolve, reject) {
    // console.log(Object.keys(transferParam).length);
    var param;
    if (Object.keys(transferParam).length <= 1) {
      param = JSON.parse(Object.keys(transferParam)[0]);
    } else {
      param = transferParam;
    }
    let functionName = 'transfer';
    let parameters = [
      param.to,
      param.amount,
      param.idx
    ];
    // console.log(parameters);
    ServiceBase.call(functionName, parameters).then(ret => {
      console.log(ret);
      resolve(ret);
    });
  });
}


/**
 * Get the list of receipt
 * 
 *
 * returns RecieptList
 **/
exports.receiptsGET = function() {
  return new Promise(function(resolve, reject) {
    let config = Configuration.getInstance();
    let functionName = 'getReceiptLength';
    let parameters = [
      config.account
    ];

    ServiceBase.call(functionName, parameters).then(ret => {
      var examples = {};
      examples['application/json'] = [];

      var callFunc = [];

      for (var i = 0; i < ret.output['0']; i++) {
        let functionName = 'getReceipt';
        let parameters = [
          config.account,
          i
        ];
        callFunc.push(function() {
          return ServiceBase.call(functionName, parameters)
        });
      }
      queue(callFunc).then(result => {
        for (var i = 0; i < result.length; i++) {
          examples['application/json'].push({
            "from": result[i].output.fromName,
            "to": result[i].output.toName,
            "amount": parseInt(result[i].output.amount),
            "status": result[i].output.status==1,
            "end": result[i].output.end
          })
        }
        
        if (Object.keys(examples).length > 0) {
          resolve(examples[Object.keys(examples)[0]]);
        } else {
          resolve();
        }
      })
    });
  });  
}

async function queue(arr) {
  let res = []
  for (let fn of arr) {
    var data = await fn();
    res.push(data);
  }
  return await res
}


