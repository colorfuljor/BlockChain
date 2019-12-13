<template>
  <div id="app">
    <el-menu
      :router="true"
      :default-active="this.$route.path"
      class="header"
      mode="horizontal"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
      <h1 id="name">供应链</h1>
      <el-menu-item index="/" >主页</el-menu-item>
      <el-menu-item index="/sign">签署单据</el-menu-item>
      <el-menu-item index="/finance">融资</el-menu-item>
      <el-menu-item index="/verify">账单认证</el-menu-item>
      <el-menu-item index="/evaluate">信用评估</el-menu-item>
    </el-menu>
    <!--<img src="./assets/logo.png">-->
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
body {
  margin: 0;
}
.log {
  height: 60px;
}
#name {
  line-height: 1.2;
  height: 36.8px;
  float: left;
  font-size: 30px;
  margin-block-start: 10px;
  margin-block-end: 10px;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  color: #FFF;
  width: 120px;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
