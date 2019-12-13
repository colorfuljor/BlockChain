<template>
  <div class="main">
      <el-col :span="3" >
        <el-menu
          default-active="1"
          class="el-menu-vertical-demo"
          @select="handleSelect">
          <el-menu-item index="1">
            <i class="el-icon-user-solid"></i>
            <span slot="title">公司信息</span>
          </el-menu-item>
          <el-menu-item index="2">
            <i class="el-icon-money"></i>
            <span slot="title">所有单据</span>
          </el-menu-item>
        </el-menu>
      </el-col>
      <div v-if="isInfo">
      <el-main>
          <el-table :data="infoData">
            <el-table-column prop="name" label="公司名" width="300">
            </el-table-column>
            <el-table-column prop="addr" label="公司地址" width="400">
            </el-table-column>
            <el-table-column prop="credit" label="信用评级" width="200">
            </el-table-column>
            <el-table-column prop="accepted" label="是否接受未认证" width="200">
            </el-table-column>
            <el-table-column prop="debt" label="欠款金额">
            </el-table-column>
        </el-table>
      </el-main>
    </div>
    <div v-else="">
      <el-main>
        <el-table :data="tableData">
          <el-table-column prop="id" label="账单号" width="200">
          </el-table-column>
          <el-table-column prop="from" label="欠款人" width="300">
          </el-table-column>
          <el-table-column prop="to" label="收款人" width="300">
          </el-table-column>
          <el-table-column prop="amount" label="金额" width="200">
          </el-table-column>
          <el-table-column prop="status" label="状态" width="200">
          </el-table-column>
          <el-table-column prop="end" label="截止日期" width="200">
          </el-table-column>
          <el-table-column label="操作" fixed="right">
            <template slot-scope="scope">
              <el-button @click="doTransfer(scope.$index)" type="text" size="small">转让</el-button>
              <el-button @click="doSettle(scope.$index)" type="text" size="small">结算</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      infoData: [
      ],
      tableData: [
      ],
      isInfo: true,
      to: '',
      name: '',
      amount: ''
    }
  },
  mounted: function () {
    this.initInfo()
  },
  methods: {
    handleSelect (key, keyPath) {
      if (key === '1') {
        this.isInfo = true
      } else {
        this.isInfo = false
      }
    },
    initInfo: function () {
      var that = this
      this.$axios.request({
        url: that.$url + '/receipts',
        method: 'GET',
        responseType: 'json'
      }).then(function (response) {
        for (let i in response.data) {
          if (response.data[i].amount !== 0) {
            that.tableData.push({
              id: i,
              from: response.data[i].from,
              to: response.data[i].to,
              amount: response.data[i].amount,
              status: response.data[i].status ? '已认证' : '未认证',
              end: response.data[i].end
            })
          }
        }
        // console.log(response.data)
      })
      this.$axios.request({
        url: that.$url + '/company',
        method: 'GET',
        responseType: 'json'
      }).then(function (response) {
        that.infoData.push({
          name: response.data.name,
          addr: response.data.address,
          credit: response.data.credit,
          accepted: response.data.accepted ? '是' : '否',
          debt: response.data.debt
        })
        // console.log(response.data)
      })
    },
    doTransfer: function (index) {
      var that = this
      this.$prompt('请输入接收者账户地址', '转让单据', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        this.to = value
        this.$prompt('请输入接收者公司名', '转让单据', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          this.name = value
          this.$prompt('请输入金额', '转让单据', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(({ value }) => {
            this.amount = value
            this.$axios.request({
              url: that.$url + '/receipt/transfer',
              method: 'Post',
              data: JSON.stringify({
                to: this.to,
                name: this.name,
                amount: this.amount,
                idx: that.tableData[index].id
              }),
              responseType: 'json'
            }).then(function (response) {
              console.log(response.data)
              if (response.data.status === '0x0') {
                that.$message({
                  message: '转让成功',
                  type: 'success'
                })
                that.tableData[index].amount -= this.amount
                if (that.tableData[index].amount === 0) {
                  that.tableData.splice(index, 1)
                }
              } else {
                that.$message.error('失败')
              }
            })
          })
        })
      })
    },
    doSettle: function (index) {
      var that = this
      this.$confirm('此操作将永久删除该单据, 是否继续?', '结算单据', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.request({
          url: that.$url + '/receipt/settle',
          method: 'Post',
          data: JSON.stringify({
            idx: that.tableData[index].id
          }),
          responseType: 'json'
        }).then(function (response) {
          if (response.data.status === '0x0') {
            that.$message({
              message: '结算成功',
              type: 'success'
            })
            that.tableData.splice(index, 1)
          } else {
            that.$message.error('失败')
          }
          console.log(response.data)
        })
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-menu-vertical-demo {
  height: 650px;
}
</style>
