<template>
  <div class="container">
    <div class="title">区域内容列表</div>
    <div class="add-button">
      <!--  此处配置的v-permission权限必须与后端接口中声明的权限名称一致 此配置方式可使按钮不可见 -->
      <el-button type="primary" @click="handleAdd()">添加内容</el-button>
    </div>
    <div class="table-container">
      <el-table :data="areaList" border>
        <el-table-column label="序号" width="60" type="index" />
        <el-table-column label="区域Id" width="60" prop="areaId" v-if="false" />
        <el-table-column label="区域名称" prop="areaName" />
        <el-table-column label="优先级" prop="priority" width="80" />
        <el-table-column label="发布时间" prop="createTime" width="300">
          <template slot-scope="scope">
            {{ getDate(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="修改时间" prop="lastEditTime" width="300">
          <template slot-scope="scope">
            {{ getDate(scope.row.lastEditTime) }}
          </template>
        </el-table-column>
        <!-- <el-table-column label="区域状态" prop="enableStatus" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.enableStatus === 1" type="success"
              >有效</el-tag
            >
            <el-tag v-else type="info">无效</el-tag>
          </template>
        </el-table-column> -->
        <el-table-column label="操作" fixed="right" width="240">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" @click="handleDelete(scope.row)" v-bind:disabled = "scope.row.areaId<3">
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
        <el-form-item label="区域名称" prop="areaName">
          <el-col :span="11">
            <el-input v-model="temp.areaName"></el-input>
          </el-col>
        </el-form-item>
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
      areaList: [],
      dialogTitle: "",
      showDialog: false,
      temp: {
        areaId: "",
        areaName: "",
        priority: "",
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
        },
        {
          value: null,
          label: "一级列表",
        },
      ],
      //select v-model绑定
      value: "一级列表",
      rules: {
        areaName: [
          {
            required: true,
            message: "区域名称不能为空",
            trigger: "blur",
          },
        ],
        areaDesc: [
          {
            required: true,
            message: "区域描述不能为空",
            trigger: "blur",
          },
        ],
        areaImage: [
          {
            required: true,
            message: "区域图片不能为空",
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
    this.getAreaList();
  },
  methods: {
    //参考文档直接写出方法
    async getAreaList() {
      // 向后台发送FormData格式数据 Vue 默认json
      this.areaData = this.req({
        url: "superadmin/listarea",
        method: "GET",
      }).then(
        (res) => {
          this.areaList = res.rows;
          console.log(this.areaList);
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
      this.temp.parent.areaId = e;
      console.log(this.temp.parent);
      console.log("e", e);
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
      this.$nextTick(() => {
        //初始化表单数据
        this.temp.areaId = row.areaId;
        this.temp.areaName = row.areaName;
        this.temp.priority = row.priority;
      });
    },
    handleDelete(row) {
      this.showDeleteDialog = true;
      //赋值操作
      this.temp.areaId = row.areaId;
      //this.temp.type = row.type;
    },
    /**
     * 确认添加
     * @returns {Prom ise<void>}
     */
    async confirmAdd() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          //使用param参数向后台传输数据
          //delete this.temp.id
          this.param = new FormData();
          this.param.append("areaStr", JSON.stringify(this.temp));
          this.req({
            url: "superadmin/addarea",
            data: this.param,
            method: "POST",
          }).then(
            (res) => {
              this.getAreaList();
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
      this.$refs.form.validate(async (valid) => {
        let temp = new FormData();
        if (valid) {
          //调用提交图片的beforeUpload方法,添加判断
          this.param = new FormData();
          this.param.append("areaStr", JSON.stringify(this.temp));
          //使用param参数向后台传输数据
          //delete this.temp.id
          this.req({
            url: "superadmin/modifyarea",
            data: this.param,
            method: "POST",
          }).then(
            (res) => {
              this.getAreaList();
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
        url: "superadmin/removearea?areaId=" + this.temp.areaId,
        data: this.param,
        method: "POST",
      }).then(
        (res) => {
          this.showDeleteDialog = false;
          this.getAreaList();
          this.$message.success("删除成功");
        },
        (err) => {
          console.log("err: ", err);
        }
      );
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