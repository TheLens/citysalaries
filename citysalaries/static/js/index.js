function loadHighestSalaries() {
  // loadTable();

  $(".tablesorter").css({'display': 'table'});
  $(".dataTables_wrapper").css({'display': 'block'});

  // Make sure keyboard is hidden in mobile view
  $(".name-address-box").blur();

  var data = {};
  data.name = $('#employees').val();
  data.department = $('#departments').val();
  data.position = $('#positions').val();

  var results = processRequest(data);

  var new_rows = getRows(results, 25);

  dt.fnClearTable();
  dt.fnSettings()._iDisplayLength = 50;
  dt.fnAddData(new_rows);
  // dt.fnSort([[1, 'asc'], [0, "asc"]]);

  dt.fnSort([4, 'desc']);
}

function loadNewPage() {
  // debugger;
  var data = gatherData();
  var url = buildQueryString(data, 'search');// For updated search pages, not the initial load.
  window.location.href = url;
}

function getData() {
  $.ajax({
    type: "GET",
    url: "https://s3-us-west-2.amazonaws.com/lensnola/city-salaries-2/data/export/highest-paid.csv",
    dataType: "text",
    success: function(data) {
      console.log(Date());
      process(data);
      dataTables();
      loadHighestSalaries();
    }
  }).then(function() {
    loadTable();
  });
}

$(document).ready(function () {
  getData();

  $(document).keypress(function (e) {
    if (e.which === 13) {
      loadNewPage();
    }
  });

  $(".search-button").on("click", function () {
    loadNewPage();
  });
});
