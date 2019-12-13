<template>
  <div class="main">
    <div>
        <el-input v-model="amount" placeholder="金额" class='inputClass'></el-input>
    </div>
    <br>
    <div>
      <el-button type="primary" @click="doFinance()">确认</el-button>
    </div>
    <br>
  </div>
</template>

<script>
export default {
  name: 'Sign',
  data () {
    return {
      amount: ''
    }
  },
  methods: {
    doFinance: function () {
      this.$confirm('确认金额无误？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var that = this
        this.$axios.request({
          url: that.$url + '/receipt/finance',
          method: 'Post',
          data: JSON.stringify({
            amount: that.amount
          }),
          responseType: 'json'
        }).then(function (response) {
          that.amount = ''
          console.log(response.data)
          if (response.data.status === '0x0') {
            that.$message({
              message: '融资成功',
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
