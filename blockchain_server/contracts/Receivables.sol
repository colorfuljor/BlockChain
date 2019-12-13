pragma solidity ^0.4.24;

//实现供应链应收账款资产的溯源、流转
contract Receivables {
    //公司的实体，包含了公司的各种信息
    struct Company {
        string name;    //公司名称
        string addr;    //公司地址（区别于用户公钥地址）
        uint credit;    //信用级别，由银行对公司进行评级：0代表未评级，1~5代表由低到高的级别
        uint accepted;  //可接受的单据可信度，暂时只有0和1
        uint debt;      //欠款金额
	uint admin;
        Receipt[] receipts;
    }
    //应收账款的实体，包含单据的从属关系等信息
    struct Receipt {
        address from;   //欠款公司地址
        uint amount;    //具体金额 
        uint status;    //单据的可信度，初始为0，银行认证后为1，可扩展其他认证方式增加认证状态
        string end;     //还款到期时间
    }
    //合约的创建者，可以是各种第三方金融机构，拥有信用评级以及认证receipt的权力
    address bank;   
    //存储了每一个Company的address
    mapping(address => Company) public companys;
    uint[5] creditLimit = [1000, 10000, 100000, 1000000, 10000000];

    event Sign(string from, string to, uint amount, string end);
    event Transfer(string from, string to, uint amount, uint idx);
    event Finance(string from, uint amount);
    event Settle(string from, string to, uint amount);
    event Verify(string to, uint idx);
    event Evaluate(string to, uint credit);

    //构造函数，由第三方金融机构调用
    constructor() {
        bank = msg.sender;  //记录银行地址
	companys[msg.sender].name = 'admin';
	companys[msg.sender].admin = 1;
    }

    //签订应收账款单据
    //参数：
    //      to: 接收单据的企业
    //      amount: 应收账款金额
    //      end: 还款时间
    function sign(address to, uint amount, string end) {
        Company storage sender = companys[msg.sender];
        Company storage receiver = companys[to];

        //to不能是自己
        require(to != msg.sender, "不允许与自己交易");
        //需要信用额度大于签订的金额
        require(creditLimit[companys[msg.sender].credit - 1] >= amount, "信用额度不足");

        sender.debt += amount;
        receiver.receipts.push(Receipt({
            from: msg.sender,
            amount: amount,
            status: 0,
            end: end
        }));
        
        emit Sign(sender.name, receiver.name, amount, end);
    }

    //转让应收账款单据
    //参数：
    //      to: 接收单据的企业
    //      amount: 应收账款金额
    //      idx: 转让的单据号
    function transfer(address to, uint amount, uint idx) {
        Company storage sender = companys[msg.sender];
        Company storage receiver = companys[to];

        //to不能是自己
        require(to != msg.sender, "不允许与自己交易");
        //需要有对应的单据
        require(sender.receipts.length > idx, "无此单据");
        //需要对应单据的可信度
        require(sender.receipts[idx].status >= receiver.accepted, "该企业不接受未认证单据");
        //需要对应单据金额足够多
        require(sender.receipts[idx].amount >= amount, "单据金额不足");

        sender.receipts[idx].amount -= amount;
        receiver.receipts.push(Receipt({
            from: sender.receipts[idx].from,
            amount: amount,
            status: 0,
            end: sender.receipts[idx].end
        }));
        
        emit Transfer(sender.name, receiver.name, amount, idx);
    }

    //利用应收账款向银行融资（类似于单据转让）
    //参数：
    //      amount: 融资金额
    function finance(uint amount) {
        Company storage sender = companys[msg.sender];

        //银行自身不能融资
        require(bank != msg.sender, "不允许与自己交易");

        uint have = 0;  
        for (uint i = 0; i < sender.receipts.length; i++) {
            //不接受未认证的单据
            if (sender.receipts[i].status == 0) continue;
            
            have += sender.receipts[i].amount;
        }
        //需要拥有金额总数大于融资金额
        require(have >= amount, "");
        
        for (i = 0; i < sender.receipts.length; i++) {
            //过滤无效单据
            if (sender.receipts[i].amount == 0 || sender.receipts[i].status == 0) continue;

            if (amount >= sender.receipts[i].amount) {
                //如果此单据金额不足，则全额用于融资
                uint temp = sender.receipts[i].amount;
                sender.receipts[i].amount = 0;
                companys[bank].receipts.push(Receipt({
                    from: sender.receipts[i].from,
                    amount: temp,
                    status: 1,
                    end: sender.receipts[i].end
                }));
                amount -= temp;
            }
            else {
                //如果单据金额足够，则将部分用于融资
                sender.receipts[i].amount -= amount;
                companys[bank].receipts.push(Receipt({
                    from: sender.receipts[i].from,
                    amount: amount,
                    status: 1,
                    end: sender.receipts[i].end
                }));
                break;
            }
        }
        
        emit Finance(sender.name, amount);
    }

    //应收账款支付结算
    //参数：
    //      idx: 结算的单据索引
    function settle(uint idx) {
        Company storage receiver = companys[msg.sender];
        require(receiver.receipts[idx].amount > 0, "账单无效");
        Company storage sender = companys[receiver.receipts[idx].from];
        
        //注销应收款单据
        uint amount = receiver.receipts[idx].amount; 
        receiver.receipts[idx].amount = 0;
        sender.debt -= amount;
        
        emit Settle(sender.name, receiver.name, amount);
    }

    //银行对企业进行信用评估
    //参数：
    //      to: 评估的企业
    //      credit: 评估等级
    function evaluate(address to, uint credit) {
        require(msg.sender == bank, "没有权限进行信用评估");

        companys[to].credit = credit;
        
        emit Evaluate(companys[to].name, credit);
    }

    //银行对企业的单据进行认证
    //参数：
    //      to: 认证的企业
    //      idx: 认证的单据索引
    function verify(address to, uint idx) {
        require(msg.sender == bank, "没有权限进行单据认证");

        companys[to].receipts[idx].status = 1;
        
        emit Verify(companys[to].name, idx);
    }
    
    //获取单据数量
    function getReceiptLength(address to) view returns (uint) {
        return companys[to].receipts.length;
    }
    
    //获取单据信息
    function getReceipt(address to, uint idx) view returns (string fromName, string toName, uint amount, uint status, string end) {
        Receipt storage receipt = companys[to].receipts[idx];
        
        return (companys[receipt.from].name, companys[to].name, receipt.amount, receipt.status, receipt.end);
    }
    
    //
    function getCompany(address to) view returns (string name, string addr, uint credit, uint accepted, uint debt, uint admin) {
        Company company = companys[to];
        
        return (company.name, company.addr, company.credit, company.accepted, company.debt, company.admin);
    }

    //初始化公司
    //参数：
    //      name: 认证的企业
    //      addr: 认证的单据索引
    //      accepted: 可接受的单据可信度
    function newCompany(string name, string addr, uint accepted) {
        companys[msg.sender].name = name;
        companys[msg.sender].addr = addr;
        companys[msg.sender].accepted = accepted;
	companys[msg.sender].admin = 0;
    }
}

