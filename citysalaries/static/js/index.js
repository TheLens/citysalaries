function loadHighestSalaries() {
  $('.tablesorter').css({'display': 'table'});
  $('.dataTables_wrapper').css({'display': 'block'});

  // Make sure keyboard is hidden in mobile view
  $('.name-address-box').blur();

  var results = window.salaries;
  var new_rows = getRows(results, 25);

  dt.fnClearTable();
  dt.fnSettings()._iDisplayLength = page_length;
  dt.fnAddData(new_rows);
  dt.fnSort([4, 'desc']);
}

function loadNewPage() {
  var data = gatherData();
  var query_string = buildQueryString(data);// For updated search pages, not the initial load.
  window.location.href = 'search.html' + query_string;
}

function getData() {
  $.ajax({
    type: 'GET',
    url: 'https://s3-us-west-2.amazonaws.com/salaries.thelensnola.org/neworleans/data/export/highest-paid.csv',
    dataType: 'text',
    success: function(data) {
      process(data);
      dataTables();
    }
  }).then(function() {
    // loadTable();
    loadHighestSalaries();
  });
}

$(document).ready(function () {
  $(document).keypress(function (e) {
    if (e.which === 13) {
      loadNewPage();
    }
  });

  $('.search-button').on('click', function () {
    loadNewPage();
  });

  $('.show-everything').on('click', function () {
    clearAllParameters();
    loadNewPage();
  });
});
