<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8" style="margin-bottom: 10px;">
      <el-col :span="1.5">
        <el-button type="primary"  icon="" @click="handleTurnon">开机</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger"  icon="" @click="handleTurnoff">关机</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning"  icon="" @click="handlerSetTime">定时</el-button>
      </el-col>
    </el-row>
    <div class="content-container">
      <el-checkbox-group v-model="checkList">
      <el-row :gutter="10" class="mb8">

          <el-col style="margin-bottom: 10px;" :span="4" v-for="item in deskList" :key="item.name" >
            <div class="clickPanel"  @click.stop.prevent="clickParent(item.name)">
              <el-card :class="{'box-card':true,'green':(item.power_state === 'POWERED_ON')}" >
                <div slot="header" class="clearfix">
                  <el-checkbox :label="item.name"  style=" padding: 3px 0" type="text"  :key="item.vm"  />
                </div>
                <div class="text item">
                  CPU : {{item.cpu_count}}
                </div>
                <div class="text item">
                  内存 : {{item.memory_size_MiB}}
                </div>
                <div class="text item">
                  状态 : {{item.power_state === 'POWERED_ON'?'运行中':'已关机'}}
                </div>
              </el-card>
            </div>

            <br>
          </el-col>

      </el-row>
      </el-checkbox-group>
    </div>
    <!-- 对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="Job行为" prop="action">
          <el-radio-group v-model="form.action">
            <el-radio label="1" >开机</el-radio>
            <el-radio label="2" >关机</el-radio>
          </el-radio-group>
        </el-form-item>
        <!--   56 4 15 * * ? *   -->
        <el-form-item label="Job时间" prop="jobTime">
          <el-time-picker :style="{width:'207.71px'}" v-model="form.jobTime" value-format="H:m" placeholder="任意时间点">
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

        checkList:[],
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
        { value: '*', name: '每天' },
        { value: '1,2,3,4,5', name: '每工作日' },
        { value: '1', name: '每周一' },
        { value: '2', name: '每周二' },
        { value: '3', name: '每周三' },
        { value: '4', name: '每周四' },
        { value: '5', name: '每周五' },
        { value: '6', name: '每周六' },
        { value: '7', name: '每周日' },
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
          action: [{ required: true, message: "Job动作不能为空", trigger: "blur" }],
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
      this.deskList = response;
    });
    //查询出数据默认选中状态设为false
    if (this.deskList && this.deskList.length > 0) {
      this.deskList.forEach(item => {
        item.checked = false;
      });
    }

  },
  methods: {
      clickParent(e){
         // const checkBox = e.currentTarget.getElementsByTagName("input")[0]
          console.log(e)
          for(let desk in this.checkList){
            if (this.checkList[desk] === e){
                this.checkList.splice(desk,1)
                return
            }

          }

          this.checkList.unshift(e)
      },

    getSelected(){
        let selectDeskList = this.deskList.filter(item => {
            // console.log(this.checkList.includes(item.name))
            return this.checkList.includes(item.name);
        });
        if(selectDeskList.length === 0){
            this.$message({
                message: '请至少选择一台服务器',
                type: 'error'
            });
        }
        return selectDeskList
    },

    //关机
    handleTurnoff() {
        const  selectDeskList = this.getSelected()
        if(selectDeskList.length>0){
            turnoff(selectDeskList).then((response) => {
                this.$message({
                    message: '关机成功',
                    type: 'success'
                });
                this.checkList = []
                deskList().then((response) => {
                    this.deskList = response;
                });
            });
        }

    },
      //开机
      handleTurnon() {
          const  selectDeskList = this.getSelected()
          if(selectDeskList.length>0){
              turnon(selectDeskList).then((response) => {
                  this.$message({
                      message: '开机成功',
                      type: 'success'
                  });
                  this.checkList = []
                  deskList().then((response) => {
                      this.deskList = response;
                  });
              });
          }
      },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    handlerSetTime() {
        const  selectDeskList = this.getSelected()
        if(selectDeskList.length>0){
            this.open = true;
            this.form = {
                action: '1',
            }
        }
    },
    /** 提交设置时间 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          //TODO 生成cron表达式
          // this.form.jobTime
          // this.form.jobFreq
          // this.form.cron =
            const time = this.form.jobTime.split(":");
            const cron = '? '+time[1]+' '+time[0]+' ? * '+this.form.jobFreq+' *'
            this.form.cron = cron
            this.form.target = this.getSelected()
            console.log(this.form)
            addJobInfo(this.form).then((response) => {
                this.$message({
                  message: '设置成功',
                  type: 'success'
                });
                this.checkList = []
                // deskList().then((response) => {
                //     this.deskList = response;
                // });
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
  .green{
    background-color: #cee7cb;
  }
  .content-container{
    height:80vh;
    background-color: transparent;
    width:100%;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .clickPanel{
    background-color: transparent;
    width: 100%;
    position: relative;
    z-index: 1000;
  }
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
