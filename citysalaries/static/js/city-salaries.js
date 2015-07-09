
var employees_url = 'https://s3-us-west-2.amazonaws.com/salaries.thelensnola.org/neworleans/data/export/employees.txt';
var departments_url = 'https://s3-us-west-2.amazonaws.com/salaries.thelensnola.org/neworleans/data/export/departments.txt';
var positions_url = 'https://s3-us-west-2.amazonaws.com/salaries.thelensnola.org/neworleans/data/export/positions.txt';
var results;
var page_length = 50;
var dt;

function formatCurrency(number) {
  var n = number.split('').reverse().join('');
  var n2 = n.replace(/\d\d\d(?!$)/g, '$&,');
  var return_val = '$' + n2.split('').reverse().join('');

  return return_val;
}

function formatThousands(number) {
  if (typeof number === 'number') {
    number = number.toString();
  }
  var n = number.split('').reverse().join('');
  var n2 = n.replace(/\d\d\d(?!$)/g, '$&,');
  var return_value = n2.split('').reverse().join('');

  return return_value;
}

function renderDepartmentsHandlebarsHtml(data) {
  var select_source = $('#departments-template').html();
  var select_template = Handlebars.compile(select_source);
  var select_html = select_template(data);

  return select_html;
}

function renderPositionsHandlebarsHtml(data) {
  var select_source = $('#positions-template').html();
  var select_template = Handlebars.compile(select_source);
  var select_html = select_template(data);

  return select_html;
}

function addEmployees(data) {
  var employees = data.split('\n');
  $('#employees').autocomplete({
    source: employees,
    select: function (event, ui) {
      var thisValue = ui.item.value;
      document.getElementById('employees').value = thisValue;
      document.activeElement.blur();
      // $('#employees').autocomplete('close');
      doSearch();
    },
    search: function () {
      $('#employees').autocomplete('close');
    },
    minLength: 1,
    delay: 0,
    open: function (event, ui) {
      $('.ui-autocomplete').off('menufocus hover mouseover mouseenter');
      // var input_width = $('#input-div').width();
      // $('.ui-menu').width(input_width);
    }
  }).keyup(function (event) {
    if (event.which === 13) {
      $('#employees').autocomplete('close');
      document.activeElement.blur();
    }
  });
}

function addDepartments(data) {
  var departments = data.split('\n');
  var html = renderDepartmentsHandlebarsHtml(departments);
  $('#departments').html(html);
}

function addPositions(data) {
  var positions = data.split('\n');
  var html = renderPositionsHandlebarsHtml(positions);
  $('#positions').html(html);
}

function processRequest(data) {
  // Assumes all values can be returned, then filters down.
  var output = window.salaries;// A global variable

  // Filter by name
  if (data.name !== '') {
    output = _.filter(output, function (item) {
      var first = '';
      var last = '';
      var full = '';
      var condition;
      var conditional;

      // Split name input
      var split_input = data.name.split(' '); // ['first', 'last']

      if (split_input.length === 2) {//two words
        first = split_input[0];
        last = split_input[1];
        conditional = 'and';
      } else if (split_input.length > 2) {// >2 words, so require exact match
        full = split_input.join(' ');// Reconstruct name fragments
        conditional = 'concatenate';
      } else {//one word
        first = data.name;
        last = data.name;
        conditional = 'or';
      }

      // Check if value is found:
      var cond1 = item.first_name.toUpperCase().indexOf(first.toUpperCase()) !== -1;// (Returns -1 if the value is not found.)
      var cond2 = item.last_name.toUpperCase().indexOf(last.toUpperCase()) !== -1;
      var thing_to_check = item.first_name + ' ' + item.last_name;
      var cond3 = thing_to_check.toUpperCase().indexOf(full.toUpperCase()) !== -1;

      if (conditional === 'and') {
        condition = cond1 && cond2;
      } else if (conditional === 'or') {
        condition = cond1 || cond2;
      } else if (conditional === 'concatenate') {
        condition = cond3;
      }
      return condition;
    });
  }

  // Filter by department
  if (data.department !== '') {
    output = _.filter(output, function (item) {
      return item.department === data.department;
    });
  }

  // Filter by position
  if (data.position !== '') {
    output = _.filter(output, function (item) {
      return item.position === data.position;
    });
  }

  return output;
}

function getRow(item) {
  var output = [];

  output.push(item.first_name + ' ' + item.last_name);
  output.push(item.last_name);
  output.push(item.position);
  output.push(item.department);

  var salary = item.salary;
  salary = formatCurrency(salary);
  output.push(salary);

  return output;
}

