<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8" style="margin-bottom: 10px;">
      <el-col :span="1.5">
        <el-button type="primary" icon="" @click="insert">新建</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" icon="" @click="update">编辑</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" icon="" @click="">定时</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" icon="" @click="handleDeleteList">删除</el-button>
      </el-col>
    </el-row>
    <div class="content-container">
        <el-table border ref="formTable" :data="jobList" @selection-change="handleSelectionChange">
          <el-table-column fixed type="selection"  width="50px" align="center"/>
          <el-table-column fixed label="编号"  width="50px" type="index" align="center"/>
          <el-table-column label="任务名称" align="center">
            <template slot-scope="scope">
              {{ scope.row.title ? scope.row.title : '' }}
            </template>
          </el-table-column>
          <el-table-column label="桌面列表" align="center">
            <template slot-scope="scope">
              {{ scope.row.target ? scope.row.target.length : 0 }} 台服务器
              <el-button type="text" icon="el-icon-edit" @click="selectDesk(scope.row)">选择</el-button>
            </template>
          </el-table-column>
          <el-table-column label="运行时间" align="center">
            <template slot-scope="scope">
              {{ scope.row.jobFreq | weekConversion }}&nbsp;{{ scope.row.jobTime }}
<!--              <el-button type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">设定</el-button>-->
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
              <el-col style="margin-bottom: 10px;" :span="4" v-for="item in deskList" :key="item.vm">
                <div class="clickPanel" @click.stop.prevent="clickParent(item.name)">
                  <el-card class="box-card">
                    <div slot="header" class="clearfix">
                      <el-checkbox :label="item.name"  style=" padding: 3px 0" type="text" :key="item.vm"/>
                    </div>
                    <div class="text item">
                      CPU : {{ item.cpu_count }}
                    </div>
                    <div class="text item">
                      内存 : {{ item.memory_size_MiB }}
                    </div>
                    <div class="text item">
                      状态 : {{ item.power_state }}
                    </div>
                  </el-card>
                </div>
                <br>
              </el-col>
            </el-row>
          </el-checkbox-group>
        </div>

        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitDesk">确 定</el-button>
          <el-button @click="cancelDesk">取 消</el-button>
        </div>
      </el-dialog>

      <el-dialog :title="jobTitle" :visible.sync="jobOpen" width="500px" append-to-body>
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
          <el-form-item label="执行动作" prop="action">
            <el-radio-group v-model="form.action">
              <el-radio label="1">开机</el-radio>
              <el-radio label="2">关机</el-radio>
            </el-radio-group>
          </el-form-item>
          <!--   56 4 15 * * ? *   -->
          <el-form-item label="执行时间" prop="jobTime">
            <el-time-picker :style="{width:'207.71px'}" v-model="form.jobTime" value-format="H:m" placeholder="任意时间点">
            </el-time-picker>
          </el-form-item>
          <el-form-item label="执行间隔" prop="jobFreq">
            <el-select class="item-width" v-model="form.jobFreq" placeholder="请选择">
              <el-option v-for="dict in JobFreqList" :key="dict.value" :label="dict.name" :value="dict.value"/>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </el-dialog>

      <!-- 选择弹框 -->
      <el-dialog :title="allTitle" :visible.sync="allOpen" width="714px" append-to-body align="left">
        <el-form ref="form" :model="form" :rules="rules" label-width="150px">
          <el-form-item label="标题" prop="title">
            <el-input v-model="form.title" style="width: 406px;"></el-input>
          </el-form-item>
          <el-form-item label="服务器" >
            <el-select placeholder="请选择服务器" multiple  clearable v-model="checkList" style="width: 406px;" @change="getSelectDep">
              <el-option label="全选" value="all" key="-1"></el-option>
              <el-option v-for="(item, index) in deskList" :label="item.name" :value="item.vm" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <!--   56 4 15 * * ? *   -->
          <el-form-item label="执行间隔" prop="jobFreq">
            <el-select class="item-width" style="width: 406px;" multiple clearable v-model="form.jobFreqList" @change="getSelectJobFreq" placeholder="请选择">
              <el-option v-for="dict in JobFreqList" :key="dict.value" :label="dict.name" :value="dict.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="执行时间" prop="jobTime">
            <div :style="{width:'202.71px',float:'left'}" >
              <el-date-picker  v-model="form.startDate" value-format="yyyy-mm-dd" placeholder="起始日期">
              </el-date-picker>
            </div>
            <div :style="{width:'202.71px',float:'left'}" >
              <el-time-picker :style="{width:'202.71px'}"   v-model="form.jobTime" value-format="H:m" placeholder="任意时间点">
              </el-time-picker>
            </div>
          </el-form-item>
          <el-form-item label="结束时间" prop="endDate">
            <div :style="{width:'202.71px',float:'left'}" >
              <el-date-picker  v-model="form.endDate" value-format="yyyy-mm-dd" placeholder="结束日期">
              </el-date-picker>
            </div>
            <div :style="{width:'202.71px',float:'left'}" >
              <el-time-picker :style="{width:'202.71px'}"   v-model="form.endJobTime" value-format="H:m" placeholder="任意时间点">
              </el-time-picker>
            </div>
          </el-form-item>
          <el-form-item label="执行动作" prop="action">
            <el-radio-group v-model="form.action">
              <el-radio label="1">开机</el-radio>
              <el-radio label="2">关机</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelAll">取 消</el-button>
          <el-button type="primary" @click="submitAll">确 定</el-button>
        </div>
      </el-dialog>

    </div>
  </div>
