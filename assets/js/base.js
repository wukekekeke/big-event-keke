// 提交前的基本配置
$.ajaxPrefilter(function (options) {
     options.url='http://ajax.frontend.itheima.net'+options.url

     // headers
     if(options.url.indexOf('/my/')!==-1){
          // indexOf检索字符串第一次出现的位置，如果没有找到，会返回-1
          // 有 /my/ ==>  需要在请求头中携带 Authorization 身份认证字段
          options.headers={
               Authorization:localStorage.getItem('token')
           }
     }

     // 控制访问权限
     // 请求完成后执行的函数（成功或失败都会执行）
     options.complete=function (xhr) {
          //  形参会拿到xhr对象
          console.log(xhr)
          if(xhr.responseJSON.status===1&&xhr.responseJSON.message==='身份认证失败！'){
               // 清除token数据
               localStorage.removeItem('token')
               // 回到登录页面
               location.href='/home/login.html'
          }
               
     }
})