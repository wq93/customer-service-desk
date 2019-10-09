(function() {
  // 初始化支持多选的下拉框
  $('.selectpicker').selectpicker({});

  $('.selectpicker').change(function(){
    // 获取多选值
    console.log($('.selectpicker').val());
  });

  $('.select-month').change(function () {
    var currentVal = $('.select-month').val();
    getDays(currentVal);
    renderThead();
    renderTbody();
  });

  // 全局变量
  var dataArr = [];
  var daysMap = [];

  // 获取当前月份的前后6个月
  var getMonthList = function () {
    // 插入当前月份后6个月
    var data = new Date();
    data.setMonth(data.getMonth(), 1)//获取到当前月份,设置月份
    for (var i = 0; i < 6; i++) {
      data.setMonth(data.getMonth() + 1);//每次循环一次 月份值减1
      var m = data.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      dataArr.push(data.getFullYear() + "-" + (m))
    }

    // 插入当前月份前6个月
    data = new Date();
    data.setMonth(data.getMonth() + 3, 1)//获取到当前月份,设置月份
    for (var i = 0; i < 6; i++) {
      data.setMonth(data.getMonth() - 1);//每次循环一次 月份值减1
      var m = data.getMonth() - 1;
      m = m < 10 ? "0" + m : m;
      dataArr.unshift(data.getFullYear() + "-" + (m))
    }
  }

  // 渲染月份下拉框
  var renderMonthOptions = function () {
    var optionsHtml = `<option value=''>请选择月份</option>`;
    optionsHtml += $.map(dataArr, function (item) {
      return `<option value=${item}>${item}</option>`
    }).join('');
    $('.select-month').html(optionsHtml);
  }

  // 获取某月有几天的数组
  var getDays = function(currentVal) {
    var currentYear = currentVal.split('-')[0];
    var currentMonth = currentVal.split('-')[1];
    // 获取选中月份有几天
    var days = new Date(currentYear, currentMonth, 0).getDate();
    daysMap = [];
    for (var i = 1; i <= days; i++) {
      i =  i < 10 ? "0" + i : i;
      daysMap.push({
        'datetime': currentMonth + '.' + i,
        'schedulingState': getWeek(currentYear + '-' + currentMonth + '-' + i)
      })
    }
  }
  // 判断某天是周几
  var getWeek = function(dateStr) {
    var week = new Date(dateStr).getDay();
    if(week === 6 || week === 0) {
      return 'free';
    }else {
      return 'work';
    }
  }

  // 渲染表头c
  var renderThead = function() {
    var thStr = `<th>操作</th><th>客服</th>`
    thStr += $.map(daysMap, function (item) {
      return `<th>${item.datetime}</th>`
    }).join('');
    var theadStr = `<tr>${thStr}</tr>`
    $('.service-desk-table table thead').html(theadStr);
  }
  // 渲染表单体
  var renderTbody = function() {
    var customerServiceList = ['liangxiaoyan', 'xuzhiyan', 'weiliban'];
    // 循环生成tr
    var tbodyStr = $.map(customerServiceList, function (customerService) {
      var trStr = `<td>编辑</td><td>${customerService}</td>`;
      trStr += $.map(daysMap, function (days) {
        return `<td>${days.schedulingState === 'free' ? '×' : '○'}</td>`
      }).join('');
       return `<tr>${trStr}</tr>`;
    }).join('');

    $('.service-desk-table table tbody').html(tbodyStr);
  }

  getMonthList()
  renderMonthOptions()
})()