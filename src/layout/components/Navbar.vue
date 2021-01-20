<template>
  <div ref="navbar" class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <search id="header-search" class="right-menu-item" />
        <error-log v-if="hasBugStatisticsPrivFlag" class="errLog-container right-menu-item hover-effect" />
        <screenfull id="screenfull" class="right-menu-item hover-effect" />
        <el-tooltip content="Global Size" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>
      </template>
      <el-dropdown class="margin-right-30 right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <!--<el-tooltip :content="displayName" effect="dark" placement="bottom">-->
          <el-tooltip :content="displayName" effect="dark">
            <div v-if="!avatar" class="avatar-container user-avatar"><span class="avatar-content">{{ displayName | userNameFilter }}</span></div>
            <img v-if="avatar" :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          </el-tooltip>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <span @click="setActiveName('secretKey','修改密码')">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item>
            <span @click="setActiveName('email','问题反馈')">问题反馈</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :show-close="false"
      custom-class="dialog-50"
    >
      <components :is="activeName" ref="child" />
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
import Search from '@/components/HeaderSearch'
import Tips from './Navbar/Tips'
import SecretKey from './Navbar/SecretKey'
import Breadcrumb from '@/components/Breadcrumb'
import ErrorLog from '@/components/ErrorLog'
import SizeSelect from '@/components/SizeSelect'
export default {
  components: {
    Hamburger,
    Screenfull,
    Tips,
    SecretKey,
    Search,
    Breadcrumb,
    ErrorLog,
    SizeSelect
  },
  filters: {
    userNameFilter(username) {
      const temp = username.substring(0, 1)
      return temp
    }
  },
  data() {
    return {
      displayName: '',
      activeName: 'secretKey',
      dialogTitle: '',
      dialogVisible: false,
      imgSrc: require('@/icons/picc_logo.png'),
      systemName: 'VCENTER管理平台',
      hasBugStatisticsPrivFlag: false
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'sidebar',
      'avatar',
      'device'
    ])
  },
  mounted() {
    // console.log('init navbar 高：' + this.$refs.navbar.offsetHeight)
    // store.dispatch('layout/setComponentHeight', { componentName: 'navbar', height: this.$refs.navbar.offsetHeight })
      this.displayName = '无'
  },
  created(){
    this.checkMenuMangerEditPriv()
  },
  methods: {
    //查看是否有bug统计权限
    checkMenuMangerEditPriv(){
      const uid = this.$store.getters.user.name
        this.hasBugStatisticsPrivFlag = true
    },
    closeDialog() {
      this.dialogVisible = false
      this.$refs.child.resetForm()
    },
    setActiveName(name, title) {
      this.dialogVisible = true
      this.activeName = name
      this.dialogTitle = title
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      this.$store.dispatch('tagsView/delAllViews')
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=/dashboard`)
    }
  }
}
</script>
<style lang="scss" scoped>
  .avatar-container {
    height: 1.5rem;
    width: 1.5rem;
    /*display: inline-block;*/
    background: #aaaaaa;
    text-align: center;
    border-radius: 0.75rem;
  }

  .avatar-content {
    /*line-height: 32px;*/
    line-height: 38px;
    margin-top: 0.25rem;
    display: block;
  }

  .navbar {
    height: 50px;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0,21,41,.08)
  }
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent
  }
  /*:hover {*/
     /*background: rgba(0, 0, 0, .025)*/
   /*}*/
  .breadcrumb-container {
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px
  }
  :focus {
     outline: none;
   }
  .right-menu-item {
    display: inline-block;
    padding: 0 8px;
    height: 100%;
    font-size: 18px;
    color: #5a5e66;
    vertical-align: text-bottom
  }
  .hover-effect {
     cursor: pointer;
     transition: background .3s
   }
  /*:hover {*/
     /*background: rgba(0, 0, 0, .025)*/
   /*}*/
  .margin-right-30 {
    margin-right: 30px
  }
  .avatar-wrapper {
    /*margin-top: 5px;*/
    margin-top: 2.5px;
    position: relative
  }
  .user-avatar {
    cursor: pointer;
    width: 40px;
    height: 40px;
    border-radius: 10px;
    line-height: 10px;
  }
  .el-icon-caret-bottom {
    cursor: pointer;
    position: absolute;
    right: -20px;
    top: 25px;
    font-size: 12px
  }
</style>
<style scoped>
  .dialog-50 {
    width: 50%;
  }
</style>

