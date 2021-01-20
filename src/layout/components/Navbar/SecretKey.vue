<template>
  <div>
    <el-form ref="row" :model="row" status-icon :rules="rules" label-width="70px" style="width: 400px; margin-left:50px;" class="demo-ruleForm">
      <el-form-item label="用户名">
        <el-input v-model="row.id" readonly="readonly" autocomplete="off" />
      </el-form-item>
      <el-form-item label="原密码" prop="pwd">
        <el-input v-model="row.pwd" type="password" autocomplete="off" @blur="judgeOriginalPassword" />
      </el-form-item>
      <el-form-item label="新密码" prop="pass">
        <el-input v-model="row.pass" type="password" autocomplete="off" />
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input v-model="row.checkPass" type="password" autocomplete="off" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm()">提交</el-button>
        <el-button @click="resetForm()">重置</el-button>
        <el-button type="primary" @click="cancelChangePassword()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getToken } from '@/utils/auth'
import { getInfo, queryActiveUser, changeActiveUserPwd } from '@/api/user.js'
export default {
  name: 'SecretKey',
  data () {
    var checkId = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('用户名不能为空'))
      } else {
        callback()
      }
    }
    var checkPwd = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('原密码不能为空'))
      } else {
        callback()
      }
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.row.checkPass !== '') {
          this.$refs.row.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.row.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      row: {
        id: '',
        pwd: '',
        pass: '',
        checkPass: ''
      },
      isCorrect: false,
      rules: {
        id: [
          { validator: checkId, trigger: 'blur' }
        ],
        pwd: [
          { validator: checkPwd, trigger: 'blur' }
        ],
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getUserName()
  },
  methods: {
    /* 判断原密码是否正确*/
    judgeOriginalPassword () {
      queryActiveUser(this.row.id, this.row.pwd).then((res) => {
        if (res.msg === '1') {
          this.$notify({
            title: '提示',
            message: '原密码错误',
            type: 'error',
            duration: 2000
          })
          this.isCorrect = false
        } else {
          this.isCorrect = true
        }
      })
    },
    /* 得到用户名*/
    getUserName () {
      const access_token = getToken()
      getInfo(access_token).then((res) => {
        this.row.id = res.oauth2Request.requestParameters.username
      })
    },
    /* 提交数据的操作*/
    submitForm () {
      this.$refs.row.validate((valid) => {
        if (valid && this.isCorrect) {
          const actIdUser = {
            id: this.row.id,
            pwd: this.row.pass
          }
          changeActiveUserPwd(actIdUser).then((res) => {
            this.$notify({
              title: '成功',
              message: res.msg,
              type: 'success',
              duration: 2000
            })
            this.$parent.$parent.closeDialog()
            // this.resetForm()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 取消操作
    cancelChangePassword () {
      this.$parent.$parent.closeDialog()
    },
    /* 重置数据*/
    resetForm () {
      this.$refs.row.resetFields()
    }
  }
}
</script>
<style scoped>

</style>
