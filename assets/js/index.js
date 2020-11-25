$(function () {
    //  获取用户的基本信息
    let layer=layui.layer
    $.ajax({
        url:'/my/userinfo',
        // 放到base.js中
        // headers:{
        //     Authorization:localStorage.getItem('token')
        // },
        success:function (res) {
             console.log(res);
             if(res.status===1){
                 return layer.msg("获取用户基本信息失败！")
             }

            // 1 先处理名字（优先展示昵称，其次在是用户名）
            let name=res.data.nickname||res.data.username
            // 第一个大写字母
            let first=name[0].toUpperCase()
            // 左侧导航栏欢迎
            $('#welcome').text('欢迎'+name)

            // 2 再处理头像
            if(res.data.user_pic){
            // 如果用户设置了头像，就用图片
                $('.layui-nav-img').attr('src','res.data.user_pic').show()
                $('.text-avatar').hide()
            }else{
            // 如果用户没有设置头像，就显示大写字母
                $('.layui-nav-img').hide()
                $('.text-avatar').text(first).show()
            }
        }
        
    })

    // 退出
    $('#logoutBtn').click(function (e) {
        // e.stopPropagation()
        console.log(1)
        layer.confirm('确认退出?', {icon: 3, title:'提示'}, function(index){
            // 该函数会在点击确认的时候执行
            // 1 清除token数据
            localStorage.removeItem('token')
            // 2 跳转到登录页面
            location.href='/home/login.html'
            // 关闭当前询问框
            layer.close(index);
          }          
        );
    })

    // 控制访问权限
    // 退出之后，直接输入index路径，无法进入页面

})