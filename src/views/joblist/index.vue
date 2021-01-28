<template>
  <div class="app-container">
    <el-table border ref="formTable" :data="jobList">
      <el-table-column fixed label="编号" type="index" align="center" />
      <el-table-column label="桌面列表" align="center">
        <template slot-scope="scope">
          {{scope.row.deskNameList}}
          <el-button type="text" icon="el-icon-edit" @click="selectDesk(scope.row)">选择</el-button>
        </template>
      </el-table-column>
      <el-table-column label="运行时间" align="center">
        <template slot-scope="scope">
          {{scope.row.jobTimeName}}
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
    <el-dialog :title="deskTitle" :visible.sync="deskOpen" width="1000px" append-to-body>
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
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitDesk">确 定</el-button>
        <el-button @click="cancelDesk">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="jobTitle" :visible.sync="jobOpen" width="500px" append-to-body>
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
  getJoblist,
} from "@/api/joblist/joblist";
import {
  deskList,
} from "@/api/desk/desk";
import { Message } from 'element-ui'

export default {
  name: "Joblist",
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
    // this.getList();
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
    /** 查询执行器列表 */
    getList() {
      this.loading = true;
      getJoblist(this.queryParams).then((response) => {
        this.groupList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        appName: null,
        title: null,
        order: null,
        addressType: '0',
        addressList: null,
      };
      this.resetForm("form");
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
      this.reset();
      const id = row.id || this.ids;
      getGroup(id).then((response) => {
        response.data.addressType = response.data.addressType + '';
        this.form = response.data;
        this.open = true;
        this.title = "修改执行器";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateGroup(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addGroup(this.form).then((response) => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm("是否确认删除的数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delGroup(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
    //选择按钮
    async selectDesk() {
      //去后台请求数据
      // await deskList().then((response) => {
      //   this.deskList = response.data;
      // });
      //查询出数据默认选中状态设为false
      if (this.deskList && this.deskList.length > 0) {
        this.deskList.forEach(item => {
          item.checked = false;
        });
      }
      this.deskOpen = true;
    },
    //取消
    cancelDesk() {
      this.deskOpen = false;
    },
    //选中机器
    checkDesk(item) {
      if (item.checked) {
        item.checked = false;
      } else {
        item.checked = true;
      }
    },
    submitDesk() {
      let selectDeskList = this.deskList.filter(item => {
        return item.checked === true;
      });
      turnon(selectDeskList).then((response) => {
        this.$message({
          message: '保存成功',
          type: 'success'
        });
      });
    }
  },
};
</script>
