$(function() {
	let curPath = getPath();
	console.log("curPath"+curPath);
	$('#log-out').click(function() {
		// 清除session
		$.ajax({
			url : "/o2o/local/logout",
			type : "post",
			async : false,
			cache : false,
			dataType : 'json',
			success : function(data) {
				if (data.success) {
					var usertype = $("#log-out").attr("usertype");
					// 清除成功后退出到登录界面
					window.location.href = curPath+"/local/login?usertype=" + usertype;
					return false;
				}
			},
			error : function(data, error) {
				alert(error);
			}
		});
	});
});