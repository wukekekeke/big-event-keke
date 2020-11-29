$(function () {

    let layer=layui.layer
    let form=layui.form

    getCates()
    //  封装函数——》获取文章分类列表
    function getCates() {
         $.ajax({
             url:'/my/article/cates',
             success:function (res) {
                //   console.log(res)
                  if(res.status!==0){
                      return layer.msg('获取文章分类列表失败')
                  }
                //   结合模板引擎渲染
                let htmlStr=template('list',res)
                $('tbody').html(htmlStr)
             }
         })
    }

    let addIndex
    // 添加类别
    $('#addBtn').click(function () {
        //  弹出层
        addIndex=layer.open({
            type: 1, 
            title :'添加文章类别',
            area: '500px',//宽为500px，高度自适应
            content: $('#addList').html()//内容通过模板渲染
          });
        })
        
    //   确认添加
    $('body').on('submit','#addForm',function (e) {
         e.preventDefault()
         let data=$(this).serialize()
        //  console.log(data)
        //  发请求，新增文章分类
        $.ajax({
            url:'/my/article/addcates',
            type:'POST',
            data,
            success:function (res) {
                //  console.log(res)
                if(res.status!==0){
                    return layer.msg('新增文章分类失败')
                }
                layer.msg('新增文章分类成功')
                // 重新获取文章列表
                getCates()
            }
        })
        // 关闭弹出层
        layer.close(addIndex)
    })

    // 编辑
    let editIndex
    $('body').on('click','.editBtn',function () {
        editIndex=layer.open({
            type: 1, 
            title :'修改文章类别',
            area: '500px',//宽为500px，高度自适应
            content: $('#editList').html()//内容通过模板渲染
          });

        // 让编辑的弹出框中有内容显示——》发请求，根据 Id 获取文章分类数据
        // 通过editBtn上的自定义属性拿到id
        let id=$(this).attr('data-id')
        // console.log(id)
        $.ajax({
            // url:'/my/article/cates/:id'
            url:'/my/article/cates/'+id,
            success:function (res) {
                 console.log(res)
                 if(res.status!==0){
                     return layer.msg('获取文章分类数据失败')
                 }
                //  快速填充赋值
                // formTest 即 class="layui-form" 所在元素属性 lay-filter="" 对应的值
                form.val("editForm",res.data);
            }
        })
    })

    // 确认修改
    $('body').on('submit','#editForm',function (e) {
         e.preventDefault()

         let data=$(this).serialize()
        //  发请求，根据 Id 更新文章分类数据
        $.ajax({
            url:'/my/article/updatecate',
            type:'POST',
            data,
            success:function (res) {
                 console.log(res)
                 if(res.status!==0){
                     return layer.msg('更新分类信息失败')
                 }
                 layer.msg('更新分类信息成功')
                //  重新获取数据列表
                 getCates()
            }
        })
        // 关闭弹窗
        layer.close(editIndex)
    })

    // 删除
    $('body').on('click','.delBtn',function () {

        let id=$(this).attr('data-id')
        //  发请求，根据 Id 删除文章分类
        $.ajax({
            // url:'/my/article/deletecate/:id'
            url:'/my/article/deletecate/'+id,
            success:function (res) {
                //  console.log(res)
                 if(res.status!==0){
                     return layer.msg(res.message)
                 }
                 layer.msg(res.message)
                //  重新获取列表
                getCates()
            }
        })
    })
})