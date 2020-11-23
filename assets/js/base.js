// 提交前的基本配置
$.ajaxPrefilter(function (options) {
     options.url='http://ajax.frontend.itheima.net'+options.url
})