
$(function() {

  NProgress.configure({ showSpinner: false });


  // 开始加载进度条
  $(document).ajaxStart(function() {

    NProgress.start()
  })

  // 结束进度条
  $(document).ajaxStop(function() {

   setTimeout(function() {
    NProgress.done()
   }, 500);
  })
})