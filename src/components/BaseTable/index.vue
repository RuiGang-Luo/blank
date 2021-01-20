<template>
  <div class="app-container">
    <div class="filter-container">

      <el-form
        :rules="criteria.rules"
        :model="criteria.query"
        label-position="left"
        :label-width="form.labelWidth"
        style="width:100%; padding-left:10px;"
        size="mini"
      >
        <el-row :gutter="24">
          <template v-for="item in Object.keys(criteria.rules)">
            <el-col :xs="criteria.rules[item][0].xs" :sm="criteria.rules[item][0].sm" :lg="criteria.rules[item][0].lg">
              <el-form-item :label="criteria.rules[item][0].elementLabel" :prop="item" :class="{'non-required': !criteria.rules[item][0].required}">
                <template v-if="criteria.rules[item][0].elementType ==='text'">
                  <el-input v-model.trim ="criteria.query[item]" size="mini" clearable :placeholder="criteria.rules[item][0].placeholder" />
                </template>
                <template v-else-if="criteria.rules[item][0].elementType ==='select'">
                  <el-select v-model="criteria.query[item]"
                             style="width:100%"
                             clearable
                             :placeholder="criteria.rules[item][0].placeholder"
                             :filterable="criteria.rules[item][0].filterable"
                  >
                    <template v-for="option in dropDownOptions[item]">
                      <el-option :label="option.display_name" :value="option.key"/>
                    </template>
                  </el-select>
                </template>
              </el-form-item>
            </el-col>
          </template>
        </el-row>
      </el-form>

      <el-row :gutter="24">
        <el-col :xs="24" :sm="24" :lg="24">
          <div style="width: 100%;" align="center">
            <template v-for="item in Object.keys(queryButton)">
              <el-button
                v-waves
                size="mini"
                class="filter-item"
                :type="queryButton[item].type" :icon="queryButton[item].icon" @click="funcProxy(queryButton[item].func,criteria)" >
                {{ queryButton[item].text }}
              </el-button>
            </template>
          </div>
        </el-col>
      </el-row>

    </div>

    <el-table
      v-loading="tableList.listLoading"
      :data="tableList.data"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      :max-height="tableList.maxHeight"
    >
      <el-table-column label="序号" prop="id" align="center" width="50">
        <template slot-scope="scope">
          <span>{{ scope.$index+1+(criteria.query.pageNum-1)*criteria.query.pageSize }}</span>
        </template>
      </el-table-column>

      <template v-for="item in Object.keys(tableList.columns)">
        <el-table-column :label="tableList.columns[item].label" :width="tableList.columns[item].width" :align="tableList.columns[item].align" :show-overflow-tooltip="tableList.columns[item].showOverflowTooltip" >
          <template slot-scope="scope">
            <template v-if="tableList.columns[item].filter">
              <span>{{ scope.row[item] | dropDownFilter(dropDownOptions, item) | tableList.columns[item].filter(item) }}</span>
            </template>
            <template v-else>
              <span>{{ scope.row[item] | dropDownFilter(dropDownOptions, item) }}</span>
            </template>
          </template>
        </el-table-column>
      </template>

      <el-table-column label="操作" align="center" :width=rowButton.length*50 class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <template v-for="item in Object.keys(rowButton)">
            <el-button
              v-waves
              size="mini"
              class="filter-item"
              :type="rowButton[item].type" :icon="rowButton[item].icon" @click="funcProxy(rowButton[item].func,row)" >
              {{ rowButton[item].text }}
            </el-button>
          </template>
        </template>
      </el-table-column>

    </el-table>
    <pagination
      v-show="tableList.total>0"
      :total="tableList.total"
      :page.sync="criteria.query.pageNum"
      :limit.sync="criteria.query.pageSize"
      @pagination="funcProxy(tableList.page.pagination,criteria.query)"
    />
    <el-dialog
      :title="dialog.title"
      :visible.sync="dialog.visible"
      width="1000px"
      top="60px"
      :append-to-body="dialog.appendToBody"
      :close-on-click-modal="false"
    >
      <el-form
        v-if="dialog.type === 'form'"
        :rules="form.rules"
        :model="form.data"
        label-position="left"
        :label-width="form.labelWidth"
        style="width: 100%; padding-left:30px;padding-right:30px;"
        size="mini"
      >
        <el-row :gutter="24">
          <template v-for="item in Object.keys(form.rules)">
            <el-col :xs="form.rules[item][0].xs" :sm="form.rules[item][0].sm" :lg="form.rules[item][0].lg">
              <el-form-item :label="form.rules[item][0].elementLabel" :prop="item" :class="{'non-required': !form.rules[item][0].required}">
                <template v-if="form.rules[item][0].elementType ==='text'">
                  <el-input v-model.trim ="form.data[item]"
                            size="mini"
                            :disabled="form.rules[item][0].disabled"
                            :placeholder="form.rules[item][0].placeholder"
                            @change="funcProxy(form.rules[item][0].onChange,form.data[item])"
                  />
                </template>
                <template v-else-if="form.rules[item][0].elementType ==='select'">
                  <el-select v-model="form.data[item]"
                             style="width:100%"
                             :disabled="form.rules[item][0].disabled"
                             :filterable="form.rules[item][0].filterable"
                             placeholder="请选择..."
                             @change="funcProxy(form.rules[item][0].onChange,form.data[item])"
                  >
                    <template v-for="option in dropDownOptions[item]">
                      <el-option :label="option.display_name" :value="option.key"/>
                    </template>
                  </el-select>
                </template>
                <template v-else-if="form.rules[item][0].elementType ==='textarea'">
                  <el-input
                    v-model="form.data[item]"
                    type="textarea"
                    :disabled="form.rules[item][0].disabled"
                    :rows="form.rules[item][0].textareaRows"
                    :placeholder="form.rules[item][0].placeholder"
                    @change="funcProxy(form.rules[item][0].onChange,form.data[item])"
                    class=""
                  />
                </template>
                <template v-else-if="form.rules[item][0].elementType ==='file'">
                  <el-upload
                    :ref="item"
                    :action="getPath(form.rules[item][0].uploadUri)"
                    :limit="form.rules[item][0].uploadLimit"
                    :auto-upload="true"
                    :disabled="form.rules[item][0].disabled"
                    :file-list="upload[item]"
                    :on-success="(response, file, fileList)=>{ debugger;form.data[item] = response.msg }"
                    :on-error="(err, file, fileList)=>{ this.$message.error(err) }"
                    :on-remove="(file, fileList)=>{ handleUploadRemove(file, fileList, item,form.rules[item][0].removeAttachmentFunc) }"
                    :on-exceed="handleExceed"
                    list-type="text"
                  >
                    <div slot="trigger" class="el-upload__trigger">点击上传，只能上传jpg/png文件，且不超过65kb</div>
                  </el-upload>
                </template>
                <template v-else-if="form.rules[item][0].elementType ==='image'">

                  <el-upload
                    v-if="!form.rules[item][0].disabled"
                    :ref="item"
                    :action="getPath(form.rules[item][0].uploadUri)"
                    :limit="form.rules[item][0].uploadLimit"
                    :auto-upload="true"

                    :file-list="upload[item]"
                    :on-success="(response, file, fileList)=>{ debugger;form.data[item] = response.msg }"
                    :on-error="(err, file, fileList)=>{ this.$message.error(err) }"
                    :on-remove="(file, fileList)=>{ handleUploadRemove(file, fileList, item,form.rules[item][0].removeAttachmentFunc) }"
                    :on-exceed="handleExceed"
                    list-type="picture"
                  >
                    <div slot="trigger" class="el-upload__trigger">点击上传，只能上传jpg/png文件</div>
                  </el-upload>
                  <template v-if="form.rules[item][0].disabled">
                    <img v-if="imageList[form.data[item]]" :src="imageList[form.data[item]]['url']" width="100" height="100">

                  </template>

                </template>
              </el-form-item>
            </el-col>
          </template>
        </el-row>
      </el-form>

      <div  v-if="dialog.type === 'rela'" style="width: 100%; ">
        <slot :name="dialog.relaId">

        </slot>
      </div>

      <div slot="footer" class="dialog-footer">
        <template v-for="item in Object.keys(dialog.func)">
          <el-button :type="dialog.func[item].type" @click="funcProxy(dialog.func[item].func,dialog.data)" >
            {{ dialog.func[item].text }}
          </el-button>
        </template>
      </div>
    </el-dialog>
  </div>
