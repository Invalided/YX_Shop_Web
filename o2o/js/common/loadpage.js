// 后端服务器地址/Nginx地址
var serverUrl = "http://localhost:8899";


// 公共底部tab栏
$(function(){
	$("#bartab").load("../../html/common/foot.html");
});

// 当前的项目名称
function getPath(){
	var pathName = document.location.pathname;
	var index = pathName.substr(1).indexOf("/");
	var curPath = pathName.substr(0, index + 1);
	return curPath;
}



