$(function () {
  let layer = layui.layer;
  let form = layui.form;
  let laypage = layui.laypage;
  /* 
    需要的参数：
    pagenum	是	int	页码值
    pagesize	是	int	每页显示多少条数据
    cate_id	否	string	文章分类的 Id
    state	否	string	文章的状态，可选值有：已发布、草稿
    */
  //为了方便修改参数，把请求的参数抽离出来，放到一个对象中
  let query = {
    pagenum: 1, //页码值
    pagesize: 10, //每页显示多少条数据
    cate_id: "", //空代表全选 文章分类的 Id
    state: "", //空代表全选 文章的状态
  };

  getList();
  //  封装函数
  //  发请求，获取文章的列表数据
  function getList() {
    $.ajax({
      url: "/my/article/list",
      data: query,
      success: function (res) {
        //  console.log(res)
        //  结合模板引擎，渲染数据
        if (res.status !== 0) {
          return layer.msg("获取文章列表失败");
        }
        let htmlStr = template("list", res);
        $("tbody").html(htmlStr);

        // console.log(res.total)
        //拿到分页总页数，调用分页展示函数,通过实参传入
        page(res.total);
      },
    });
  }

  // 分页展示函数
  function page(total) {
    //执行一个laypage实例
    laypage.render({
      curr: query.pagenum, //当前页码
      limit: query.pagesize, //每页多少条
      elem: "pageBox", //注意，这里的 pageBox 是 ID，不用加 # 号
      count: total, //数据总数，从服务端得到
      limits: [1, 3, 5, 7], //每页条数的选择项 数组
      layout: ["count", "limit", "prev", "page", "next", "skip"],
      // 自定义排版。数组可选值有：count（总条目输区域）、prev（上一页区域）、page（分页区域）、next（下一页区域）、limit（条目选项区域）、refresh（页面刷新区域） 、skip（快捷跳页区域）
      // jump - 切换分页的回调
      // 当分页被切换时触发，函数返回两个参数：obj（当前分页的所有选项值）、first（是否首次，一般用于初始加载的判断）
      jump: function (obj, first) {
        //obj包含了当前分页的所有参数，比如：
        // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
        // console.log(obj.limit); //得到每页显示的条数
        // console.log(first);
        // true  是否为分页初始渲染
        // undefined

        // 点击分页后，需要修改query对象的pagenum和pagesize
        // 重新发送ajax请求
        query.pagenum = obj.curr;
        query.pagesize = obj.limit;

        //首次不执行
        if (!first) {
          getList();
        }
      },
    });
  }

  //  过滤器
  template.defaults.imports.timeFilter = function (time) {
    let t = new Date(time);
    let year = t.getFullYear();
    let month = add0(t.getMonth() + 1);
    let date = add0(t.getDate());
    let hours = add0(t.getHours());
    let minutes = add0(t.getMinutes());
    let seconds = add0(t.getSeconds());

    return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
  };

  // 补零函数
  let add0 = (n) => (n > 10 ? "0" + n : n);

  // 所有分类下拉框中，获取文章分类的数据
  $.ajax({
    url: "/my/article/cates",
    success: function (res) {
      //  console.log(res)
      // 使用ES6的反引号来把数据渲染到下拉框中
      let htmlStr = ""; // 装option的html字符串

      // 遍历数组，数据结合option创建出来
      res.data.forEach((item) => {
        htmlStr += `<option value="${item.Id}">${item.name}</option>`;
      });
      // console.log(htmlStr)

      // 将创建的option添加到下拉框中
      $("[name=cate_id]").append(htmlStr);
      // 手动更新渲染表单
      form.render();
    },
  });

  // 点击筛选按钮
  $("#selectForm").submit(function (e) {
    e.preventDefault();

    //  修改query对象的cate_id和state
    query.cate_id = $("[name=cate_id]").val();
    query.state = $("[name=state]").val();

    // 发请求，获取文章的列表数据
    getList();
  });

  // 删除按钮
  $("body").on("click", ".delBtn", function () {
    //  发请求，根据 Id 删除文章数据
    let id = $(this).attr("data-id");

    // 注意：有个bug
    // 需要做个判断，判断tbody中的删除按钮的个数是否为1，如果为1，意味着请求发送成功，该页面中就没有了数据，需要将pagenum - 1（展示上一页数据）
    // 注意：pagenum最小值为1
    if ($(".delBtn").length === 1) {
      // 如果为1，意味着请求发送成功，该页面中就没有了数据，需要将pagenum - 1（展示上一页数据）
      query.pagenum = query.pagenum === 1 ? 1 : query.pagenum - 1;
    }

    layer.confirm(
      "是否确认删除?",
      { icon: 3, title: "提示" },
      function (index) {
        //do something
        $.ajax({
          // url:'/my/article/delete/:id'
          url: "/my/article/delete/" + id,
          success: function (res) {
            console.log(res);
            if (res.status !== 0) {
              return layer.msg("删除失败");
            }
            layer.msg("删除成功");
            // 重新获取列表
            getList();
          },
        });
        layer.close(index);
      }
    );
  });

  // 编辑按钮
  $("body").on("click", ".editBtn", function () {
    // 因为在编辑页面中需要根据 Id 获取文章详情，所以需要先拿到id
    let id = $(this).attr("data-id");
    // 跳转到编辑页面，并把id放到url地址后面
    // 注意：需要在地址栏中加上？id= 否则无法跳转
    location.href = "/article/edit.html?id=" + id;
  });
});
