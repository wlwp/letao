$(function() {
  // 初始化产品列表
  var currentPage = 1
  var pageSize = 5
  var picarr = [] // 用于存储多张图片的路径
  render()
  function render() {
    $.ajax({
      type: 'get',
      url: '/product/queryProductDetailList',
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: 'json',
      success: function(res) {
        console.log(res)
        var htmlstr = template('productTpl', res)
        $('tbody').html(htmlstr)

        // 分页功能
        $('#productPaginator').bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: res.page,
          totalPages: Math.ceil(res.total / res.size),
          onPageClicked: function(a, b, c, page) {
            console.log(page)
            currentPage = page
            render()
          }
        })
      }
    })
  }

  // 点击添加分类
  $('#addCatBtn').click(function() {
    $('#addModal').modal('show')

    // 发送ajax获取二级分类列表
    $.ajax({
      type: 'get',
      url: '/category/querySecondCategoryPaging',
      data: {
        page: 1,
        pageSize: 100
      },
      dataType: 'json',
      success: function(res) {
        console.log(res)
        var htmlstr = template('secondTpl', res)
        $('#secondCat').html(htmlstr)
      }
    })
  })

  // 点击二级分类每一项设置给dropdown文本,事件委托
  $('#secondCat').on('click', 'a', function() {
    // 获取文本的值
    var txt = $(this).text()
    console.log(txt)
    // 设置给dropdown文本
    $('#dropdowntext').text(txt)
    // 手动更新成成功状态
    $('#addCatForm')
      .data('bootstrapValidator')
      .updateStatus('brandId', 'VALID')

    // $('[name="brandId"]').trigger('input')
  })

  // 提交前先进行表单校验
  $('#addCatForm').bootstrapValidator({
    // 1. 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
    excluded: [],
    // 2. 指定校验时的图标显示，默认是bootstrap风格
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },

    // 3. 指定校验字段列表
    fields: {
      brandId: {
        validators: {
          notEmpty: {
            message: '请选择二级分类'
          }
        }
      },
      proName: {
        validators: {
          notEmpty: {
            message: '请输入商品名称'
          }
        }
      },
      proDesc: {
        validators: {
          notEmpty: {
            message: '请输入商品描述'
          }
        }
      },
      num: {
        validators: {
          notEmpty: {
            message: '请输入商品库存'
          },
          //正则校验
          regexp: {
            regexp: /^[1-9]\d*$/,
            message: '用户名由数字字母下划线和.组成'
          }
        }
      },
      size: {
        validators: {
          notEmpty: {
            message: '请输入商品尺寸'
          },
          //正则校验
          regexp: {
            regexp: /^\d{2}-\d{2}$/,
            message: '尺码格式, 必须是 32-40'
          }
        }
      },
      oldPrice: {
        validators: {
          notEmpty: {
            message: '请输入商品原价'
          }
        }
      },
      price: {
        validators: {
          notEmpty: {
            message: '请输入商品价格'
          }
        }
      },
      picStatus: {
        validators: {
          notEmpty: {
            message: '请上传3张图片'
          }
        }
      }
    }
  })

  // 上传多张图片
  $('#fileupload').fileupload({
    dataType: 'json',
    done: function(e, data) {
      console.log(data)
      var picobj = data.result
      var picAddr = picobj.picAddr

      // 创建图片
      var img = $('<img width="100" src="' + picAddr + '" alt="" />')
      // 添加到img_box的前面
      $('.img_box').prepend(img)
      // 添加到数组的最前面
      picarr.unshift(picobj)
      if (picarr.length > 3) {
        // 如果数组的长度大于3就删除最后一项
        picarr.pop()
        // 把最后一张图片删除(自杀)
        $('.img_box img')
          .eq($('.img_box img').length - 1)
          .remove()
      }

      if (picarr.length === 3) {
        $('#addCatForm')
          .data('bootstrapValidator')
          .updateStatus('picStatus', 'VALID')
      }
    }
  })

  // 阻止默认的表单提交,使用ajax提交
  $('#addCatForm').on('success.form.bv', function(e) {
    e.preventDefault()

    var paramsStr = $('#addCatForm').serialize()
    paramsStr += '&picArr=' + JSON.stringify(picarr)

    $.ajax({
      type: 'post',
      url: '/product/addProduct',
      data:  paramsStr,
      dataType: 'json',
      success: function(res) {
        console.log(res)

        if( res.success ) {
          // 关闭模态框
          $('#addModal').modal('hide')
          // 刷新页面
          currentPage = 1
          render()

          // 重置表单
          $('#addCatForm').data('bootstrapValidator').resetForm(true)

          // 手动重置其他
          $('#dropdowntext').text('请选择二级分类')
          $('.img_box img').remove()
          picarr = []
        }
      }
    })
  })
})
