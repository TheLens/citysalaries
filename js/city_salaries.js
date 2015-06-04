var page_length = 20;
var page = 1;

function formatCurrency(number) {
  var n = number.split('').reverse().join("");
  var n2 = n.replace(/\d\d\d(?!$)/g, "$&,");
  var return_val = '$' + n2.split('').reverse().join('');
  return return_val;
}

var departments_url = 'https://s3-us-west-2.amazonaws.com/lensnola/city-salaries/txt/departments.txt';
var positions_url = 'https://s3-us-west-2.amazonaws.com/lensnola/city-salaries/txt/positions.txt';

$.get(departments_url, function(data) {
  add_departments(data);
}, 'text');

$.get(positions_url, function(data) {
  add_positions(data);
}, 'text');


function add_departments(data){
  var departments = data.split("\n");
  $("#departments").autocomplete({
    source: departments
  });
}

function add_positions(data){
  var positions = data.split("\n");
  $("#positions").autocomplete({
    source: positions
  });
}

function process_request(request) {
  var result = {}, key;

  var output = window.salaries; //start by assuming all values can be returned, then filter down

  var cond1 = (
    request['department'] !== "" &&
    request['department'] !== "ALL" &&
    request['department'] !== "FIRE: ALL" &&
    request['department'] !== "POLICE: ALL"
  );

  var cond2 = (
    request['department'] === "FIRE: ALL" ||
    request['department'] === "POLICE: ALL"
  );

  if (cond1) {
    output = _.filter(output, function(item){ return item['department'] === request['department']; });
  } else if (cond2) { //to return all police or all fire
    var temp_department = request['department'].replace(': ALL','');  //replace :ALL
    output = _.filter(
      output, function(item){
        return item['department'].indexOf(temp_department.toUpperCase()) !== -1;
      }
    );
  }

  if (request['position'] !== "" && request['position'] !== "ALL") {
    output = _.filter(output, function(item){ return item['position'] === request['position']; });
  }

  if (request['name'] !== "") {
    output = _.filter(
      output, function(item) {
        var condition = (
          item['first'].toUpperCase().indexOf(request['name'].toUpperCase()) !== -1 ||
          item['last'].toUpperCase().indexOf(request['name'].toUpperCase()) !== -1
        );
        return condition;
      }
    );
  }

  return output;
}


//to do: template engine
function get_row(item, id){
  if (typeof item === 'undefined') {
    return ""; //row is blank. can't "render" row
  }

  if ($(window).width() > 500) {
    var output = '<tr data-total="16" data-page="0">' +
      '<td class="first">' + item['first'].toUpperCase() + '</td>' +
      '<td class="last">' + item['last'].toUpperCase() + '</td>' +
      '<td class="department">' + item['department'].toUpperCase() +
      '</td>' +
      '<td class="title">'+ item['position'].toUpperCase() +'</td>' +
      '<td id="'+ id + '" class="salary">' +
      item['salary'].toUpperCase() + '</td></tr>';

    return output;
  } else {
    $("#thead").remove(); // not in table mode
    var output2 = '<div class="tablerow">' +
      '<div class="namerow"><span class="first">' +
      item['last'].toUpperCase() + '</span> <span class="last">' +
      item['first'].toUpperCase() + '</span></div>' +
      '<div class="detailsrow"><span class="department">' +
      item['department'].toUpperCase() + ' | </span><span class="title">' +
      item['position'].toUpperCase() +'</span></div>' +
      '<div><span id="'+ id + '" class="salary">' +
      item['salary'].toUpperCase() +'</span></div></div>';

    return output2;
  }
}


function reformat(id) {
  var number = $(id).html();
  //var newval = "$" + (Number($(id).html()).formatMoney(2, '.', ','));
  var newval = formatCurrency(number);
  $(id).html(newval);
}


function get_rows(results, page){
  output = "";
  var offset = page - 1;
  if (offset < 0) {
    offset = 0;
  }

  for (var i = offset * page_length; i < offset * page_length + page_length; i++) {
    var row = get_row(results[i], i);
    output += row;
  }

  return output;
}


function loadTable() {
  $("#results_status").html('');

  var name = encodeURIComponent($('#namebox').val());

  var data = {};
  data['department'] = $('#departments').val();
  data['position'] = $('#positions').val();
  data['name'] = name;
  data['page'] = 1;

  $("#tbody").html("");

  var html = $("#myTable").html();

  $("#results_status").html("Searching...");

  var results = process_request(data);

  var pages = Math.ceil(results.length / page_length);
  if (page > pages){
    page = pages;
  }

  var new_rows = get_rows(results, page);
  $("#tbody").html(new_rows);

  $("#myTable").trigger("update");

  var condition = (
    results.length > 20 &&
    !$("#nextprev").length !== 0  // todo: confusing. not sure of its purpose.
  );
  if (condition) {
    $("#tbody_div").append('<div id="nextprev"><a id="previous">Previous</a> | <a id="next">Next</a></div>');
    $("#next").on("click", function() {
      page = page + 1;
      loadTable();
    });

    $("#previous").on("click", function() {
      page = page -1;
      if (page < 1){
        page = 1;
      }
      loadTable();
    });
  }

  var results_status = results.length + " results found";
  if (results.length > 20) {
    results_status = results_status + " | page " + page + " of " + pages;
  }

  $("#results_status").html(results_status);
  $.each(
    $(".salary"), function(index, val) {
      reformat("#" + (index));
    }
  );
}

function adjustWidth() {
  if ($(window).width() < 500) {
    $("#thead").hide();
    $("div#ui_components").css("width", "100%");
    $("#searchButton").css("width", "100%");
    console.log('if');
    $("#searchButton").css("float", "right");
    $("#myTable").css("border-color", "white");
    $("table.tablesorter").css('font-size', '1em');
  } else {
    $("#thead").show();
    console.log('else');
    $("div#ui_components").css("width", "100%");
    $("#searchButton").css("width", "20%");
    $("#searchButton").css("float", "right");
    $("#myTable").css("border-color", "#dddddd");
  }
}

$(window).on('resize', function() {
  adjustWidth();
  //loadTable();
});

$(document).ready(function() {

  $(function() {
    $("#myTable").tablesorter();
  });

  $(document).keypress(function(e) {
    if (e.which === 13) {
      loadTable();
    }
  });

  adjustWidth();

  $("#searchButton").on("click", function() {
    page = 1; //reset page to page 1 for new search
    loadTable();
  });

});