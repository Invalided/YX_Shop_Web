# YX_Shop_Web
o2o校园商铺平台Web端，此项目为[YX_Shop](https://github.com/Invalided/YX_Shop)配套项目的前端部分。

## 配置说明

### o2o

o2o文件夹为前台页面，使用原生的HTML+CSS+JS以及SUI Moblie做UI美化， 导入IDE使用浏览器运行即可。如需要与后端交互，修改**js/common/loadpage.js**文件中的**VUE_APP_BASE_API**即可。

### superadmin

superadmin为后台管理员页面，使用Vue.js+ElementUI开发，参考了此开源项目[vue-admin-template](https://github.com/tuture-dev/vue-admin-template)，如需要与后端交互，修改**.env.developement**和.**env.production**文件中的即可。

#### 运行测试环境

```js
npm run dev
```

#### 打包

```js
npm run build:prod
```

### 跨域问题

由于前后端分离项目在运行后访问后端接口时会出现跨域问题，o2o可用Nginx解决，superadmin可用Nginx或其内置的Proxy代理解决。
