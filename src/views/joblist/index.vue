<template>
  <div class="app-container">
    <el-table border ref="formTable" :data="jobList">
      <el-table-column fixed label="编号" type="index" align="center" />
      <el-table-column label="桌面列表" align="center">
        <template slot-scope="scope">
          {{scope.row.target?scope.row.target.length:0}} 台服务器
          <el-button type="text" icon="el-icon-edit" @click="selectDesk(scope.row)">选择</el-button>
        </template>
      </el-table-column>
      <el-table-column label="运行时间" align="center">
        <template slot-scope="scope">
          {{scope.row.jobFreq | weekConversion }}&nbsp;{{ scope.row.jobTime}}
          <el-button type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">设定</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 选择弹框 -->
    <el-dialog :title="deskTitle" :visible.sync="deskOpen" width="70vw" append-to-body>
      <div style="height: 50vh;overflow-y: auto">
        <el-checkbox-group v-model="checkList">
          <el-row :gutter="10" class="mb8">
            <el-col style="margin-bottom: 10px;" :span="4" v-for="item in deskList" :key="item.name" >
              <div class="clickPanel"  @click.stop.prevent="clickParent(item.name)">
                <el-card class="box-card" >
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
                    状态 : {{item.power_state}}
                  </div>
                </el-card>
              </div>
              <br>
            </el-col>
          </el-row>
        </el-checkbox-group>
      </div>

      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitDesk">确 定</el-button>
        <el-button @click="cancelDesk">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="jobTitle" :visible.sync="jobOpen" width="500px" append-to-body>
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
    getJoblist,
    delJobInfo,
    updateJobInfo,
    addJobInfo,
} from "@/api/joblist/joblist";
import {
    deskList
} from "@/api/desk/desk";
import { Message } from 'element-ui'
let JobFreqList = [
    { value: '*', name: '每天' },
    { value: '1,2,3,4,5', name: '工作日' },
    { value: '1', name: '每周一' },
    { value: '2', name: '每周二' },
    { value: '3', name: '每周三' },
    { value: '4', name: '每周四' },
    { value: '5', name: '每周五' },
    { value: '6', name: '每周六' },
    { value: '7', name: '每周日' },
]
export default {
    name: "Joblist",
    filters: {
        'weekConversion': function (value1) {
            for(let index in JobFreqList){
                if(JobFreqList[index].value === value1){
                    return JobFreqList[index].name
                }
            }
            return value1
        }
    },
  data() {
    return {
      // 遮罩层
      loading: true,
      //桌面列表数据
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
        JobFreqList: JobFreqList,
        checkList:[],
      // job数据
      jobList: [{
        id: '1',
        deskNameList: 'VM1,VM2,VM3',
        jobTimeName: '每日6:30'
      },
      {
        id: '2',
        deskNameList: 'VM4,VM5,VM6',
        jobTimeName: '每日8:30'
      },
      ],
      // 弹出层标题
      deskTitle: "桌面列表",
      // 是否显示弹出层
      deskOpen: false,
      // 弹出层标题
      jobTitle: "设定时间",
      // 是否显示弹出层
      jobOpen: false,
      // 查询参数
      // 表单参数
      form: {},
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
    this.getList();
  },
  computed: {
    addressListDisable() {
      if (this.form.addressType && this.form.addressType === '0') {
        return true;
      } else {
        return false;
      }
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
    /** 查询执行器列表 */
    getList() {
      this.loading = true;
      console.log(111)
      getJoblist(this.queryParams).then((response) => {
        this.jobList = response;
        this.total = response.length;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.jobOpen = false;
      this.form ={};
    },

    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "新增执行器";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
        this.form = row
        this.jobOpen = true;
        this.title = "修改执行器";
    },
    /** 提交按钮 */
    submitForm() {
        this.$refs["form"].validate((valid) => {
            if (valid) {
                // if (this.form.id != null) {
                //     updateGroup(this.form).then((response) => {
                //         this.msgSuccess("修改成功");
                //         this.open = false;
                //         this.getList();
                //     });
                // } else {
                //     addGroup(this.form).then((response) => {
                //         this.msgSuccess("新增成功");
                //         this.open = false;
                //         this.getList();
                //     });
                // }
                const time = this.form.jobTime.split(":");
                const cron = '0 '+time[1]+' '+time[0]+' ? * '+this.form.jobFreq+' *'
                this.form.cron = cron
                // this.form.target = this.getSelected()
                console.log(this.form)
                updateJobInfo(this.form).then((response) => {
                    this.$message({
                        message: '设置成功',
                        type: 'success'
                    });
                    this.checkList = []
                    // deskList().then((response) => {
                    //     this.deskList = response;
                    // });
                    this.getList();
                    this.jobOpen = false;
                });
            }
        });

    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm("是否确认删除的数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() =>{
            delJobInfo(row.primaryKey).then(() => {
                this.getList();
                this.msgSuccess("删除成功");
            })
        })
    },
    //选择按钮
    async selectDesk(item) {
        //去后台请求数据
        deskList().then((response) => {
            this.deskList = this.deskList = response;
        });

        this.checkList = [];
        this.form = item;
        for(let index in item.target){
            this.checkList.unshift(item.target[index].name)
        }

      this.deskOpen = true;
    },
    //取消
    cancelDesk() {
        this.deskOpen = false;
        this.deskList = []
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
    submitDesk() {
        const  selectDeskList = this.getSelected()
        if(selectDeskList.length>0){
            this.form.target = selectDeskList;
            updateJobInfo(this.form).then((response) => {
                this.$message({
                    message: '更新成功',
                    type: 'success'
                });
                this.checkList = []
                this.deskOpen = false;
                this.deskList = []
                this.getList();
            });
        }
    }
  },
};
</script>
<style>
  .el-checkbox-group{
    font-size: 14px;
  }
</style>
