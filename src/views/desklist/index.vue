<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" @click="handleTurnon">开机</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" @click="handleTurnoff">关机</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-delete" @click="handlerSetTime">设定时间</el-button>
      </el-col>
    </el-row>
    <br>
    <div>
      <el-row :gutter="10" class="mb8">
        <el-col :span="8" v-for="item in deskList" :key="item.deskName">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>{{item.deskName}}</span>
              <el-checkbox style="float: right; padding: 3px 0" type="text" @change="checkDesk(item)" />
            </div>
            <div class="text item">
              CPU {{item.cpu}}
            </div>
            <div class="text item">
              内存 {{item.memory}}
            </div>
          </el-card>
          <br>
        </el-col>
      </el-row>
    </div>
    <!-- 对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="Job行为" prop="jobStatus">
          <el-radio-group v-model="form.jobStatus">
            <el-radio label="0">开机</el-radio>
            <el-radio label="1">关机</el-radio>
          </el-radio-group>
        </el-form-item>
        <!--   56 4 15 * * ? *   -->
        <el-form-item label="Job时间" prop="jobTime">
          <el-time-picker :style="{width:'207.71px'}" v-model="form.jobTime" placeholder="任意时间点">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="Job频率" prop="jobFreq">
          <el-select class="item-width" v-model="form.jobFreq" placeholder="请选择">
            <el-option v-for="dict in JobFreqList" :key="dict.value" :label="dict.name" :value="dict.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import {
  deskList,
  turnon,
  turnoff,
  addJobInfo,
} from "@/api/desk/desk";
import { Message } from 'element-ui'

export default {
  name: 'DeskList',
  data() {
    return {
      deskList: [
        { deskName: "vm1", cpu: 'I7', memory: '2058M' },
        { deskName: "vm2", cpu: 'I7', memory: '2058M' },
        { deskName: "vm3", cpu: 'I7', memory: '2058M' },
        { deskName: "vm4", cpu: 'I7', memory: '2058M' },
        { deskName: "vm5", cpu: 'I7', memory: '2058M' },
        { deskName: "vm6", cpu: 'I7', memory: '2058M' },
        { deskName: "vm7", cpu: 'I7', memory: '2058M' },
        { deskName: "vm8", cpu: 'I7', memory: '2058M' },
        { deskName: "vm9", cpu: 'I7', memory: '2058M' },
        { deskName: "vm10", cpu: 'I7', memory: '2058M' },
      ],
      JobFreqList: [
        { value: '0', name: '每天' },
        { value: '1', name: '每工作日' },
        { value: '2', name: '每周一' },
        { value: '3', name: '每周二' },
        { value: '4', name: '每周三' },
        { value: '5', name: '每周四' },
        { value: '6', name: '每周五' },
        { value: '7', name: '每周六' },
        { value: '8', name: '每周日' },
      ],
      title: "设定开关机Job",
      // 是否显示弹出层
      open: false,
      // 表单参数
      form: {
        jobStatus: '0',
      },
      // 表单校验
      rules: {
        jobStatus: [{ required: true, message: "Job行为不能为空", trigger: "blur" }],
        jobTime: [
          { required: true, message: "Job时间不能为空", trigger: "blur" },
        ],
        jobFreq: [
          { required: true, message: "Job频率不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    //去后台请求数据
    deskList().then((response) => {
      this.deskList = response.data;
    });
    //查询出数据默认选中状态设为false
    if (this.deskList && this.deskList.length > 0) {
      this.deskList.forEach(item => {
        item.checked = false;
      });
    }

  },
  methods: {
    //选中机器
    checkDesk(item) {
      if (item.checked) {
        item.checked = false;
      } else {
        item.checked = true;
      }
    },
    // 表单重置
    reset() {
      this.form = {
        jobStatus: '0',
        jobTime: null,
        JobFreq: '0',
      };
      this.resetForm("form");
    },
    //开机
    handleTurnon() {
      let selectDeskList = this.deskList.filter(item => {
        return item.checked === true;
      });
      turnon(selectDeskList).then((response) => {
        this.$message({
          message: '开机成功',
          type: 'success'
        });
      });
    },
    //关机
    handleTurnoff() {
      let selectDeskList = this.deskList.filter(item => {
        return item.checked === true;
      });
      turnoff(selectDeskList).then((response) => {
        //TODO 弹窗提示
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    handlerSetTime() {
      this.open = true;
      this.reset();
    },
    /** 提交设置时间 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          //TODO 生成cron表达式
          // this.form.jobTime
          // this.form.jobFreq
          // this.form.cron = 

          addJobInfo(this.form).then((response) => {
            this.$message({
              message: '设置成功',
              type: 'success'
            });
            this.open = false;
            //TODO 成功之后的操作
          });
        }
      });
    },
  }
}
</script>

<style lang="scss">
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
</style>