function getRows(results, limit) {
  var output = [];
  var i;
  for (i = 0; i < results.length; i++) {
    output.push(getRow(results[i]));

    if ((i + 1) === limit) {
      return output;
    }
  }

  return output;
}

function buildQueryString(data) {
  var map_query_string = '';

  if (data.name !== '') {
    map_query_string = map_query_string + 'q=' + encodeURIComponent(data.name);
  }

  if (data.department !== '') {
    if (map_query_string !== '') {
      map_query_string = map_query_string + '&';
    }
    map_query_string = map_query_string + 'dept=' + encodeURIComponent(data.department);
  }

  if (data.position !== '') {
    if (map_query_string !== '') {
      map_query_string = map_query_string + '&';
    }
    map_query_string = map_query_string + 'pos=' + encodeURIComponent(data.position);
  }

  // if (map_query_string === '') {
  //   map_query_string = '';
  // }

  if (map_query_string !== '') {
    map_query_string = '#' + map_query_string;
  }

  return map_query_string;
}

function updateUrl(data) {
  window.location.hash = buildQueryString(data);
}

function dataTables() {
  dt = $('#table').dataTable({
    searching: false,
    lengthChange: false,
    order: [[4, 'desc']],
    filter: false,
    pageLength: page_length,
    autoWidth: false,
    columns: [
      {'width': '20%'},
      {'width': '20%'},
      {'width': '20%'},
      {'width': '20%'},
      {'width': '20%'},
    ],
    aoColumns: [
      {
        sClass: 'first',
        iDataSort: 1
      },
      {
        sClass: 'last',
        bVisible: false
      },
      {sClass: 'position'},
      {sClass: 'department'},
      {sClass: 'salary'},
    ],
    oLanguage: {
      sInfo: 'Showing _START_ to _END_ of _TOTAL_ results. <a class=\'show-all\'>Show all results.</a>',
      sInfoEmpty: '',
      oPaginate: {
        sPrevious: '<i class=\'fa fa-arrow-left\'></i> Previous',
        sNext: 'Next <i class=\'fa fa-arrow-right\'></i>'
      },
      sZeroRecords: 'No records found. Please try another search.',
      sEmptyTable: 'No records found. Please try another search.'
    },
    dom: '<ip<t>ip>'// Info and pager at top and bottom of table
    //"lengthMenu": [ [25, 50, 100, -1], [25, 50, 100, 'All'] ]
  });
}

function clearAllParameters () {
  $('#employees').val('');
  $('#departments').val('');
  $('#positions').val('');
}

function gatherData() {
  var data = {};
  data.name = $('#employees').val();
  data.department = $('#departments').val();
  data.position = $('#positions').val();

  // Replace any extraneous spaces in search input with a single space
  data.name = data.name.replace(/ +(?= )/g, '');

  return data;
}

function showHideResultsInfo() {
  var number_of_pages = $('#table').DataTable().page.info().pages;

  if (number_of_pages <= 1) {
    $('.show-all').css({'display': 'none'});
    $('.dataTables_paginate').css({'display': 'none'});
  } else {
    $('.show-all').css({'display': 'inline-block'});
    $('.dataTables_paginate').css({'display': 'block'});
  }
}

function loadTable() {
  $('.tablesorter').css({'display': 'table'});
  $('.dataTables_wrapper').css({'display': 'block'});

  // Make sure keyboard is hidden in mobile view
  $('.name-address-box').blur();

  var data = gatherData();
  var results = processRequest(data);
  var new_rows = getRows(results);

  dt.fnClearTable();
  dt.fnSettings()._iDisplayLength = page_length;

  if (results.length !== 0) {
    dt.fnAddData(new_rows);
    dt.fnSort([[1, 'asc'], [0, 'asc']]);
  } else {
    $('.dataTables_paginate').css({'display': 'none'});
    $('.dataTables_info').css({'display': 'none'});
  }

  showHideResultsInfo();
}

function process(data) {
  window.salaries = $.csv.toObjects(data);
}

$(document).ready(function () {
  $.get(employees_url, function (data) {
    addEmployees(data);
  }, 'text').then(function () {
    $.get(departments_url, function (data) {
      addDepartments(data);
    }, 'text');
  }).then(function () {
    $.get(positions_url, function (data) {
      addPositions(data);
    }, 'text');
  }).then(function () {
    getData();// Different function for index.js and search.js
  });
});
