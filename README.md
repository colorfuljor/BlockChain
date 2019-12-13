# BlockChain
基于FISCO-BCOS的供应链应用

## FISCO-BCOS的配置

### 添加新节点

fisco目录下就是已建立好的一条区块链，使用用户要做的就是在这条链上添加自己作为节点到链上去（新节点的加入查看[fisco-bcos文档](https://fisco-bcos-documentation.readthedocs.io/zh_CN/latest/docs/manual/build_chain.html)），完成一系列后续的功能。

### 创建新用户

在fisco/console/目录下：

```
$ bash get_account.sh
[INFO] Account Address   : 0xee5fffba2da55a763198e361c7dd627795906ead
[INFO] Private Key (pem) : accounts/0xee5fffba2da55a763198e361c7dd627795906ead.pem
```

然后会在accounts目录下生成相应的pem，然后将其复制到blockchain_server/conf/目录下，并更改配置文件（看后续操作教程）。

## 服务端部署

### 部署node.js sdk

首先进入blockchain_server目录:

```
$ git submodule add https://github.com/FISCO-BCOS/nodejs-sdk.git blockchain_server/nodejs-sdk
```

然后进入到新出现的blockchain_server/nodejs-sdk目录。

<table><tr><td bgcolor=gray>

*如果您的网络中使用了代理，请先为npm配置代理。如果没有使用代理，请忽略。*

```bash
npm config set proxy <your proxy>
npm config set https-proxy <your proxy>
```

*如果您所使用的网络不能顺利访问npm官方镜像，请使用其他镜像代替，如淘宝：*

```bash
npm config set registry https://registry.npm.taobao.org
```

</td></tr></table>

```bash
# 部署过程中请确保能够访问外网以能够安装第三方依赖包
cd nodejs-sdk
npm install
npm run repoclean
npm run bootstrap
```

### 配置文件

配置文件放置于blockchain_server/conf/目录下，文件名为conf.json，文件内容如下：

```
{
    "privateKey": {
        "type": "pem",
        "value": "./0x144d5ca47de35194b019b6f11a56028b964585c9.pem"
    },
    "nodes": [
        {
            "ip": "127.0.0.1",
            "port": "20200"
        }
    ],
    "authentication": {
        "key": "/fisco/nodes/127.0.0.1/sdk/sdk.key",
        "cert": "/fisco/nodes/127.0.0.1/sdk/sdk.crt",
        "ca": "/fisco/nodes/127.0.0.1/sdk/ca.crt"
    },
    "groupID": 1,
    "timeout": 10000
}
```

首先是privateKey需要更改为现在目录下的pem文件（配置FISCO-BCOS时复制到这个目录下的），然后根据自己的节点部署情况更改nodes，最后authentication为sdk的配置，这里主要要根据fisco的目录调整即可。

其余无需更改，具体配置信息查看[FISCO-BCOS文档](https://fisco-bcos-documentation.readthedocs.io/zh_CN/latest/docs/sdk/nodejs_sdk/configuration.html)。

除此之外，因为首次启动服务器需要初始化公司信息，所以需要更改blockchain_server/index.js文件：

```
67 let config = Configuration.getInstance();
68     let functionName = 'newCompany';
69     let parameters = [
70       'name',
71       'address',
72       1,
73     ];
74     ServiceBase.call(functionName, parameters).then(ret => {
75       console.log(ret);
76     });
```

主要更改上述步骤中的70~72中的参数，第一个参数为公司名，第二个参数为公司地址，第三个参数为是否接受未认证单据（0为接受，1为不接受）。

### 启动服务端

首先先要启动区块链在，在fisco/nodes/127.0.0.1/目录下：

```
$ ./start_all.sh
```

然后在blockchain_server/目录下：

```
$ npm start
```

会自动下载依赖并启动服务端，出现以下信息则启动成功：
```
Your server is listening on port 8080 (http://localhost:8080)
Swagger-ui is available on http://localhost:8080/docs

```

## 客户端启动
通过上述步骤已经启动好服务端了，接下来需要启动客户端。首先进行依赖下载：

```
$ npm install
```

然后启动：

```
$ npm run dev
```

出现以下信息即访问成功，那么就在[http://localhost:8081](http://localhost:8081)访问该网页即可。

```
 DONE  Compiled successfully in 29914ms                                 14:11:22

 I  Your application is running here: http://localhost:8081

```


