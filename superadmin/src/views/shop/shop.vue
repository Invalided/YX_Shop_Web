<template>
  <div class="container">
    <div class="title">商铺内容列表</div>
    <!--  此处配置的v-permission权限必须与后端接口中声明的权限名称一致 此配置方式可使按钮不可见 -->
    <div class="add-button">
      <!-- <el-button type="primary" @click="handleAdd()">添加内容</el-button> -->
    </div>
    <div class="table-container">
      <el-table :data="shopList" border>
        <el-table-column label="序号" width="60" type="index" />
        <el-table-column
          label="商铺Id"
          width="60"
          prop="shopId"
          v-if="false"
        />
        <el-table-column label="商铺名称" prop="shopName" />
        <el-table-column label="商铺描述" prop="shopDesc" />
        <el-table-column label="商铺地址" prop="shopAddr" />
        <el-table-column label="类别Id" prop="categoryId">
          <template slot-scope="scope">
            {{scope.row.shopCategory.shopCategoryId}}
          </template>
        </el-table-column>
        <el-table-column label="电话" prop="phone"/>
        <el-table-column label="优先级" prop="priority" width="80" />
        <el-table-column label="建议" prop="advice"/>
        <el-table-column label="创建时间" prop="createTime" width="120">
          <template slot-scope="scope">
            {{ getDate(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="修改时间" prop="lastEditTime" width="120">
          <template slot-scope="scope">
            {{ getDate(scope.row.lastEditTime) }}
          </template>
        </el-table-column>
        <el-table-column label="商铺状态" prop="enableStatus" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.enableStatus === 1" type="success"
              >启用</el-tag
            >
            <el-tag v-else type="info">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="180">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" @click="handleDelete(scope.row)" disabled>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--    对话框-->
    <el-dialog
      :title="dialogTitle"
      width="800px"
      :visible.sync="showDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="resetForm"
    >
      <el-form
        ref="form"
        :model="temp"
        label-width="90px"
        :rules="rules"
        hide-required-asterisk
      >
        <el-form-item label="商铺名称" prop="shopName">
          <el-col :span="11">
            <el-input v-model="temp.shopName"></el-input>
          </el-col>
        </el-form-item>
        <!-- <el-form-item label="商铺类别">
          <el-select v-model="value" placeholder="请选择" @change="selectChange" prop="parentShopId">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item> -->
        <!-- <el-form-item
          label="商铺图片"
          prop="shopImage"
          ref="uploadElement"
        >
          <el-upload
            action="#"
            ref="upload"
            list-type="picture-card"
            :before-upload="beforeUpload"
            :on-remove="handleRemove"
            :auto-upload="false"
            :multiple="false"
            :on-change="handleChange"
          >
            <i class="el-icon-plus"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item> -->
        <el-form-item label="优先级" prop="priority">
          <el-col :span="11">
            <el-input
              v-model="temp.priority"
              oninput="value=value.replace(/[^\d]/g,'')"
              placeholder="请输入数字，最多5位"
              maxlength="5"
            >
            </el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="建议" prop="advice">
          <el-col :span="11">
            <el-input
              type="textarea"
              v-model="temp.advice"
              :rows=2
              placeholder="请输入内容"
            >
            </el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="商铺状态" prop="enableStauts">
          <el-switch
            v-model="temp.enableStatus"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button
          type="primary"
          @click="dialogTitle === '添加内容' ? confirmAdd() : confirmEdit()"
          >保 存</el-button
        >
      </span>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="showDeleteDialog" width="400px">
      <span>确认删除内容?此操作不可撤销,请谨慎操作</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDeleteDialog = false">取 消</el-button>
        <el-button type="danger" @click="confirmDelete">删 除</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      shopList: [],
      dialogTitle: "",
      showDialog: false,
      temp: {
        shopCategory:{shopCategoryId:""},
        shopId: null,
        shopName: null,
        priority: null,
        enableStatus: null,
        advice: null,
      },
      fileList: [],
      isType: 0,
      isExit: false,
      param: "",
      options: [
        {
          value: "1",
          label: "二手市场",
        },
        {
          value: "2",
          label: "美容美发",
        },
        {
          value: "3",
          label: "美食饮品",
        },
        {
          value: "4",
          label: "休闲娱乐",
        },
        {
          value: "5",
          label: "培训教育",
        },
        {
          value: "6",
          label: "租赁市场",
        },{
          value: null,
          label: "一级列表",
        },
      ],
      //select v-model绑定
      value:"一级列表",
      rules: {
        shopName: [
          {
            required: true,
            message: "商铺名称不能为空",
            trigger: "blur",
          },
        ],
        shopDesc: [
          {
            required: true,
            message: "商铺描述不能为空",
            trigger: "blur",
          },
        ],
        shopImage: [
          {
            required: true,
            message: "商铺图片不能为空",
            trigger: "change",
          },
        ],
        priority: [
          {
            required: true,
            message: "优先级不能为空",
            trigger: "blur",
          },
        ],
        advice: [
          {
            required: true,
            message: "建议不能为空",
            trigger: "blur",
          },
        ],
      },
      showDeleteDialog: false,
    };
  },
  created() {
    this.getShopList();
  },
  methods: {
    //参考文档直接写出方法
    async getShopList() {
      // 向后台发送FormData格式数据 Vue 默认json
      this.shopData = this.req({
        url: "superadmin/listshops?enableStatus=ALL&page=1&rows=100",
        method: "POST",
      }).then(
        (res) => {
          // 后端返回的数据为JSON对象 无法直接使用 先将其转为字符串，再转为json
          //   let sources = JSON.parse(JSON.stringify(res.rows));
          //   let data = [];
          //   data.push({
          //     shopId: sources.shopId,
          //     shopName: sources.shopName,
          //     shopLink: sources.shopLink,
          //     shopImg: sources.shopImg,
          //     priority: sources.priority,
          //     enableStatus: sources.enableStatus,
          //     createTime: sources.createTime,
          //     lastEditTime: sources.lastEditTime,
          //   });
          //   this.headshopData = data;
          //   this.headshopData.push(obj);
          // 使用Object提供的assign函数可以将对应的对象进行转换
          //this.headshopData = Object.assign([],res.rows);
          this.shopList = res.rows;
          console.log(this.shopList);
        },
        (err) => {
          console.log("err: ", err);
          this.$message.success(err);
        }
      );
    },
    getDate(date) {
      let time = new Date(date);
      return (
        time.getFullYear() +
        "-" +
        (time.getMonth() + 1) +
        "-" +
        time.getDate() +
        " " +
        time.getHours() +
        ":" +
        time.getMinutes() +
        ":" +
        time.getSeconds()
      );
    },
    selectChange(e){
      //赋值操作
      this.temp.parent.shopId = e;
      console.log(this.temp.parent);
      console.log("e",e)
    },
    handleAdd() {
      this.dialogTitle = "添加内容";
      this.showDialog = true;
    },
    handleEdit(row) {
      //渲染表单
      this.dialogTitle = "编辑内容";
      this.showDialog = true;
      //等待form mount完之后再初始化数据 resetFields()才可以起作用
      this.$nextTick(()=>{
        //初始化表单数据
      this.temp.shopCategory.shopCategoryId = row.shopCategory.shopCategoryId;
      this.temp.shopId = row.shopId;
      this.temp.shopName = row.shopName;
      this.temp.priority = row.priority;
      this.temp.advice = row.advice;

      //获取select 的 label的值 
      // let obj = this.options.find((item)=>{
      //   return item.value == row.parent.shopId;
      // })
      //赋值改变options的选项
      // this.value = obj.label;
      this.temp.enableStatus = row.enableStatus;
      
      //图片默认为空,可不选择
      })
    },
    handleDelete(row) {
      this.showDeleteDialog = true;
      // 删除所需的字段 id,type
      this.temp.shopId = row.shopId;
      //this.temp.type = row.type;
    },
    handleChange(file) {
      if (file) {
        this.isExit = true;
        console.log("change");
        this.$refs.uploadElement.clearValidate();
      }
    },
    //单个图片上传
    beforeUpload(file) {
      //初始化参数
      this.param = new FormData();
      if (this.isType == 0) {
        this.param.append("shopManagementAdd_shopImg", file);
        console.log("0");
      } else {
        this.param.append("shopManagementEdit_shopImg", file);
        console.log("1");
      }

      //多个图片上传
      //this.fileList.push(file);
      /**
       * [...this.fileList] 数组拷贝
       * var a = [1,2,3];
       * var b = [...a];
       * b.push(4);
       * [1,2,3,4]
       */
      // let images = [...this.fileList];
      // console.log("images", images);
      // images.forEach((img, index) => {
      //   this.param.append(`img_${index}`, img); // 把单个图片重命名，存储起来（给后台）
      // });
      return false;
    },
    /**
     * 确认添加
     * @returns {Prom ise<void>}
     */
    async confirmAdd() {
      /**
       * 判断图片文件是否存在 使用isExit标识
       * 添加/取消验证
       */
      if (this.isExit) {
        console.log("image", this.isExit);
        this.rules.shopImage[0].validator = (rule, value, callback) => {
          callback();
          //调用提交图片的beforeUpload方法
          this.$refs.upload.submit();
        };
      } else {
        //添加验证
        this.rules.shopImage[0].validator = (rule, value, callback) => {
          callback(rule, value);
        };
      }
      console.log("temp",JSON.stringify(this.temp));
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          //使用param参数向后台传输数据
          //delete this.temp.id
          this.param.append("shopStr", JSON.stringify(this.temp));
          this.req({
            url: "superadmin/addshop",
            data: this.param,
            method: "POST",
          }).then(
            (res) => {
              this.getShopList();
              this.$message.success("添加成功");
            },
            (err) => {
              console.log("err: ", err);
            }
          );
          this.showDialog = false;
          this.$refs.form.resetFields();
        }
      });
    },
    /**
     * 确认修改
     * @returns {Promise<void>}
     */
    // async confirmEdit() {
    async confirmEdit() {
      //获取上传之后的图片对象 编辑时允许图片为空，默认为原图片，因此可不添加规则
      this.rules.shopImage[0].validator = (rule, value, callback) => {
        callback();
      };
      console.log(this.isExit);
      this.$refs.form.validate(async (valid) => {
        let temp = new FormData();
        if (valid) {
          //调用提交图片的beforeUpload方法,添加判断
          if (this.isExit) {
            this.$refs.upload.submit();
            this.param.append("shopStr", JSON.stringify(this.temp));
          } else {
            temp.append("shopManagementEdit_shopImg", "");
            temp.append("shopStr", JSON.stringify(this.temp));
            this.param = temp;
          }
          //使用param参数向后台传输数据
          //delete this.temp.id
          this.req({
            url: "superadmin/modifyshop",
            data: this.param,
            method: "POST",
          }).then(
            (res) => {
              this.getShopList();
              this.$message.success("修改成功");
            },
            (err) => {
              console.log("err: ", err);
            }
          );
          this.showDialog = false;
          this.$refs.form.resetFields();
        }
      });
    },
    /**
     * 确认删除
     */
    async confirmDelete() {
      //this.param = this.temp.id
      //使用param参数向后台传输数据
      //delete this.temp.id
      this.req({
        url:
          "superadmin/removeshop?shopId=" +
          this.temp.shopId,
        data: this.param,
        method: "POST",
      }).then(
        (res) => {
          this.showDeleteDialog = false;
          this.getShopList();
          this.$message.success("删除成功");
        },
        (err) => {
          console.log("err: ", err);
        }
      );
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.isExit = false;
      console.log("remove", this.isExit);
    },
    // 对话框关闭重置表单内容
    resetForm() {
      this.$refs.form.resetFields();
      this.isType = 0;
    },
  },
};
</script>
<style>
/*
  解决表头和内容无法对齐
 */
.el-tabe .has.gutter {
  display: table-cell !important;
}

/*
 修复textarea字体与input字体不一致
 */
textarea {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}

/**
 使全局的dialog 水平垂直居中
 */
.el-dialog {
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  /*height:600px;*/
  max-height: calc(100% - 30px);
  max-width: calc(100% - 30px);
}
.el-dialog .el-dialog__body {
  flex: 1;
  overflow: auto;
}
</style>
<style scoped lang="scss">
.container {
  .title {
    height: 59px;
    line-height: 59px;
    color: #3963bc;
    font-size: 16px;
    font-weight: 500;
    text-indent: 40px;
    border: 1px solid #dae1ec;
  }

  .add-button {
    padding: 20px 40px;
  }

  .table-container {
    padding: 0 40px 20px 40px;
  }
  img {
    width: 100px;
    height: 100px;
  }
}
</style>