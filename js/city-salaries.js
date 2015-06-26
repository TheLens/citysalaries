
var employees_url = 'https://s3-us-west-2.amazonaws.com/lensnola/city-salaries-2/data/export/employees.csv';
var departments_url = 'https://s3-us-west-2.amazonaws.com/lensnola/city-salaries-2/data/export/departments.csv';
var positions_url = 'https://s3-us-west-2.amazonaws.com/lensnola/city-salaries-2/data/export/positions.csv';
var results;
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

function loadHighestSalaries() {
  // loadTable();

  $(".tablesorter").css({'display': 'table'});
  $(".dataTables_wrapper").css({'display': 'block'});

  // Make sure keyboard is hidden in mobile view
  $(".name-address-box").blur();

  var data = {};
  data['name'] = $('#employees').val();
  data['department'] = $('#departments').val();
  data['position'] = $('#positions').val();

  var results = processRequest(data);

  var new_rows = getRows(results, 10);

  dt.fnClearTable();
  dt.fnSettings()._iDisplayLength = 50;
  dt.fnAddData(new_rows);
  // dt.fnSort([[1, 'asc'], [0, "asc"]]);

  dt.fnSort([4, 'desc']);
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

// $("#thead").hide(); // Do not show in mobile view

// var output2 = '<div class="tablerow">' +
//   '<div class="namerow">' +
//     '<span class="first">' + item['first_name'] + '</span> ' +
//     '<span class="last">' + item['last_name'] + '</span>' +
//   '</div>' +
//   '<div class="detailsrow">' +
//     '<span class="title">' + item['position'] + ' | </span>' +
//     '<span class="department">' + item['department'] + '</span>' +
//   '</div>' +
//   '<div class="salaryrow">' +
//     '<span id="'+ id + '" class="salary">' + item['salary'] +'</span>' +
//   '</div>' +
//   '</div>';

// return output2;

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

  if (map_query_string === '') {
    map_query_string = "";
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
    pageLength: 50,
    autoWidth: false,
    columns: [
      {"width": "20%"},
      {"width": "20%"},
      {"width": "20%"},
      {"width": "20%"},
      {"width": "20%"},
    ],
    oLanguage: {
      sInfo: "Showing _START_ to _END_ of _TOTAL_ results. <a class='show-all'>Show all</a>",
      oPaginate: {
        sPrevious: "<i class='fa fa-arrow-left'></i> Previous",
        sNext: "Next <i class='fa fa-arrow-right'></i>"
      }
    }
    //"lengthMenu": [ [25, 50, 100, -1], [25, 50, 100, 'All'] ]
  });
}

function loadTable() {
  // Remove loading animation


  $(".tablesorter").css({'display': 'table'});
  $(".dataTables_wrapper").css({'display': 'block'});

  // Make sure keyboard is hidden in mobile view
  $(".name-address-box").blur();

  var data = {};
  data['name'] = $('#employees').val();
  data['department'] = $('#departments').val();
  data['position'] = $('#positions').val();

  updateUrl(data);

  var results = processRequest(data);

  var new_rows = getRows(results);

  dt.fnClearTable();
  dt.fnSettings()._iDisplayLength = 50;
  dt.fnAddData(new_rows);
  dt.fnSort([[1, 'asc'], [0, "asc"]]);
}

function parseURL() {
  // Reads URL and returns dictionary of values.
  var data = {};

  // Check if unique URL
  if (typeof window.location.href.split('=')[1] !== 'undefined') {
    // Match z=(everything until &), then take the portion after the equal sign

    if (window.location.href.match(/q\=[^&]*/i) !== null) {
      data['name'] = decodeURI(window.location.href.match(/q\=[^&]*/i)[0].split('=')[1]);
    } else {
      data['name'] = '';
    }

    if (window.location.href.match(/dept\=[^&]*/i) !== null) {
      data['department'] = decodeURI(window.location.href.match(/dept\=[^&]*/i)[0].split('=')[1]);
    } else {
      data['department'] = '';
    }

    if (window.location.href.match(/pos\=[^&]*/i) !== null) {
      data['position'] = decodeURI(window.location.href.match(/pos\=[^&]*/i)[0].split('=')[1]);
    } else {
      data['position'] = '';
    }
  } else {
    data['name'] = '';
    data['department'] = '';
    data['position'] = '';
  }
  return data;
}

function populateSearchParameters(data) {
  document.getElementById('employees').value = data['name'];
  document.getElementById('departments').value = data['department'];
  document.getElementById('positions').value = data['position'];
}

function process(data) {
  window.salaries = $.csv.toObjects(data);
}

function getData() {
  $.ajax({
    type: "GET",
    url: "https://s3-us-west-2.amazonaws.com/lensnola/city-salaries-2/data/export/data.csv",
    dataType: "text",
    success: function(data) {
      console.log(Date());
      process(data);
      dataTables();
      loadHighestSalaries();
      // $(".tablesorter").css({'display': 'table'});
      // $(".dataTables_wrapper").css({'display': 'table'});
    }
  }).then(function() {
    var data = parseURL();
    populateSearchParameters(data);

    var condition = (
      data['name'] !== '' ||
      data['department'] !== '' ||
      data['position'] !== ''
    );
    if (condition) {
      loadTable();
    }
  });
}

$(document).ready(function() {
  // Add loading animation
  // document.getElementById('animation').innerHTML = '<img >';

  getData();

  $.get(employees_url, function(data) {
    addEmployees(data);
  }, 'text');

  $.get(departments_url, function(data) {
    addDepartments(data);
  }, 'text');

  $.get(positions_url, function(data) {
    addPositions(data);
  }, 'text');

  $(document).on("click", ".show-all", function() {
    console.log('show-all');
    var oSettings = dt.fnSettings();
    console.log(oSettings);
    oSettings._iDisplayLength = -1;
    dt.fnDraw();
    $(".show-all").css({'display': 'none'});
  });

  $(".next").on("click", function() {
    loadTable();
  });

  $(".previous").on("click", function() {
    loadTable();
  });

  $(document).keypress(function(e) {
    if (e.which === 13) {
      loadTable();
    }
  });

  $(".search-button").on("click", function() {
    loadTable();
  });
});