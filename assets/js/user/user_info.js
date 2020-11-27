$(function () {
    let layer=layui.layer
    let form=layui.form
    
    // 一开始就填充效果
    getInfo()
    // 获取用户的信息
    function getInfo() {         
        $.ajax({
            url:'/my/userinfo',
            success:function (res) {
                console.log(res)
                if(res.status!==0){
                    return layer.msg('获取用户信息失败')
                }
                //获取用户信息成功==>快速给表单赋值
                // form.val('filter', object);
                // class="layui-form" 所在元素属性 lay-filter="" 对应的值
                form.val('userForm',res.data)
            }
        })
    }

    //重置
    $('#resetBtn').click(function (e) {
        // 阻止重置按钮的默认清空方法
        e.preventDefault()
        // 重新获取信息并快速填充
        getInfo()
    })

    // 提交修改
    // 注册表单提交事件
    $('form').submit(function (e) {
         e.preventDefault()
        // 获取表单信息
        let data = $(this).serialize();
         $.ajax({
             url:'/my/userinfo',
             type:'POST',
             data,
             success:function(res){
                 if(res.status!==0){
                     return layer.msg('提交信息失败')
                 }
                 layer.msg('提交信息成功')
                //  调用父页面的getUserInfo函数
                window.parent.getUserInfo();
             }
         })
    })

    // 校验用户的昵称长度
    form.verify({
        nickname: function(value, item){ //value：表单的值、item：表单的DOM对象
          if(value.length<6){
            return '用户名长度不能小于6个字符';
          }
        }
      });      
})