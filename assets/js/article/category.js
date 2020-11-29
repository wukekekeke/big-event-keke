$(function () {
    
    let layer=layui.layer
    let form=layui.form
    
    getCates()
    // 获取文章类别==》会复用，封装起来
    function getCates() {
        
        $.ajax({
            url:'/my/article/cates',
            success:function (res) {
                //  console.log(res)
                
                let htmlStr=template('tbody',res)
                $('tbody').html(htmlStr)
            }
        })
    }
    
    // 存编辑的弹出层的索引
    let indexAdd
    // 添加类别
    $('#add').click(function () {
        // 弹出层
        indexAdd=layer.open({
            type: 1, 
            title:'添加文章分类',
            area: '500px',//设置宽度，高度自适应
            content: $('#addlayer').html()
            //因为内容是一个表单，会有很长的html结构，所以作为模板，放在html中
          });

        // 确认添加
        // 注意是动态创建的，需要事件委托
        $('body').on('submit','#addForm',function (e) {
             e.preventDefault()

            //  发请求，获取文章分类列表
            let data=$(this).serialize()
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
                    //  新增到列表中,重新调用获取文章类别的函数
                    getCates()
                }
            })
            // 自动关闭弹框
            layer.close(indexAdd);
        })
    })

    // 编辑
    let editIndex; // editIndex存编辑的弹出层的索引
    $('body').on('click','.editBtn',function () {
        //  弹出层
        editIndex=layer.open({
            type: 1, 
            title:'修改文章分类',
            area: '500px',
            content: $('#editlayer').html()
          });
        // 编辑中需要有原数据——》发请求，根据 Id 获取文章分类数据
        // 拿到获取文章分类列表时，存在.editBtn上的自定义属性
        let id=$(this).attr('data-id')
        console.log(id)
          $.ajax({
            //   url:'/my/article/cates/:id'
            url:'/my/article/cates/'+id,
            success:function (res) {
                //  console.log(res)
                 if(res.status!==0){
                    return layer.msg('获取文章分类数据失败')
                 }
                //  快速给表单赋值
                //  editlayer==》 class="layui-form" 所在元素属性 lay-filter="" 对应的值
                form.val("editlayer", res.data)
            }
          })
    })

    // 编辑弹框中的确认修改按钮
    $('body').on('submit','#editForm',function (e) {
         e.preventDefault()

        //  发送请求，根据 Id 更新文章分类数据
        // 拿到form的数据
        let data=$(this).serialize()
        $.ajax({
            url:'/my/article/updatecate',
            type:'POST',
            data,
            success:function (res) {
                 console.log(res)
                 if(res.status!==0){
                     layer.msg('更新分类信息失败')
                 }
                 layer.msg('更新分类信息成功')

                // 重新获取文章分类
                getCates()
            }
        })
        // 关闭弹出层
        layer.close(editIndex)
    })

    // 删除
    $('body').on('click','.delBtn',function () {
        //  确认删除的弹框
        // 在.delBtn上拿自定义属性data-id
        let id=$(this).attr('data-id')
        // console.log(id)
        layer.confirm('是否确认删除?', {icon: 3, title:'提示'}, function(index){
            //do something
            // 发请求，根据 Id 删除文章分类
            $.ajax({
                // url:'/my/article/deletecate/:id'
                url:'/my/article/deletecate/'+id,
                success:function (res) {
                     console.log(res)
                     if(res.status!==0){
                         return layer.msg(res.message)
                     }
                     layer.msg(res.message)
                    //  重新获取
                    getCates()
                }
            })

            layer.close(index);
          });
    })
})