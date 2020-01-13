$(function() {
  // 发送ajax请求数据
  var currentPage = 1; // 记录当前页
  var pagesize = 5; // 记录每页条数
  render()
  function render() {
    $.ajax({
      type: 'get',
      url: '/user/queryUser',
      data: {
        page: currentPage,
        pageSize: pagesize
      },
      dataType: 'json',
      success: function(res) {
        console.log(res)

        var htmlstr = template('tpl', res)
        $('tbody').html(htmlstr)
        // 分页功能
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: res.page,
          totalPages: Math.ceil(res.total / res.size),
          onPageClicked: function(a,b,c,page) {
            console.log(page);
            currentPage = page
            render()
                  
          }
        })
      }
    })
  }

  // 点击操作按钮,更改状态
  $('tbody').on('click', '.btn', function() {
    $('#userModal').modal('show')
    var id = $(this).parent().data('id')
    var isDelete = $(this).hasClass('btn-danger') ? 0 : 1
    

    // 先解绑,在注册事件
    $('.confirmBtn').off('click').on('click', function() {
      $.ajax({
        url: '/user/updateUser',
        type: 'post',
        data: {
          id: id,
          isDelete : isDelete
        },
        dataType: 'json',
        success: function(res) {
          console.log(res);
          if(res.success) {
            // 隐藏模态框
            $('#userModal').modal('hide')
            // 更改内容
            render()
          }
          
        }
      })


    })
    
    
    // $.ajax({
    //   type: 'post',
    //   url: '/user/updateUser',
    //   data: {
    //     //  id:,
    //     //  isDelete: ,
    //   },
    //   dataType: 'json',
    //   success: function(res) {
    //     console.log(res);
        
    //   }
    // })
  })

})
