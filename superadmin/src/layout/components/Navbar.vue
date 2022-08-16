<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />
    <div class="right-menu">
      <el-button @click="logout">退出登录</el-button>
    </div>
    
    <div class="title_right">
    <div class="user_info">
      <span>{{username}}</span>
    </div>
    
     <el-avatar
         class="md_headpic"
         :size="46"
         src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
         @error="errorHandler">
         <img :src="null" />
     </el-avatar>
     
  </div>


  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  data(){
    return {
      username:''
    }
  },
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ]),

  },
  created(){
    console.log('root value')
    let name = localStorage.getItem('username');
    if(name != null){
      this.username = name;
    }

  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      localStorage.removeItem('hasLogin')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    errorHandler(){

    },
    async showname(){
      return 'rooot'
    }
  }
}
</script>

<style lang="scss" scoped>
/**
  用户头像实现
*/

.title_right {
  line-height: 50px;
}
.md_headpic {
  border: none;
  vertical-align: middle;
  margin:2px 20px 2px 0px;
  float: right;
}
/**
  用户信息
 */
.user_info{
  float: right;
  margin-right: 20px;
  margin-top: 2px;
  font-size: 16px;
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  //line-height: 100%;
}


.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background:#fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    margin-right: 20px;
    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
