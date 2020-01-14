$(function() {
  // 二级分类初始化
  var currentPage = 1
  var pageSize = 5
  render()
  function render() {
    $.ajax({
      type: 'get',
      url: '/category/querySecondCategoryPaging',
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: 'json',
      success: function(res) {
        console.log(res)

        var htmlstr = template('secondTpl', res)
        $('tbody').html(htmlstr)

        // 分页
        $('#secondPaginator').bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: res.page,
          totalPages: Math.ceil(res.total / res.size),
          onPageClicked: function(a, b, c, page) {
            // console.log(page);
            currentPage = page
            render()
          }
        })
      }
    })
  }

  // 添加分类模态框
  $('#addCatBtn').click(function() {
    // 发送请求,动态获取一级分类名称
    $.ajax({
      type: 'get',
      url: '/category/queryTopCategoryPaging',
      data: {
        page: 1,
        pageSize: 100
      },
      dataType: 'json',
      success: function(res) {
        console.log(res)
        var htmlstr = template('firstTpl', res)
        $('#firstCat').html(htmlstr)
      }
    })
    // 显示模态框
    $('#addModal').modal('show')
  })

  // 点击选中某个选项设置给dropDown文本框,使用事件委托
  $('#firstCat').on('click', 'a', function() {
    var value = $(this).text()
    // console.log(value);
    $('#dropdowntext').text(value)
    // 获取对应的id
    var id = $(this).data('id')
    // 设置给隐藏域,用于提交
    $('[name="categoryId"]').val(id)

    // 只要给隐藏域赋值了,就应该更新状态
    $('#addCatForm')
      .data('bootstrapValidator')
      .updateStatus('categoryId', 'VALID')
  })

  // 完成文件上传初始化
  $('#fileupload').fileupload({
    dataType: 'json',
    done: function(e, data) {
      console.log(data)

      var src = data.result.picAddr
      $('.img_box img').attr('src', src)

      // 设置给隐藏域,用于提交
      $('[name="brandLogo"]').val(src)

      // 只要给隐藏域赋值了,就应该更新状态
      // $('#addCatForm').data('bootstrapValidator').updateStatus('brandLogo', 'VALID')
      // 底层是通过input事件监听状态的,所以就trigger一下
      $('[name="brandLogo"]').trigger('input')
    }
  })

  // 在上传之前,先进行表单校验
  $('#addCatForm').bootstrapValidator({
    // 1. 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
    excluded: [],
    // 2. 指定校验时的图标显示，默认是bootstrap风格
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    // 3. 指定需要校验的字段列表
    fields: {
      categoryId: {
        validators: {
          notEmpty: {
            message: '请选择一级分类'
          }
        }
      },
      brandName: {
        validators: {
          notEmpty: {
            message: '请输入二级分类名称'
          }
        }
      },
      brandLogo: {
        validators: {
          notEmpty: {
            message: '请选择图片'
          }
        }
      }
    }
  })

  // 阻止默认的submit提交,用ajax提交,注册表单验证成功事件
  $('#addCatForm').on('success.form.bv', function(e) {
    e.preventDefault()
    $.ajax({
      type: 'post',
      url: '/category/addSecondCategory',
      data: $('#addCatForm').serialize(),
      dataType: 'json',
      success: function(res) {
        console.log(res)
        if (res.success) {
          // 隐藏模态框
          $('#addModal').modal('hide')
          // 刷新页面
          currentPage = 1
          render()
          // 重置表单
          $('#addCatForm').data('bootstrapValidator').resetForm(true)
          // 对于下拉菜单和图片需要手动重置
          $('#dropdowntext').text('请选择一级分类')
          $('.img_box img').attr('src','./images/none.png')
        }
      }
    })
  })
})
