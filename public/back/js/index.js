$(function() {
  // 基于准备好的dom，初始化echarts实例
  var myChart1 = echarts.init(document.querySelector('.echarts_left'))

  // 指定图表的配置项和数据
  var option1 = {
    title: {
      text: '2019年注册人数'
    },
    tooltip: {},
    legend: {
      data: ['人数', '销量']
    },
    xAxis: {
      data: ['1月', '2月', '3月', '4月', '5月', '6月']
    },
    yAxis: {},
    series: [
      {
        name: '人数',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
      },
      {
        name: '销量',
        type: 'bar',
        data: [34, 25, 30, 10, 40, 90]
      }
    ]
  }

  // 使用刚指定的配置项和数据显示图表。
  myChart1.setOption(option1)

  // 基于准备好的dom，初始化echarts实例
  var myChart2 = echarts.init(document.querySelector('.echarts_right'))

  option2 = {
    title: {
      text: '热门品牌销售',
      subtext: '2020年1月',
      left: 'center',
      textStyle: {
        color: 'red',
        fontSize: 20
      }
    },
    tooltip: {
      trigger: 'item',
      // 饼图、仪表盘、漏斗图: {a}（系列名称），{b}（数据项名称），{c}（数值）, {d}（百分比）
      formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: ['耐克', '阿迪', '匡威', '回力', '新百伦']
    },
    series: [
      {
        name: '品牌热销',
        type: 'pie',
        radius: '55%',
        center: ['50%', '60%'],
        data: [
          { value: 335, name: '耐克' },
          { value: 310, name: '阿迪' },
          { value: 234, name: '匡威' },
          { value: 135, name: '回力' },
          { value: 1548, name: '新百伦' }
        ],
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'yellow'
          }
        }
      }
    ]
  }
  // 使用刚指定的配置项和数据显示图表。
  myChart2.setOption(option2)
})
