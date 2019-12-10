<template>
  <div class="main">
    <div>
      <el-input v-model="name" placeholder="接收者公司名" class='inputClass'></el-input>
    </div>
    <div>
        <el-input v-model="to" placeholder="接收者账户地址" class='inputClass'></el-input>
    </div>
    <div>
        <el-input v-model="amount" placeholder="金额" class='inputClass'></el-input>
    </div>
    <div>
        <el-input v-model="end" placeholder="截至日期" class='inputClass'></el-input>
    </div>
    <br>
    <div>
      <el-button type="primary" @click="doSign()">确认</el-button>
    </div>
    <br>
  </div>
</template>

<script>
export default {
  name: 'Sign',
  data () {
    return {
      to: '',
      name: '',
      amount: '',
      end: ''
    }
  },
  methods: {
    doSign: function () {
      this.$confirm('确认信息无误？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var that = this
        this.$axios.request({
          url: '',
          method: 'Post',
          data: JSON.stringify({
            to: that.to,
            name: that.name,
            amount: that.amount,
            end: that.end
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
