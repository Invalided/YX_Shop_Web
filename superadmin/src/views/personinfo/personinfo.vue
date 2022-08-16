<template>
  <div class="container">
    <div class="title">帐号内容列表</div>
    <div class="add-button">
      <!-- <el-button type="primary" @click="handleAdd()" >添加内容</el-button> -->
    </div>
    <div class="table-container">
      <el-table :data="userList" border>
        <el-table-column label="序号" width="60" type="index" />
        <el-table-column label="帐号Id" width="60" prop="userId" v-if="false" />
        <el-table-column label="用户名称" prop="name" />
        <!-- <el-table-column label="出生日期">
          <template slot-scope="scope">
            {{ getDate(scope.row.createTime) }}
          </template>
        </el-table-column> -->
        <!-- <el-table-column label="帐号图片" prop="userImg"/> -->
        <el-table-column label="性别" prop="gender" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.gender == 1" type="info">男</el-tag>
            <el-tag v-else type="info">女</el-tag>
          </template>
        </el-table-column>

        <!-- <el-table-column label="性别" prop="gender" /> -->
        <!-- <el-table-column label="联系方式" prop="gender" /> -->
        <el-table-column label="电子邮箱" prop="email" width="350"/>
        <!-- <el-table-column label="用户头像" width="120">
          <template slot-scope="scope">
            <img :src="scope.row.profileImg" />
          </template>
        </el-table-column> -->
        <el-table-column label="用户类型" width="120">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.userType === 1" type="info"> 顾客 </el-tag>
            <el-tag v-if="scope.row.userType === 2" type="info"> 商家 </el-tag>
            <el-tag v-if="scope.row.userType === 3" type="info"> 管理员 </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="用户类型" prop="userType" width="80" />
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
        <el-table-column label="帐号状态" prop="enableStatus" width="100">
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
    <!--   添加对话框-->
    <el-dialog
      :title="dialogTitle"
      width="800px"
      :visible.sync="showAdd"
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
        <el-form-item label="用户名称" prop="name">
          <el-col :span="11">
            <el-input v-model="temp.name"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-col :span="11">
            <el-input v-model="temp.gender"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="电子邮箱" prop="email">
          <el-col :span="11">
            <el-input v-model="temp.email"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="用户头像" prop="profileImg" ref="uploadElement">
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
        </el-form-item>
        <el-form-item label="帐号状态" prop="enableStauts">
          <el-switch
            v-model="temp.enableStatus"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showAdd = false">取 消</el-button>
        <el-button type="primary" @click="confirmAdd()">保 存</el-button>
      </span>
    </el-dialog>

    <!-- 编辑对话框-->
    <el-dialog
      :title="dialogTitle"
      width="800px"
      :visible.sync="showEdit"
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
        <el-form-item label="用户名称" prop="name">
          <el-col :span="11">
            <el-input v-model="temp.name" disabled></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="帐号状态" prop="enableStauts">
          <el-switch
            v-model="temp.enableStatus"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showEdit = false">取 消</el-button>
        <el-button type="primary" @click="confirmEdit()">保 存</el-button>
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
      userList: [],
      dialogTitle: "",
      showAdd: false,
      showEdit: false,
      temp: {
        userId: null,
        name: null,
        gender: null,
        priority: null,
      },
      fileList: [],
      isType: 0,
      isExit: false,
      param: "",
      //select v-model绑定
      value: "一级列表",
      rules: {
        name: [
          {
            required: true,
            message: "帐号名称不能为空",
            trigger: "blur",
          },
        ],
        gender: [
          {
            required: true,
            message: "性别不能为空",
            trigger: "blur",
          },
        ],
        profileImg: [
          {
            required: true,
            message: "用户头像不能为空",
            trigger: "change",
          },
        ],
        email: [
          {
            required: true,
            type: "email",
            message: "邮箱不能为空",
            trigger: "change",
          },
        ],
        priority: [
          {
            required: true,
            message: "用户类型不能为空",
            trigger: "blur",
          },
        ],
        createTime: [
          {
            required: true,
            message: "创建时间不能为空",
            trigger: "blur",
          },
        ],
        lastEditTime: [
          {
            required: true,
            message: "修改时间不能为空",
            trigger: "blur",
          },
        ],
      },
      showDeleteDialog: false,
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    //参考文档直接写出方法
    async getUserList() {
      // 向后台发送FormData格式数据 Vue 默认json
      this.userData = this.req({
        url: "superadmin/listpersonInfos?enableStatus=ALL&page=1&rows=100",
        method: "POST",
      }).then(
        (res) => {
          this.userList = res.rows;
          console.log(this.userList);
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
    selectChange(e) {
      //赋值操作
      this.temp.parent.userId = e;
      console.log(this.temp.parent);
      console.log("e", e);
    },
    handleAdd() {
      this.dialogTitle = "添加内容";
      this.showAdd = true;
    },
    handleEdit(row) {
      //渲染表单
      this.dialogTitle = "编辑内容";
      this.showEdit = true;

      //等待form mount完之后再初始化数据 resetFields()才可以起作用
      this.$nextTick(() => {
        //初始化表单数据
        this.temp.userId = row.userId;
        this.temp.name = row.name;
        //获取select 的 label的值
        // let obj = this.options.find((item)=>{
        //   return item.value == row.parent.userId;
        // })
        // //赋值改变options的选项
        // this.value = obj.label;
        this.temp.enableStatus = row.enableStatus;
        //图片默认为空,可不选择
      });
    },
    handleDelete(row) {
      this.showDeleteDialog = true;
      // 删除所需的字段 id,type
      this.temp.userId = row.userId;
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
        this.param.append("userManagementAdd_userImg", file);
        console.log("0");
      } else {
        this.param.append("userManagementEdit_userImg", file);
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
        this.rules.profileImg[0].validator = (rule, value, callback) => {
          callback();
          //调用提交图片的beforeUpload方法
          this.$refs.upload.submit();
        };
      } else {
        //添加验证
        this.rules.profileImg[0].validator = (rule, value, callback) => {
          callback(rule, value);
        };
      }
      console.log("temp", JSON.stringify(this.temp));
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          //使用param参数向后台传输数据
          //delete this.temp.id
          this.param.append("userStr", JSON.stringify(this.temp));
          this.req({
            url: "superadmin/adduser",
            data: this.param,
            method: "POST",
          }).then(
            (res) => {
              this.getUserList();
              this.$message.success("添加成功");
            },
            (err) => {
              console.log("err: ", err);
            }
          );
          this.showAdd = false;
          this.$refs.form.resetFields();
        }
      });
    },
    /**
     * 确认修改
     * @returns {Promise<void>}
     */
    async confirmEdit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          //使用param参数向后台传输数据
          //delete this.temp.id
          this.param = new FormData();
          this.param.append("userId", this.temp.userId);
          this.param.append("enableStatus", this.temp.enableStatus);
          this.req({
            url: "superadmin/modifypersonInfo",
            data: this.param,
            method: "POST",
          }).then(
            (res) => {
              this.getUserList();
              this.$message.success("修改成功");
            },
            (err) => {
              console.log("err: ", err);
            }
          );
          this.showEdit = false;
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
        url: "superadmin/removeuser?userId=" + this.temp.userId,
        data: this.param,
        method: "POST",
      }).then(
        (res) => {
          this.showDeleteDialog = false;
          this.getUserList();
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