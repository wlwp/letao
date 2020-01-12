// 登录拦截

console.log(location.href)

if (location.href.indexOf('login.html') === -1) {
  $.ajax({
    url: '/employee/checkRootLogin',
    type: 'get',
    dataType: 'json',
    success: function(res) {
      if (res.error === 400) {
        // 未登录,拦截到登录页
        location.href = 'login.html'
      }
    }
  })
}

NProgress.configure({ showSpinner: false })

// 开始加载进度条
$(document).ajaxStart(function() {
  NProgress.start()
})

// 结束进度条
$(document).ajaxStop(function() {
  setTimeout(function() {
    NProgress.done()
  }, 500)
})

$(function() {
  // 点击头部左侧切换按钮,切换显示隐藏
  $('.lt_main .icon_menu').click(function() {
    $('.lt_aside').toggleClass('hidemenu')
    $('.lt_main').toggleClass('hidemenu')
    $('.top_bar').toggleClass('hidemenu')
  })

  // 点击分类菜单,显示二级分类菜单
  $('.lt_aside .category').click(function() {

    $(this).next().stop().slideToggle()
  })

  // 退出登录
  $('.lt_main .icon_logout').click(function() {
    // 显示模态框
    $('#logoutModal').modal('show')
    // 点击确定按钮
    $('.modal .modal_logout').click(function() {
      $.ajax({
        type: 'get',
        url: '/employee/employeeLogout',
        dataType: 'json',
        success: function(res) {
          console.log(res)
          if (res.success) {
            location.href = 'login.html'
          }
        }
      })
    })
  })
})
