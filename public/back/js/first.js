$(function() {
  var currentPage = 1 // 记录当前页
  var pageSize = 5 // 记录每页条数
  render()
  function render() {
    $.ajax({
      type: 'get',
      url: '/category/queryTopCategoryPaging',
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: 'json',
      success: function(res) {
        console.log(res)
        var htmlstr = template('firstTpl', res)
        $('tbody').html(htmlstr)

        // 分页功能
        $('#userPaginator').bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: res.page,
          totalPages: Math.ceil(res.total / res.size),

          // 点击页码切换显示目录
          onPageClicked: function(a, b, c, page) {
            console.log(page)
            currentPage = page
            render()
          }
        })
      }
    })
  }

  // 点击分类按钮,显示模态框,添加分类
  $('#addCatBtn').click(function() {
    $('#addModal').modal('show')
  })
  // 初始化表单校验事件
 // 3. 通过校验插件, 添加校验功能
 $("form").bootstrapValidator({

  // 配置图标
  feedbackIcons: {
    valid: 'glyphicon glyphicon-ok',
    invalid: 'glyphicon glyphicon-remove',
    validating: 'glyphicon glyphicon-refresh'
  },

  // 校验的字段
  fields: {
    categoryName: {
      // 校验规则
      validators: {
        // 非空检验
        notEmpty: {
          // 提示信息
          message: "请输入一级分类名称"
        }
      }
    }
  }
});

// 添加分类,注册表单校验成功事件
$("#form").on('success.form.bv', function (e) {
  e.preventDefault();
  //使用ajax提交逻辑

  $.ajax({
    type: 'post',
    url: '/category/addTopCategory',
    data: $('#form').serialize(),
    dataType: 'json',
    success: function(res) {
      console.log(res);
      if(res.success) {
        // 关闭模态框
        $('#addModal').modal('hide')

        // 刷新页面
        currentPage = 1
        render()
        // 重置表单
        $('#form').data('bootstrapValidator').resetForm(true)
      }
      
    }
  })
});

})
