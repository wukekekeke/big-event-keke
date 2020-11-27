$(function () {
    let form=layui.form
    let layer=layui.layer
    //  表单校验
    form.verify({
        pass: [
          /^[\S]{6,12}$/
          ,'密码必须6到12位，且不能出现空格'
        ],
        //  原密码和新密码是否一致
        newPwd: function(value, item){ //value：表单的值、item：表单的DOM对象
            let oldPwd=$('[name=oldPwd]').val()
            if(value===oldPwd){
              return '新密码不能和原密码一样';
            }
          },
        //判断再次输入的密码是否一致
        samePwd:function (value) {
             let newPwd=$('[name=newPwd]').val()
             if(value!==newPwd){
                 return '两次输入的密码不一样'
             }
        }
      });  
      
    //  提交——》发送请求
    $('form').submit(function (e) {
         e.preventDefault()

         let data=$(this).serialize()

         $.ajax({
             url:'/my/updatepwd',
             type:'POST',
             data,
             success:function (res) {
                //   console.log(res)
                if(res.status!==0){
                    return layer.msg('重置密码失败'+res.message)
                }
                layer.msg('重置密码成功')
                //清空表单内容
                // 注意：是DOM对象的方法
                $('form')[0].reset()
             }
         })
    })
})