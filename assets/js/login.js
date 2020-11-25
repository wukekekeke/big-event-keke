$(function () {
    // 切换注册和登录
    $('#gotoRegi').click(function () {
         $('.loginBox').hide()
         $('.regiBox').show()
    })

    $('#gotoLogin').click(function () {
         $('.regiBox').hide()
         $('.loginBox').show()
    })

    // 需要先layui中获取到功能
    let form=layui.form
    let layer = layui.layer
    // 表单校验
    form.verify({
        //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
        pass: [
          /^[\S]{6,12}$/
          ,'密码必须6到12位，且不能出现空格'
        ] ,
        // 再次确认密码的校验——》用到自定义函数
        repass: function(value, item){ //value：表单的值、item：表单的DOM对象
            let pwd=$('.regiBox input[name=password]').val()
            console.log(pwd)
            if(value!==pwd){
              return '两次输入的密码不一致';
            }
          }
      });  

    // 发送注册请求
    $('#regiForm').submit(function (e) {
         e.preventDefault()

        let data=$(this).serialize()

        //发送请求
        $.ajax({
            url:'/api/reguser',
            type:'POST',
            data,
            success:function (res) {
                // console.log(res)
                if(res.status!==0){
                    return layer.msg('注册失败'+res.message)
                    
                }
                // 跳转到登录框
                $('#gotoLogin').click()
            }
        })
    })

    // 发送登录请求
    $('#loginForm').submit(function (e) {
       e.preventDefault()

       let data=$(this).serialize()

       $.ajax({
         url:'/api/login',
         type:'POST',
         data,
         success:function (res) {
            console.log(res)
            if(res.status===1){
              return layer.msg('登录失败')
            }
            // 拿到token的身份认证储存起来
            localStorage.setItem('token',res.token)
            // 提示框
            layer.msg('登录成功，即将跳转到页面',
            {time:2},//设置延时时间
            function () {
              // 跳转页面
              location.href='/home/index.html'
            }
            )
         }
       })
    })
    
})