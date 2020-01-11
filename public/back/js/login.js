$(function() {
  // 1. 登录功能校验
  $('#form').bootstrapValidator({
    // 指定校验字段
    fields: {
      username: {
        validators: {
          notEmpty: {
            message: '用户名不能为空'
          },
          stringLength: {
            min: 2,
            max: 6,
            message: '用户名长度必须在2-6位之间'
          },

          callback : {
            message: '用户名不正确'
          }
        }
      },

      password: {
        validators: {
          notEmpty: {
            message: '密码不能为空'
          },

          stringLength: {
            min: 6,
            max: 10,
            message: '密码长度必须在6-10位之间'
          },
          callback: {
            message: '密码错误'
          }
        }
      }
    },

    // 指定校验时的图标显示，默认是bootstrap风格
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    }
  })

  // 2. 注册表单验证成功事件

  $('#form').on('success.form.bv', function(e) {
    e.preventDefault()
    //使用ajax提交逻辑
    $.ajax({
      url: '/employee/employeeLogin',
      type: 'post',
      data: $('#form').serialize(),
      dataType: 'json',
      success: function(res) {
        console.log(res)

        if (res.error === 1000) {
          $('#form').data('bootstrapValidator').updateStatus('username', 'INVALID', 'callback')
          
        } else if (res.error === 1001) {
          $('#form').data('bootstrapValidator').updateStatus('password', 'INVALID', 'callback')
        } else if (res.success) {
          location.href = 'index.html'
        }
      }
    })
  })

  // 3. 点击重置按钮,重置表单
  $('[type="reset"]').on('click', function() {
    $('#form').data('bootstrapValidator').resetForm()
  })


})
