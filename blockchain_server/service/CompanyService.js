'use strict';

var fs = require('fs'),
    path = require('path'),
    http = require('http');
var ServiceBase = require('./ServiceBase');
var Configuration = require('../nodejs-sdk/packages/api/common/configuration').Configuration;

Configuration.setConfig(path.join(__dirname, '../conf/config.json'));

/**
 * Bank evaluate a company
 * 
 *
 * evaluateParam EvaluateParam 
 * no response value expected for this operation
 **/
exports.companyEvaluatePOST = function(evaluateParam) {
  return new Promise(function(resolve, reject) {
    var param;
    if (Object.keys(evaluateParam).length <= 1) {
      param = JSON.parse(Object.keys(evaluateParam)[0]);
    } else {
      param = evaluateParam;
    }

    let functionName = 'evaluate';
    let parameters = [
      param.to,
      param.credit
    ];
    // console.log(parameters);
    ServiceBase.call(functionName, parameters).then(ret => {
      console.log(ret);
      resolve(ret);
    });
  });
}


/**
 * Get company details
 * 
 *
 * returns Company
 **/
exports.companyGET = function() {
  return new Promise(function(resolve, reject) {
    let config = Configuration.getInstance();
    let functionName = 'getCompany';
    let parameters = [
      config.account
    ];

    ServiceBase.call(functionName, parameters).then(ret => {
      var examples = {};
      examples['application/json'] = {
        "name" : ret.output.name,
        "address" : ret.output.addr,
        "accepted" : ret.output.accepted==0,
        "credit" : parseInt(ret.output.credit),
        "debt" : parseInt(ret.output.debt),
        "admin" : ret.output.admin==1
      };
      if (Object.keys(examples).length > 0) {
        resolve(examples[Object.keys(examples)[0]]);
      } else {
        resolve();
      }
    });    
  });
}


/**
 * Bank verify a receipt
 * 
 *
 * verifyParam VerifyParam 
 * no response value expected for this operation
 **/
exports.companyVerifyPOST = function(verifyParam) {
  return new Promise(function(resolve, reject) {
    var param;
    if (Object.keys(verifyParam).length <= 1) {
      param = JSON.parse(Object.keys(verifyParam)[0]);
    } else {
      param = verifyParam;
    }

    let functionName = 'verify';
    let parameters = [
      param.to,
      param.idx
    ];
    // console.log(parameters);
    ServiceBase.call(functionName, parameters).then(ret => {
      console.log(ret);
      resolve(ret);
    });
  });
}

