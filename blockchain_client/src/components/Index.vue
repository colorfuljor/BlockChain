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
        {
          name: '测试公司2',
          addr: '广东省广州市番禺区大学城',
          credit: '5',
          accepted: '接受',
          debt: '1000000'
        }
      ],
      tableData: [
        {
          from: '测试公司1',
          to: '测试公司2',
          amount: '1000000',
          status: '已认证',
          end: '2019-12-30'
        },
        {
          from: '测试公司1',
          to: '测试公司2',
          amount: '1000000',
          status: '已认证',
          end: '2019-12-30'
        }
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
      // var that = this
      this.$axios.request({
        url: '',
        method: 'GET',
        responseType: 'json'
      }).then(function (response) {
        console.log(response.data)
      })
    },
    doTransfer: function (index) {
      this.$prompt('请输入接收者账户地址', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        this.to = value
        this.$prompt('请输入接收者公司名', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          this.name = value
          this.$prompt('请输入金额', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(({ value }) => {
            this.amount = value
            console.log(this.to)
            console.log(this.to)
            console.log(this.amount)
            console.log(index)
            this.$axios.request({
              url: '',
              method: 'Post',
              data: JSON.stringify({
                to: this.to,
                name: this.to,
                amount: this.amount,
                idx: index
              }),
              responseType: 'json'
            }).then(function (response) {
              console.log(response.data)
            })
          })
        })
      })
    },
    doSettle: function (index) {
      this.$confirm('此操作将永久删除该单据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.request({
          url: '',
          method: 'Post',
          data: JSON.stringify({
            idx: index
          }),
          responseType: 'json'
        }).then(function (response) {
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
