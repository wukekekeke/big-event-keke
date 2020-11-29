function hello() {
    console.log('hello');
}
var a = 10

$(function () {

    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')

    // 1.2 配置选项
        const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    $.ajax({
        url:'/my/userinfo',
        success:function (res) {
            console.log(res)
            if(res.status!==0){
                return layer.msg('获取用户信息失败')
            }
            
            $image
            .cropper("destroy") // 销毁旧的裁剪区域
            .attr("src", res.data.user_pic) // 重新设置图片路径
            .cropper(options); // 重新初始化裁剪区域
            //获取用户信息成功==>快速给表单赋值
            // form.val('filter', object);
            // class="layui-form" 所在元素属性 lay-filter="" 对应的值
            // form.val('userForm',res.data)
        }
    })
     

    

    // 更换头像，文件域的change事件
    $('#file').change(function () {
        // files属性是文件域的DOM对象的属性，记录选中的文件
         let file=this.files[0]
        //  console.log(file)

        // 把选择的文件得到他对应url地址
         let newImgURL = URL.createObjectURL(file);
     
        // 利用cropper插件的方法
        $image
            .cropper("destroy") // 销毁旧的裁剪区域
            .attr("src", newImgURL) // 重新设置图片路径
            .cropper(options); // 重新初始化裁剪区域
    })


    // 上传头像==》点击上传按钮，模拟点击文件域
    $('#uploadBtn').click(function () {
         $('#file').click()
    })

    //确认更换头像
    let layer=layui.layer
    $('#sureBtn').click(function () {
        // 利用cropper插件的方法
        // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        let dataURL = $image
        .cropper("getCroppedCanvas", {
            // 创建一个 Canvas 画布
            width: 100,
            height: 100,
        })
        .toDataURL("image/png"); 

        $.ajax({
            url:'/my/update/avatar',
            type:'POST',
            data: {
                avatar: dataURL,
            },
            success:function (res) {
                //   console.log(res)
                if(res.status!==0){
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                // 调用父页面（index）的函数，从而更新导航和侧边栏的头像
                window.parent.getUserInfo()
                // 更换替换的图片样张
                // $(`#image`).attr('src',dataURL)
            }
         })
    })


})