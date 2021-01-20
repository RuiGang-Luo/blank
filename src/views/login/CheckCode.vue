<template>
  <div class="app-container">
    <span class="filter-item" style="margin-left: 50px">邀请码 : </span>
    <el-input v-model="inviteCode" placeholder="请输入邀请码" class="filter-item input-register" style="width: 300px" />
    <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="confirmCode">
      激活
    </el-button>
    <br>
  </div>
</template>
<script>
export default {
  data () {
    return {
      inviteCode: ''
    }
  },
  methods: {
    confirmCode () {
      if (this.inviteCode === 'Ant111') {
        this.$router.push({ path: 'register', query: { userCode: 'antfin' }})
      } else if (this.inviteCode === '') {
        this.$router.push({ path: 'register', query: { userCode: 'antfin' }})
      } else {
        this.$alert('邀请码错误', 'Notice', {
          confirmButtonText: '确定'
        })
        this.inviteCode === ''
      }
    }
  }
}
</script>