</template>
<script>

  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import { uploadAttachment, uploadAttachmentUri, removeSysAttachmentsDetailsMore, getAttachment } from '@/api/attachment'

  //data_territories_details
  // let dropDownOptions = {}
  export default {
    components: { Pagination },
    directives: { waves },
    props:{
      init: {
        type: Function,
        require: true,
      },
      dropDownOptionsData: {
        type: Object,
        require: true,
        default: () => {
          return {}
        }
      },
      criteriaData: {
        type: Object,
        require: true,
        default: () => {
          return {}
        }
      },
      tableListData: {
        type: Object,
        require: true,
        default: () => {
          return {}
        }
      },
      buttonListData: {
        type: Object,
        require: true,
        default: () => {
          return {}
        }
      },
      dialogData: {
        type: Object,
        require: true,
        default: () => {
          return {}
        }
      },
      formData: {
        type: Object,
        require: true,
        default: () => {
          return {}
        }
      }
    },
    filters: {
      dropDownFilter (data,options,dataName) {
// debugger
        if (data&&options[dataName]) {
          const option = options[dataName].filter((option) => {
            if (option.key === data) {
              return true
            } else {
              return false
            }
          })
          if(option.length === 1){
            return option.shift().display_name
          } else {
            return data
          }
        }
        return data
      }
    },

    data () {
      return {
        imageList: {},
        criteria: {
          query:{
            pageNum:1,
            pageSize:10
          },
          ruleDefault: {
              xs: 24,
              sm: 24,
              lg: 6,
              placeholder:'请输入',
              message: '此项是必填项',
              trigger: 'blur',
              required: false,
              elementLabel: '',
              elementType: 'text'
          }
        },
        buttonList: {},
        buttonDefault:{
            text: '',
            type: 'primary',
            icon: 'el-icon-edit',
            position: 'query',
            func: this.handleFormDialog,
            dialogFunc: {
              cancel: {
                text: '取消',
                func: ()=>{
                  this.dialog.visible = false
                }
              }

            }
        },
        tableList:{
          maxHeight: '462px',
          page:{},
          columnDefault: {
              showOverflowTooltip: false,
              align: 'center',
              width: '120',
              label: '秘境ID'
          }
        },
        //功能按钮封装代理
        funcProxy: (func,data)=>{
          if(func)
          func(this,data)
          // console.log(this)
        },
        dialog:{
          title: '',
          data: {},
          func: {},
          visible: false
        },
        form:{
          labelWidth: '80px',
          ruleDefault:{
              xs: 24,
              sm: 24,
              lg: 12,
              disabled: false,
              required: false,
              filterable: false,
              placeholder:'请输入',
              textareaRows: 3,
              message: '此项是必填项',
              trigger: 'blur',
              elementLabel: '',
              elementType: 'text',
              uploadLimit: 1
          },
          data:{}
        },
        upload: {

        }
      }
    },
    beforeMount (){
      // debugger
      this.dropDownOptions = this.dropDownOptionsData
      this.criteria = Object.assign(this.criteria,this.criteriaData)
      if(this.criteria.rules){
        for(let rule in this.criteria.rules){
          this.criteria.rules[rule][0] = Object.assign( {},this.criteria.ruleDefault,this.criteria.rules[rule][0])
        }
      }

      this.buttonList = Object.assign(this.buttonList,this.buttonListData)
      for(let button in this.buttonList){
        this.buttonList[button] = Object.assign({},this.buttonDefault,this.buttonList[button])
      }
// console.log(this.buttonList)
      this.tableList = Object.assign(this.tableList,this.tableListData)
      if(this.tableList.columns){
        for(let column in this.tableList.columns){
          this.tableList.columns[column] = Object.assign({},this.tableList.columnDefault,this.tableList.columns[column])
        }
      }

      this.dialog = Object.assign(this.dialog,this.dialogData)

      this.form = Object.assign(this.form,this.formData)
      if(this.form.rules){
        for(let rule in this.form.rules){
          this.form.rules[rule][0] = Object.assign( {},this.form.ruleDefault,this.form.rules[rule][0])
        }
      }


      this.init(this)
      // debugger
    },
    computed: {

      queryButton () {
        if(this.buttonList){
          let option = {}
          let buttonNames = Object.keys(this.buttonList)
          for(let index in buttonNames){
            if (this.buttonList[buttonNames[index]].position === 'query') {
              option[buttonNames[index]] = this.buttonList[buttonNames[index]]
            }
          }
          return option
        }
      },
      rowButton () {
        if(this.buttonList){
          let option = {}
          let buttonNames = Object.keys(this.buttonList)
          for(let index in buttonNames){
            if (this.buttonList[buttonNames[index]].position === 'row') {
              option[buttonNames[index]] = this.buttonList[buttonNames[index]]
            }
          }
          return option
        }
      }
    },
    created () {

    },
    methods: {
      getPath (uri) {
        if(uri){
          return uri+'?access_token=' + this.$store.getters.token
        } else {
          return uploadAttachmentUri+'?access_token=' + this.$store.getters.token
        }
      },
      handleUploadRemove(file, fileList, column,removeAttachmentFunc){
        if(removeAttachmentFunc){
          removeAttachmentFunc([this.form.data[column]]).then(res => {

          }).catch(()=>{
            fileList.push(file)
          })
        } else {
          removeSysAttachmentsDetailsMore([this.form.data[column]]).then(res => {

          }).catch(()=>{
            fileList.push(file)
          })
        }

      },

      handleExceed (files, fileList) {
          debugger
        this.$message.warning('超过上传限制数量，请先删除列表中的文件，再尝试上传')
      },
      handleFormDialog(buttonFunName,data){
        this.dialog.type = 'form'
        Object.assign(this.dialog,{
          visible: true,
          title: this.buttonList[buttonFunName].text,
          data: data,
          func: this.buttonList[buttonFunName].dialogFunc
        })
        //迭代获取上传文件
        for(let item in this.form.rules){
          if(this.form.rules[item][0].elementType ==='file'){
            if(data[item]){
                //清理上传列表
              this.$set(this.upload,item,[])
              if(this.form.rules[item][0].getAttachment){
                this.form.rules[item][0].getAttachment(data[item]).then(res => {
                  this.$set(this.upload,item,[{
                    name: res.attachmentName,
                    id: res.attachmentId
                  }])
                })
              } else {
                getAttachment(data[item]).then(res => {
                  this.$set(this.upload,item,[{
                    name: res.attachmentName,
                    id: res.attachmentId
                  }])
                })
              }
            } else {
              this.$set(this.upload,item,[])
            }
          }
          if(this.form.rules[item][0].elementType ==='image'){
              //清理上传列表
              this.$set(this.upload,item,[])
              if(data[item]){
                  if(this.imageList[data[item]]){
                      this.$set(this.upload,item,[this.imageList[data[item]]])
                  } else {
                      this.$set(this.imageList,data[item],'')
                      if(this.form.rules[item][0].getAttachment){
                          this.form.rules[item][0].getAttachment(data[item]).then(res => {
                              this.$set(this.imageList,data[item],{
                                  name: res.attachmentName,
                                  id: res.attachmentId,
                                  url: 'data:image/jpg;base64,' + res.attachment
                              })
                              this.$set(this.upload,item,[{
                                  name: res.attachmentName,
                                  id: res.attachmentId,
                                  url: 'data:image/jpg;base64,' + res.attachment
                              }])
                          })
                      } else {
                          getAttachment(data[item]).then(res => {
                              this.$set(this.imageList,data[item],{
                                  name: res.attachmentName,
                                  id: res.attachmentId,
                                  url: 'data:image/jpg;base64,' + res.attachment
                              })
                              this.$set(this.upload,item,[{
                                  name: res.attachmentName,
                                  id: res.attachmentId,
                                  url: 'data:image/jpg;base64,' + res.attachment
                              }])
                          })
                      }
                  }
              } else {
                this.$set(this.upload,item,[])
              }
          }
        }
      },
      handleRelaDialog(buttonFunName,data){
          this.dialog.type = 'rela'
          this.dialog.relaId = buttonFunName
          Object.assign(this.dialog,{
              visible: true,
              title: this.buttonList[buttonFunName].text,
              data: data,
              func: this.buttonList[buttonFunName].dialogFunc
          })

      }
    }
  }
</script>
<style >
  .el-dialog__body{
    padding: 0px;
  }
</style>
