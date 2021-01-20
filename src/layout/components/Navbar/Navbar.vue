<template>
  <div ref="navbar" class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" style="width:1000px" class="hamburger-container" @toggleClick="toggleSideBar" />
    <template v-if="device!=='mobile'">
      <img class="logo breadcrumb-container" style="width:1000px" :src="imgSrc">
      <label class="system-name breadcrumb-container">{{ systemName }}</label>
    </template>
    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <search id="header-search" class="right-menu-item" />
        <screenfull id="screenfull" class="right-menu-item hover-effect" />
        <tips id="header-tips" class="right-menu-item" />
      </template>
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <el-tooltip content="XXXXXXX公司" effect="dark" placement="bottom">
            <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          </el-tooltip>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <span @click="setActiveName('secretKey','修改密码')">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item>
            <span @click="setActiveName('email','问题反馈')">联系客服</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="el-dialog">
      <el-dialog
        :title="dialogTitle"
        :visible.sync="dialogVisible"
        :show-close="false"
        custom-class="dialog-50"
      >
        <components :is="activeName" ref="child" />
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeDialog">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import store from '@/store'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
import Search from '@/components/HeaderSearch'
import Tips from './Tips'
import SecretKey from './SecretKey'
export default {
  components: {
    Hamburger,
    Screenfull,
    Tips,
    SecretKey,
    Email,
    Search
  },
  data() {
    return {
      activeName: 'secretKey',
      dialogTitle: '',
      dialogVisible: false,
      imgSrc: require('@/icons/picc_logo.png'),
      systemName: 'VCENTER管理平台'
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device'
    ])
  },
  mounted() {
    store.dispatch('layout/setComponentHeight', { componentName: 'navbar', height: this.$refs.navbar.offsetHeight })
  },
  methods: {
    closeDialog() {
      this.dialogVisible = false
      if (this.activeName === 'secretKey') {
        this.$refs.child.resetForm()
      }
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
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>
<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, .08);
  background: -webkit-linear-gradient(left bottom, white, #dbf1ff); /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(top right, white, #dbf1ff); /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(top right, white, #dbf1ff); /* Firefox 3.6 - 15 */
  background: linear-gradient(to top right, white, #dbf1ff); /* 标准的语法 */
 }
  .logo{
    height:36px;
    line-height: 55px;
    transform: matrix(1, 0, 0, 1, 0, 8);
    z-index: auto;
  }
  .system-name{
    font-family:algerian,courier;
    font-size: 24px;
    color: #000000;
    line-height: 55px;
  }
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color: transparent
  }
    :hover {
      background: rgba(0, 0, 0, .025)
    }
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
      vertical-align: text-bottom;
    }
      .hover-effect {
        cursor: pointer;
        transition: background .3s
      }
        :hover {
          background: rgba(0, 0, 0, .025)
        }
    .avatar-container {
      margin-right: 30px}
      .avatar-wrapper {
        margin-top: 5px;
        position: relative
      }
        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
</style>
<style scoped>
  .el-dialog .dialog-50 {
     width:50%;
  }
</style>

