
var employees_url = 'https://s3-us-west-2.amazonaws.com/lensnola/city-salaries-2/data/export/employees.csv';
var departments_url = 'https://s3-us-west-2.amazonaws.com/lensnola/city-salaries-2/data/export/departments.csv';
var positions_url = 'https://s3-us-west-2.amazonaws.com/lensnola/city-salaries-2/data/export/positions.csv';
var results;
var page_length = 50;
var dt;

function formatCurrency(number) {
  var n = number.split('').reverse().join("");
  var n2 = n.replace(/\d\d\d(?!$)/g, "$&,");
  var return_val = '$' + n2.split('').reverse().join('');

  return return_val;
}

function formatThousands(number) {
  if (typeof number === 'number') {
    number = number.toString();
  }
  var n = number.split('').reverse().join("");
  var n2 = n.replace(/\d\d\d(?!$)/g, "$&,");
  var return_val = n2.split('').reverse().join('');

  return return_val;
}

function addEmployees(data){
  var employees = data.split("\n");
  $("#employees").autocomplete({
    source: employees
  });
}

function addDepartments(data){
  var departments = data.split("\n");
  $("#departments").autocomplete({
    source: departments
  });
}

function addPositions(data){
  var positions = data.split("\n");
  $("#positions").autocomplete({
    source: positions
  });
}

function processRequest(data) {
  // Assumes all values can be returned, then filters down.
  var output = window.salaries; // A global variable

  var cond1 = (
    data['name'] !== ""
  );

  // Filter by name
  if (cond1) {
    output = _.filter(output, function(item) {
      var first = '';
      var last = '';
      var condition;
      var conditional;

      // Split name input
      split_input = data['name'].split(' '); // ['first', 'last']
      // console.log('split_input: ', split_input);

      if (split_input.length > 1) {
        first = split_input[0];
        last = split_input[1];
        conditional = 'and';
      } else {
        first = data['name'];
        last = data['name'];
        conditional = 'or';
      }

      var cond1 = item['first_name'].toUpperCase().indexOf(first.toUpperCase()) !== -1;
      var cond2 = item['last_name'].toUpperCase().indexOf(last.toUpperCase()) !== -1; // Returns -1 if the value is not found.

      if (conditional === 'and') {
        condition = cond1 && cond2;
      } else if (conditional === 'or') {
        condition = cond1 || cond2;
      }

      return condition;
    });
  }

  var cond2 = (
    data['department'] !== "" &&
    data['department'] !== "ALL" &&
    data['department'] !== "FIRE: ALL" &&
    data['department'] !== "POLICE: ALL"
  );

  var cond3 = (
    data['department'] === "FIRE: ALL" ||
    data['department'] === "POLICE: ALL"
  );

  // Filter by department
  if (cond2) {
    output = _.filter(output, function(item) {
      return item['department'] === data['department'];
    });
  } else if (cond3) {
    var temp_department = data['department'].replace(': ALL','');  // replace :ALL
    output = _.filter(output, function(item) {
      return item['department'].indexOf(temp_department.toUpperCase()) !== -1;
    });
  }

  var cond4 = (
    data['position'] !== "" &&
    data['position'] !== "ALL"
  );

  // Filter by position
  if (cond4) {
    output = _.filter(output, function(item){
      return item['position'] === data['position'];
    });
  }

  return output;
}

function getRow(item) {
  var output = [];

  output.push(item['first_name']);
  output.push(item['last_name']);
  output.push(item['department']);
  output.push(item['position']);

  var salary = item['salary'];
  salary = formatCurrency(salary);
  output.push(salary);

  return output;
}

function getRows(results, limit) {
  var output = [];

  for (var i = 0; i < results.length; i++) {
    var row = getRow(results[i]);
    output.push(row);

    if ((i + 1) === limit) {
      return output;
    }
  }

  return output;
}

function buildQueryString(data) {
  var map_query_string = '';

  if (data['name'] !== '') {
    map_query_string = map_query_string + "q=" + encodeURIComponent(data['name']);
  }

  if (data['department'] !== '') {
    if (map_query_string !== '') {
      map_query_string = map_query_string + '&';
    }
    map_query_string = map_query_string + "dept=" + encodeURIComponent(data['department']);
  }

  if (data['position'] !== '') {
    if (map_query_string !== '') {
      map_query_string = map_query_string + '&';
    }
    map_query_string = map_query_string + "pos=" + encodeURIComponent(data['position']);
  }

  // if (map_query_string === '') {
  //   map_query_string = "";
  // }

  if (map_query_string !== '') {
    map_query_string = "#" + map_query_string;
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
      {"width": "20%"},
      {"width": "20%"},
      {"width": "20%"},
      {"width": "20%"},
      {"width": "20%"},
    ],
    aoColumns: [
      {sClass: "first"},
      {sClass: "last"},
      {sClass: "department"},
      {sClass: "position"},
      {sClass: "salary"},
    ],
    oLanguage: {
      sInfo: "Showing _START_ to _END_ of _TOTAL_ results. <a class='show-all'>Show all results.</a>",
      oPaginate: {
        sPrevious: "<i class='fa fa-arrow-left'></i> Previous",
        sNext: "Next <i class='fa fa-arrow-right'></i>"
      },
      sZeroRecords: "No records found. Please try another search."
    },
    dom: '<ip<t>ip>'// Info and pager at top and bottom of table
    //"lengthMenu": [ [25, 50, 100, -1], [25, 50, 100, 'All'] ]
  });
}

function clearAllParameters() {
  $('#employees').val('');
  $('#departments').val('');
  $('#positions').val('');
}

function gatherData() {
  var data = {};
  data['name'] = $('#employees').val();
  data['department'] = $('#departments').val();
  data['position'] = $('#positions').val();

  return data;
}

function showHideResultsInfo() {
  var number_of_pages = $('#table').DataTable().page.info().pages;

  if (number_of_pages === 1) {
    $(".show-all").css({'display': 'none'});
    $(".dataTables_paginate").css({'display': 'none'});
  } else {
    $(".show-all").css({'display': 'inline-block'});
    $(".dataTables_paginate").css({'display': 'block'});
  }
}

function loadTable() {
  $(".tablesorter").css({'display': 'table'});
  $(".dataTables_wrapper").css({'display': 'block'});

  // Make sure keyboard is hidden in mobile view
  $(".name-address-box").blur();

  var data = gatherData();

  var results = processRequest(data);

  var new_rows = getRows(results);

  dt.fnClearTable();
  dt.fnSettings()._iDisplayLength = page_length;

  if (results.length !== 0) {
    dt.fnAddData(new_rows);
    dt.fnSort([[1, 'asc'], [0, "asc"]]);
  }

  showHideResultsInfo();
}

function process(data) {
  window.salaries = $.csv.toObjects(data);
}

$(document).ready(function() {
  $.get(employees_url, function(data) {
    addEmployees(data);
  }, 'text');

  $.get(departments_url, function(data) {
    addDepartments(data);
  }, 'text');

  $.get(positions_url, function(data) {
    addPositions(data);
  }, 'text');
});
