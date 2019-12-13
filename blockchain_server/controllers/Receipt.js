'use strict';

var utils = require('../utils/writer.js');
var Receipt = require('../service/ReceiptService');

module.exports.receiptFinancePOST = function receiptFinancePOST (req, res, next) {
  console.log('post /receipt/finance');
  var financeParam = req.swagger.params['financeParam'].value;
  Receipt.receiptFinancePOST(financeParam)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.receiptSettlePOST = function receiptSettlePOST (req, res, next) {
  console.log('post /receipt/settle');
  var settleParam = req.swagger.params['settleParam'].value;
  Receipt.receiptSettlePOST(settleParam)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.receiptSignPOST = function receiptSignPOST (req, res, next) {
  console.log('post /receipt/sign');
  var signParam = req.swagger.params['signParam'].value;
  Receipt.receiptSignPOST(signParam)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.receiptTransferPOST = function receiptTransferPOST (req, res, next) {
  console.log('post /receipt/transfer');
  var transferParam = req.swagger.params['transferParam'].value;
  Receipt.receiptTransferPOST(transferParam)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.receiptsGET = function receiptsGET (req, res, next) {
  console.log('get /receipts');
  Receipt.receiptsGET()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
