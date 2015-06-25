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
  var new_id = (id).toString();
  var number = $("#" + new_id).html();
  //var newval = "$" + (Number($(id).html()).formatMoney(2, '.', ','));
  var newval = formatCurrency(number);
  $("#" + new_id).html(newval);
}

var departments_url = 'https://s3-us-west-2.amazonaws.com/lensnola/city-salaries-2/txt/departments.txt';
var positions_url = 'https://s3-us-west-2.amazonaws.com/lensnola/city-salaries-2/txt/positions.txt';

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
    $("#thead").remove(); // Do not show in mobile view

    // document.getElementById('employees').placeholder = 'Mitch Landrieu, Michael Harrison';
    // document.getElementById('departments').placeholder = 'Municipal Court, Office of the Mayor';
    // document.getElementById('positions').placeholder = 'Police captain, mayor, judge';

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

  if (data['page'] !== 1) {
    if (map_query_string !== '') {
      map_query_string = map_query_string + '&';
    }
    map_query_string = map_query_string + "page=" + data['page'].toString();
  }

  if (map_query_string === '') {
    map_query_string = ""; // "?q=&dept=&pos=";
  }

  return map_query_string;
}

function updateUrl(data) {
  window.location.hash = buildQueryString(data);
}

function tableSorter() {
  // $('#example').DataTable();
  $("#table").tablesorter({
    widgets: ['zebra']
  });
  $("#table").bind("sortStart", function(e) {
    // debugger;
    console.log('sortStart');

    // Figure out which header was clicked. Ex. Last name.

    // Determine which order this sort should occur. If alphabetical, then
    // sort in reverse alphabetical.

    // Using the full results list, run Underscore's sortBy function using
    // the header and the sorting order.

    // Update table HTML rows

    // Trigger update for tablesorter
  });
  $("#table").bind("sortEnd", function(sorter) {
    // debugger;
    // Do something else
  });
}

function loadTable() {
  // debugger;

  var data = {};
  data['name'] = $('#employees').val(); // encodeURIComponent();
  data['department'] = $('#departments').val();
  data['position'] = $('#positions').val();
  data['page'] = page;

  updateUrl(data);

  var results = processRequest(data);

  // Check that there were results found.
  if (results.length > 0) {
    $('.tablesorter').css({'display': 'table'});
  } else {
    $('.tablesorter').css({'display': 'none'});
  }

  var number_of_pages = Math.ceil(results.length / page_length);
  if (page > number_of_pages) {
    page = number_of_pages;
  }

  var new_rows = getRows(results, page);

  $("#tbody").html(new_rows);
  tableSorter();
  $("#table").trigger("update");

  var condition = (
    results.length > page_length// &&
    //$("#nextprev").length === 0  // Pager is hidden
  );

  // Check that results span multiple pages
  if (condition) {
    // Show pager and pages
    $(".pager").css({'display': 'block'});
    $(".number-of-pages").css({'display': 'block'});
  } else {
    // Hide pager and pages
    $(".pager").css({'display': 'none'});
    $(".number-of-pages").css({'display': 'none'});
  }

  var results_status = formResultsLanguage(data, results);

  var page_output;
  if (results.length > page_length) {
    page_output = "Page " + page.toString() + " of " + number_of_pages.toString();
  }

  $("#results-status").html(results_status);
  $(".number-of-pages").html(page_output);

  $.each(
    $(".salary"), function(index, val) {
      var id = this.id;
      var formatted_number = reformat(id);
      $(this).html(formatted_number);
    }
  );
}

function formResultsLanguage(data, results) {
  var plural;
  if (results.length === 1) {
    plural = 'result';
  } else {
    plural = 'results';
  }

  var results_language = '<strong>' + formatThousands(results.length) + "</strong> " + plural + ' found';

  if (data['name'] !== '') {
    results_language += ' for employee "' + data['name'] + '"';
  }

  if (data['department'] !== '') {
    results_language += ' in department ' + data['department'];
  }

  if (data['department'] !== '') {
    results_language += ' with the job title ' + data['position'];
  }

  if (results_language.slice(-1) === '"') {
    results_language = results_language.substr(0, results_language.length - 1) + '."';
  } else {
    results_language += '.';
  }

  if (results.length !== 0) {
    var to_number = page_length * page;
    if (to_number > results.length) {
      to_number = results.length;
    }
    results_language += " Displaying " + formatThousands(page_length * (page - 1) + 1) + "-" + formatThousands(to_number) + ".";
  } else {
    results_language += " Please try another search.";
  }

  return results_language;
}

function parseURL() {
  /*
  Reads URL and returns dictionary of values.
  */
  var data = {};

  if (typeof window.location.href.split('=')[1] !== 'undefined') {// If unique URL
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

    if (window.location.href.match(/page\=[^&]*/i) !== null) {
      data['page'] = parseInt(decodeURI(window.location.href.match(/page\=[^&]*/i)[0].split('=')[1]), 10);
    } else {
      data['page'] = 1;
    }
  } else {
    data['name'] = '';
    data['department'] = '';
    data['position'] = '';
    data['page'] = 1;
  }
  return data;
}

function populateSearchParameters(data) {
  document.getElementById('employees').value = data['name'];
  document.getElementById('departments').value = data['department'];
  document.getElementById('positions').value = data['position'];
  page = data['page'];
}

function process(data) {
  window.salaries = $.csv.toObjects(data);
}

function getData() {
  $.ajax({
    type: "GET",
    url: "https://s3-us-west-2.amazonaws.com/lensnola/city-salaries-2/data/export/data.csv.gz",
    dataType: "text",
    success: function(data) {
      console.log(Date());
      process(data);
    }
  }).then(function() {
    var data = parseURL();
    populateSearchParameters(data);

    var condition = (
      data['name'] !== '' ||
      data['department'] !== '' ||
      data['position'] !== '' ||
      data['page'] !== 1
    );
    if (condition) {
      loadTable();
    }
  });
}

getData();

$(document).ready(function() {
  //$(function() {
  // $("#table").tablesorter({
  //   widgets: ['zebra']
  // });
  // $("#table").bind("sortStart", function() {
  //   // Do something
  //   console.log('yo');
  // });
  // $("#table").bind("sortEnd", function() {
  //   // Do something else
  // });
  ///});

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
      $(".name-address-box").blur();
      loadTable();
    }
  });

  $(".search-button").on("click", function() {
    page = 1; //reset page to page 1 for new search
    loadTable();
  });

});