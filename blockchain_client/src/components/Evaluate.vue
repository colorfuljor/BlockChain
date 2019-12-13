<template>
  <div class="main">
    <div>
      <el-input v-model="name" placeholder="公司名" class='inputClass'></el-input>
    </div>
    <div>
        <el-input v-model="to" placeholder="公司账户地址" class='inputClass'></el-input>
    </div>
    <div>
        <el-input v-model="credit" placeholder="评估等级" class='inputClass'></el-input>
    </div>
    <br>
    <div>
      <el-button type="primary" @click="doEvalute()">确认</el-button>
    </div>
    <br>
  </div>
</template>

<script>
export default {
  name: 'Evalute',
  data () {
    return {
      name: '',
      to: '',
      credit: ''
    }
  },
  mounted: function () {
    this.check()
  },
  methods: {
    check: function () {
      var that = this
      this.$axios.request({
        url: that.$url + '/company',
        method: 'GET',
        responseType: 'json'
      }).then(function (response) {
        if (!response.data.admin) {
          alert('你没有权限访问')
          that.$router.push('/')
        }
      })
    },
    doEvalute: function () {
      this.$confirm('确认信息无误？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var that = this
        this.$axios.request({
          url: that.$url + '/company/Evaluate',
          method: 'Post',
          data: JSON.stringify({
            name: that.name,
            to: that.to,
            credit: that.credit
          }),
          responseType: 'json'
        }).then(function (response) {
          that.name = ''
          that.to = ''
          that.credit = ''
          console.log(response.data)
          if (response.data.status === '0x0') {
            that.$message({
              message: '评估成功',
              type: 'success'
            })
          } else {
            that.$message.error('失败')
          }
        })
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.main {
  width: 350px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin: auto;
  margin-top: 20px;
  margin-bottom: 100px;
}
.inputClass{
  margin-top: 30px;
  width:300px
}
</style>