</template>

<script>
import {
  getJoblist,
  delJobInfo,
  updateJobInfo
} from "@/api/joblist/joblist";
import {
  deskList,
  addJobInfo
} from "@/api/desk/desk";
import {Message} from 'element-ui'

let JobFreqList = [
  {value: '*', name: '每天'},
  {value: '1', name: '每周一'},
  {value: '2', name: '每周二'},
  {value: '3', name: '每周三'},
  {value: '4', name: '每周四'},
  {value: '5', name: '每周五'},
  {value: '6', name: '每周六'},
  {value: '7', name: '每周日'},
]
export default {
  name: "Joblist",
  filters: {
    'weekConversion': function (value1) {
      let name = ''
      for (let index in JobFreqList) {
        if(value1){
          let values = value1.split(",")
          values.forEach(value => {
            if (JobFreqList[index].value === value) {
              name += JobFreqList[index].name+" "
            }
          })
        }
      }
      return name
    }
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      //桌面列表数据
      deskList: [
        {deskName: "vm1", cpu: 'I7', memory: '2058M'},
        {deskName: "vm2", cpu: 'I7', memory: '2058M'},
        {deskName: "vm3", cpu: 'I7', memory: '2058M'},
        {deskName: "vm4", cpu: 'I7', memory: '2058M'},
        {deskName: "vm5", cpu: 'I7', memory: '2058M'},
        {deskName: "vm6", cpu: 'I7', memory: '2058M'},
        {deskName: "vm7", cpu: 'I7', memory: '2058M'},
        {deskName: "vm8", cpu: 'I7', memory: '2058M'},
        {deskName: "vm9", cpu: 'I7', memory: '2058M'},
        {deskName: "vm10", cpu: 'I7', memory: '2058M'},
      ],
      JobFreqList: JobFreqList,
      checkList: [],
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
      allTitle: "新增",
      // 是否显示弹出层
      deskOpen: false,
      allOpen: false,
      checkJobList: [],
      // 弹出层标题
      jobTitle: "设定时间",
      // 是否显示弹出层
      jobOpen: false,
      // 查询参数
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        desks:[{ required: true, message: "服务器列表不能为空", trigger: "blur" }],
        action: [{ required: true, message: "Job动作不能为空", trigger: "blur" }],
        jobTime: [
          { required: true, message: "执行时间不能为空", trigger: "blur" },
        ],
        jobFreq: [
          { required: true, message: "执行间隔不能为空", trigger: "blur" },
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
    clickParent(e) {
      // const checkBox = e.currentTarget.getElementsByTagName("input")[0]
      console.log(e)
      for (let desk in this.checkList) {
        if (this.checkList[desk] === e) {
          this.checkList.splice(desk, 1)
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
      deskList().then((response) => {
        this.deskList = this.deskList = response;
      });
    },
    // 取消按钮
    cancel() {
      this.jobOpen = false;
      this.form = {};
    },

    /** 新增按钮操作 */
    insert() {
      this.allOpen = true;
      this.allTitle = "新增执行器";
      this.form = {action: '1'};
      this.checkList = []
    },
    /** 修改按钮操作 */
    update() {
      let checkJobList = this.getCheckedJob('update');
      if(checkJobList.length == 1){
        this.form = checkJobList[0];
        this.allOpen = true;
        this.allTitle = "修改执行器";
        this.checkList = []
        console.log(this.form.target)
        this.form.target.forEach(desk => {
          this.checkList = [...this.checkList,desk.vm]
        })
      }
    },
    cancelAll(){
      this.allOpen = false;
      this.checkList = [];
    },
    getCheckedJob(type){
      if(this.checkJobList.length === 0){
        this.$message({
          message: '请选择一个任务',
          type: 'warning'
        });
        return [];
      } else if(type === 'update'&&this.checkJobList.length > 1){
        this.$message({
          message: '只能选择一个任务进行修改操作',
          type: 'warning'
        });
        return [];
      }
      return this.checkJobList
    },
    submitAll() {
      let selectDeskList = this.deskList.filter(item => {
        // console.log(this.checkList.includes(item.name))
        return this.checkList.includes(item.vm);
      });
      if (selectDeskList.length === 0) {
        this.$message({
          message: '请至少选择一台服务器',
          type: 'error'
        });
      }
      if (selectDeskList.length > 0) {
        this.form.target = selectDeskList;
        this.$refs["form"].validate((valid) => {
          if (valid) {
            const time = this.form.jobTime.split(":");
            const cron = '0-59 ' + time[1] + ' ' + time[0] + ' ? * ' + this.form.jobFreq + ' *'
            this.form.cron = cron
            console.log(this.form);
            if(this.form.primaryKey){
              updateJobInfo(this.form).then((response) => {
                this.$message({
                  message: '设置成功',
                  type: 'success'
                });
                this.checkList = []
                this.deskOpen = false;
                this.deskList = []
                this.allOpen = false;
                this.getList();
                this.jobOpen = false;
              });
            } else {
              addJobInfo(this.form).then((response) => {
                this.$message({
                  message: '设置成功',
                  type: 'success'
                });
                this.checkList = []
                this.deskOpen = false;
                this.deskList = []
                this.allOpen = false;
                this.getList();
                this.jobOpen = false;
              });
            }

          }
        });
      }
    },
    getSelectJobFreq(data) {
      if(data.includes('*')){
        this.form.jobFreqList = ['*'];
        this.form.jobFreq = '*'
      } else {
        this.form.jobFreq = ''
        this.form.jobFreqList.forEach(jobFreq => {
          this.form.jobFreq += jobFreq+","
        })
        if(this.form.jobFreq.length>0){
          this.form.jobFreq = this.form.jobFreq.substr(0,this.form.jobFreq.length-1);
        }
      }
    },
    getSelectDep(data) {
      if(data.includes('all')){
        this.checkList = [];
        this.deskList.forEach(desk =>{
          this.checkList = [...this.checkList, desk.vm]
        })
      }
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          const time = this.form.jobTime.split(":");
          const cron = '0-59 ' + time[1] + ' ' + time[0] + ' ? * ' + this.form.jobFreq + ' *'
          this.form.cron = cron
          console.log(this.form)
          updateJobInfo(this.form).then((response) => {
            this.$message({
              message: '设置成功',
              type: 'success'
            });
            this.checkList = []
            this.deskOpen = false;
            this.deskList = []
            this.allOpen = false;
            this.getList();
            this.jobOpen = false;
          });
        }
      });

    },
    handleDeleteList(){
      let checkJobList = this.getCheckedJob('delete');
      if(checkJobList.length > 0){
        checkJobList.forEach(job =>{
          delJobInfo(job.primaryKey).then(() => {
            this.getList();
            this.msgSuccess("删除成功");
          })
        })
      }
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm("是否确认删除的数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delJobInfo(row.primaryKey).then(() => {
            this.getList();
            this.msgSuccess("删除成功");
          })
        })
    },
    //选择按钮
    async selectDesk(item) {
      console.log(item)
      this.checkList = []
      this.form = item;
      for (let index in item.target) {
        this.checkList.unshift(item.target[index].name)
      }

      this.deskOpen = true;
    },
    //取消
    cancelDesk() {
      this.deskOpen = false;
      this.checkList = []
    },
    getSelected() {
      let selectDeskList = this.deskList.filter(item => {
        // console.log(this.checkList.includes(item.name))
        return this.checkList.includes(item.name);
      });
      if (selectDeskList.length === 0) {
        this.$message({
          message: '请至少选择一台服务器',
          type: 'error'
        });
      }
      return selectDeskList
    },
    submitDesk() {
      const selectDeskList = this.getSelected()
      if (selectDeskList.length > 0) {
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
    },
    /**
     *
     * @param rows 选中行的集合
     */
    handleSelectionChange:function(rows) {//rows为选中行的数据的集合
      //勾选后，需要往后台传递什么数据，从rows中获取即可

      this.checkJobList = []
      rows.forEach(row =>{
        this.checkJobList = [...this.checkJobList,row]
      })
    }
  },
};
</script>
<style>
.el-checkbox-group {
  font-size: 14px;
}


.el-button--warning {
  color: #fff;
  background-color: rgba(142, 21, 128, 0.66);
  border-color: rgba(142, 21, 128, 0.66);
}
</style>
