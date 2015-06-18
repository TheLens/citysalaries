var page_length = 100;
var page = 1;

function formatCurrency(number) {
  var n = number.split('').reverse().join("");
  var n2 = n.replace(/\d\d\d(?!$)/g, "$&,");
  var return_val = '$' + n2.split('').reverse().join('');
  // console.log(return_val);
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

function reformat(id) {
  // debugger;
  var new_id = (id).toString();
  var number = $("#" + new_id).html();
  //var newval = "$" + (Number($(id).html()).formatMoney(2, '.', ','));
  var newval = formatCurrency(number);
  $("#" + new_id).html(newval);
}

var departments_url = 'https://s3-us-west-2.amazonaws.com/lensnola/city-salaries/txt/departments.txt';
var positions_url = 'https://s3-us-west-2.amazonaws.com/lensnola/city-salaries/txt/positions.txt';

$.get(departments_url, function(data) {
  addDepartments(data);
}, 'text');

$.get(positions_url, function(data) {
  addPositions(data);
}, 'text');

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

      // console.log('first: ', first);
      // console.log('last: ', last);

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

function getRow(item, id){
  if (typeof item === 'undefined') {
    return ""; // row is blank. can't "render" row
  }

  if ($(window).width() > 500) {
    var output = '<tr data-total="16" data-page="0">' +
      '<td class="first">' + item['first_name'] + '</td>' +
      '<td class="last">' + item['last_name'] + '</td>' +
      '<td class="department">' + item['department'] +
      '</td>' +
      '<td class="title">'+ item['position'] +'</td>' +
      '<td id="'+ id + '" class="salary">' +
      item['salary'] + '</td></tr>';

    return output;
  } else {
    $("#thead").remove(); // not in table mode
    var output2 = '<div class="tablerow">' +
      '<div class="namerow">' +
        '<span class="first">' + item['first_name'] + '</span> ' +
        '<span class="last">' + item['last_name'] + '</span>' +
      '</div>' +
      '<div class="detailsrow">' +
        '<span class="title">' + item['position'] + ' | </span>' +
        '<span class="department">' + item['department'] + '</span>' +
      '</div>' +
      '<div class="salaryrow">' +
        '<span id="'+ id + '" class="salary">' + item['salary'] +'</span>' +
      '</div>' +
    '</div>';

    return output2;
  }
}

function getRows(results, page){
  var offset = page - 1;
  if (offset < 0) {
    offset = 0;
  }

  var output = "";
  for (var i = offset * page_length; i < offset * page_length + page_length; i++) {
    var row = getRow(results[i], i);
    output += row;
  }

  return output;
}

// Move this to CSS and Foundation classes
// function adjustWidth() {
//   if ($(window).width() < 500) {
//     console.log('if');
//     //$("#thead").hide();
//     //$("#table").css("border-color", "white");
//     //$("table.tablesorter").css('font-size', '1em');
//   } else {
//     console.log('else');
//     //$("#thead").show();
//     //$("#table").css("border-color", "#dddddd");
//   }
// }

function buildQueryString(data) {
  var map_query_string = '';

  if (data['name'] !== '') {
    map_query_string = map_query_string + "q=" + data['name'];
  }

  if (data['department'] !== '') {
    if (map_query_string !== '') {
      map_query_string = map_query_string + '&';
    }
    map_query_string = map_query_string + "dept=" + data['department'];
  }

  if (data['position'] !== '') {
    if (map_query_string !== '') {
      map_query_string = map_query_string + '&';
    }
    map_query_string = map_query_string + "pos=" + data['position'];
  }

  if (map_query_string === '') {
    map_query_string = ""; // "?q=&dept=&pos=";
  }

  return map_query_string;
}

function updateUrl(data) {
  window.location.hash = buildQueryString(data);
    // '&name=' + encodeURI(data['name']) +
    // '&dept=' + data['department'] +
    // '&pos=' + data['position'] +
    // '&page=' + data['page'];
}

function loadTable() {
  // $("#results-status").html('');
  // $("#results-status").html("Searching...");
  // $("#tbody").html("");
  // var html = $("#table").html();

  $('.tablesorter').css({'display': 'block'});

  var data = {};
  data['name'] = $('#employees').val(); // encodeURIComponent();
  data['department'] = $('#departments').val();
  data['position'] = $('#positions').val();
  data['page'] = 1;

  updateUrl(data);

  var results = processRequest(data);

  var number_of_pages = Math.ceil(results.length / page_length);
  if (page > number_of_pages) {
    page = number_of_pages;
  }

  var new_rows = getRows(results, page);

  $("#tbody").html(new_rows);
  $("#table").trigger("update");

  var condition = (
    results.length > page_length// &&
    //$("#nextprev").length === 0  // Pager is hidden
  );
  if (condition) {
    // Show pager
    // document.getElementById("pager").style.display = 'block';
    $(".pager").css({'display': 'block'});
  } else {
    // Hide pager
    // document.getElementById("pager").style.display = 'none';
    $(".pager").css({'display': 'none'});
  }

  var plural;
  if (results.length === 1) {
    plural = 'result';
  } else {
    plural = 'results';
  }
  var results_status = '<strong>' + formatThousands(results.length) + "</strong> " + plural + " found. Displaying " + formatThousands(page_length * (page - 1) + 1) + "-" + formatThousands(page_length * (page)) + ".";

  var page_output;
  if (results.length > page_length) {
    page_output = "Page " + page + " of " + number_of_pages;
  }

  $("#results-status").html(results_status);
  $(".number-of-pages").html(page_output);

  $.each(
    $(".salary"), function(index, val) {
      // debugger;
      var id = this.id;
      var formatted_number = reformat(id);
      $(this).html(formatted_number);
    }
  );
}

function process(data) {
  window.salaries = $.csv.toObjects(data);
}

$(document).ready(function() {
  $.ajax({
    type: "GET",
    url: "https://s3-us-west-2.amazonaws.com/lensnola/city-salaries/data/data.csv",
    dataType: "text",
    success: function(data) {
      console.log(Date());
      process(data);
    }
  });

  $(function() {
    $("#table").tablesorter({
      widgets: ['zebra']
    });
  });

  $(".next").on("click", function() {
    page += 1;
    loadTable();
  });

  $(".previous").on("click", function() {
    page -= 1;
    if (page < 1) {
      page = 1;
    }
    loadTable();
  });

  $(document).keypress(function(e) {
    if (e.which === 13) {
      page = 1;
      loadTable();
    }
  });

  $(".search-button").on("click", function() {
    page = 1; //reset page to page 1 for new search
    loadTable();
  });

});