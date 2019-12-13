'use strict';

var utils = require('../utils/writer.js');
var Company = require('../service/CompanyService');

module.exports.companyEvaluatePOST = function companyEvaluatePOST (req, res, next) {
  console.log('post /company/evaluate');
  var evaluateParam = req.swagger.params['evaluateParam'].value;
  Company.companyEvaluatePOST(evaluateParam)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.companyGET = function companyGET (req, res, next) {
  console.log('get /company');
  Company.companyGET()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.companyVerifyPOST = function companyVerifyPOST (req, res, next) {
  console.log('post /company/verify');
  var verifyParam = req.swagger.params['verifyParam'].value;
  Company.companyVerifyPOST(verifyParam)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
