$(function () {
  // 初始化富文本编辑器
  // initEditor();

  // cropper
  // 1. 初始化图片裁剪器
  var $image = $("#image");

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: ".img-preview",
  };

  //   储存发布状态
  let state = "";

  let layer = layui.layer;
  let form = layui.form;
  // 获取到文章的信息（放到页面form中展示出来）,需要通过location的search来获取id 的值，从而发请求，根据 Id 获取文章详情
  // 需要通过截取
  let id = location.search.split("?id=")[1];
  console.log(id);

  getArticle();
  // 发请求，根据 Id 获取文章详情，将内容填充到页面中
  function getArticle() {
    $.ajax({
      //  url:'/my/article/:id'
      url: "/my/article/" + id,
      success: function (res) {
        // console.log(res);
        if (res.status !== 0) {
          return layer.msg("获取文章失败");
        }
        // 快速填充返回的数据
        form.val("pubForm", res.data);

        // 初始化富文本编辑器（注意，这个位置放到success里面来，否则可能会有出现内容没有的bug）
        // 这样表示当数据回来之后在初始化富文本编辑器
        initEditor();

        // 拿到剪裁区域的图片
        // res.data.cover_img ==> 得到的图片没有根路径
        $image
          .attr("src", "http://ajax.frontend.itheima.net" + res.data.cover_img) // 重新设置图片路径
          .cropper(options); // 重新初始化裁剪区域

        // 修改文章的发布状态
        state = res.data.state;
      },
    });
  }
  //   发请求，获取文章分类列表
  $.ajax({
    url: "/my/article/cates",
    success: function (res) {
      //   console.log(res);
      if (res.status !== 0) {
        return layer.msg("获取文章分类列表失败");
      }
      //   通过ES6语法，把内容放到分类的下拉框中
      let htmlStr = "";
      res.data.forEach((item) => {
        htmlStr += `<option value="${item.Id}">${item.name}</option>`;
      });
      // 把option添加到下拉框中
      $("[name=cate_id]").append(htmlStr);
      // 重新渲染表单
      form.render();
      // 获取到原本选中的选项
      getArticle();
    },
  });

  // 选择封面==》模拟点击了文件域
  $("#chooseBtn").click(function () {
    $("#fileBtn").click();
  });

  // 选择好后，更换剪裁的图片
  // 文件域change事件
  $("#fileBtn").change(function () {
    // 拿到用户选择的文件
    let file = this.files[0];
    // 根据选择的文件，创建一个对应的 URL 地址：
    let newImgURL = URL.createObjectURL(file);
    // 先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域：
    $image
      .cropper("destroy") // 销毁旧的裁剪区域
      .attr("src", newImgURL) // 重新设置图片路径
      .cropper(options); // 重新初始化裁剪区域
  });

  // 点击按钮，修改state的状态
  $("#submitBtn").click(function () {
    state = "已发布";
  });
  $("#storeBtn").click(function () {
    state = "草稿";
  });

  // 发布新文章
  $("#pubForm").submit(function (e) {
    e.preventDefault();
    //  因为涉及到文件上传的功能，因此提交的请求体，必须是 FormData 格式
    let fd = new FormData(this); //传入的参数需要是form表单的DOM对象

    // 是通过name属性来获取数据的,所以文章标题，分类和内容可以获取到，但是图片cover_img和发布状态state无法获取到，需要通过追加的形式fd.append()

    // 将裁剪后的图片，输出为文件
    $image
      .cropper("getCroppedCanvas", {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280,
      })
      // 将 Canvas 画布上的内容，转化为文件对象
      // 得到文件对象后，进行后续的操作
      .toBlob(function (blob) {
        fd.append("cover_img", blob); //需要拿到blob数据，需要放到把图片输出为文件的函数里
        fd.append("state", state);
        // 注意：需要多追加一项
        // 追加文章id
        fd.append("Id", id);
        // 快速查看fd的各项参数
        // fd.forEach((item) => console.log(item));

        // 发布文章的的请求，通过函数调用
        edit(fd); //把数据fd通过形参传入
      });
  });

  // 发请求，根据 Id 更新文章信息
  function edit(fd) {
    $.ajax({
      url: "/my/article/edit",
      type: "POST",
      data: fd,
      // 注意，jQuery以formdata的形式发请求，需要多加以下两项
      contentType: false,
      processData: false,
      success: function (res) {
        // console.log(res);
        if (res.status !== 0) {
          return layer.msg("更新文章失败");
        }
        layer.msg("更新文章成功");
        // 跳转到文章分类页面
        location.href = "/article/list.html";
      },
    });
  }
});
