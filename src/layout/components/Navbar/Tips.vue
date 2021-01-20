<template>
  <div class="btn-bell">
    <el-tooltip effect="dark" :content="message?`有${message}条未读消息`:`消息中心`" placement="bottom">
      <router-link to="/tabs" class="icon-item">
        <i class="el-icon-bell" />
      </router-link>
    </el-tooltip>
    <span v-if="message" class="btn-bell-badge">点</span>
  </div>
</template>
<script>
export default {
  data () {
    return {
      collapse: false,
      fullscreen: false,
      name: 'linxin',
      message: 2
    }
  }
}
</script>
<style lang="scss" scoped>
  .icon-item {
    text-align: center;
    float: left;
    font-size: 20px;
    color: #24292e;
    cursor: pointer;
  }
  .btn-bell-badge{
    cursor: pointer;
    position: relative;
    right: 8px;
    top: -11px;
    /*width: 8px;*/
    /*height: 8px;*/
    line-height: 5px;
    border-radius: 4px;
    background: #f56c6c;
    color: #f56c6c;
    font-size: 5px;
  }
</style>
