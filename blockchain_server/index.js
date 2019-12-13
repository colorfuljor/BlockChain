'use strict';

var fs = require('fs'),
    path = require('path'),
    http = require('http');

var app = require('connect')();
var swaggerTools = require('swagger-tools');
var jsyaml = require('js-yaml');
var serverPort = 8080;
var Configuration = require('./nodejs-sdk/packages/api/common/configuration').Configuration;
var Web3jService = require('./nodejs-sdk/packages/api').Web3jService;
const { getAbi } = require('./utils/base');
const { getContractAddress } = require('./utils/base');
const utils = require('./nodejs-sdk/packages/api/common/utils');
var { ContractsDir, ContractsOutputDir, ContractName } = require('./constant');
var ServiceBase = require('./service/ServiceBase');

Configuration.setConfig(path.join(__dirname, './conf/config.json'));

// swaggerRouter configuration
var options = {
  swaggerUi: path.join(__dirname, '/swagger.json'),
  controllers: path.join(__dirname, './controllers'),
  useStubs: process.env.NODE_ENV === 'development' // Conditionally turn on stubs (mock mode)
};

// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
var spec = fs.readFileSync(path.join(__dirname,'api/swagger.yaml'), 'utf8');
var swaggerDoc = jsyaml.safeLoad(spec);

// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {

  // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
  app.use(middleware.swaggerMetadata());

  // Validate Swagger requests
  app.use(middleware.swaggerValidator());

  // Route validated requests to appropriate controller
  app.use(middleware.swaggerRouter(options));

  // Serve the Swagger documents and Swagger UI
  app.use(middleware.swaggerUi());

  // Start the server
  http.createServer(app).listen(serverPort, function () {
    let web3jService = new Web3jService();
    let contractName = ContractName;
    // let contractPath = path.join(ContractsDir, contractName);
    // if (!fs.existsSync(contractPath)) {
    //     throw new Error(`${contractName} doesn't exist`);
    // }
    // let outputDir = ContractsOutputDir;
    // web3jService.deploy(contractPath, outputDir).then(result => {
    //   if (result.status === '0x0') {
    //       let addressPath = path.join(outputDir, `.${path.basename(contractName, '.sol')}.address`);

    //       try {
    //           fs.writeFileSync(addressPath, result.contractAddress + '\n');
    //       } catch (error) { }
    //   }
    //   console.log({contractAddress: result.contractAddress, status: result.status})
    // })
    
    let config = Configuration.getInstance();
    let functionName = 'newCompany';
    let parameters = [
      'name',
      'address',
      1,
    ];
    ServiceBase.call(functionName, parameters).then(ret => {
      console.log(ret);
    });
    console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
    console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
  });

});