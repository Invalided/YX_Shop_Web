$(function() {
	let curPath = getPath();
	console.log(curPath);
	userinfo = JSON.parse(localStorage.getItem("userinfo"));
	if (userinfo == null || userinfo == undefined) {
		$.toast('未登录');
		window.location.href = curPath + '/html/local/login.html';
	}
});
