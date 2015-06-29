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

function getData() {
  $.ajax({
    type: "GET",
    url: "https://s3-us-west-2.amazonaws.com/salaries.thelensnola.org/neworleans/data/export/data.csv",
    dataType: "text",
    success: function(data) {
      console.log(Date());
      process(data);
      dataTables();
      // loadHighestSalaries();
      // $(".tablesorter").css({'display': 'table'});
      // $(".dataTables_wrapper").css({'display': 'table'});
    }
  }).then(function() {
    var data = parseURL();
    populateSearchParameters(data);

    // var condition = (
    //   data['name'] !== '' ||
    //   data['department'] !== '' ||
    //   data['position'] !== ''
    // );
    // if (condition) {
    loadTable();
    // }
  });
}

function showAllResults() {
  var oSettings = dt.fnSettings();
  oSettings._iDisplayLength = -1;
  dt.fnDraw();
  $(".show-all").css({'display': 'none'});
  showHideResultsInfo();
}

$(document).ready(function () {
  getData();

  $(document).on("click", ".show-all", function() {
    showAllResults();
  });

  $(".next").on("click", function() {
    loadTable();
    var data = gatherData();
    updateUrl(data);
  });

  $(".previous").on("click", function() {
    loadTable();
    var data = gatherData();
    updateUrl(data);
  });

  $(document).keypress(function (e) {
    if (e.which === 13) {
      loadTable();
      var data = gatherData();
      updateUrl(data);
    }
  });

  $(".search-button").on("click", function () {
    loadTable();
    var data = gatherData();
    updateUrl(data);
  });

  $(".show-everything").on("click", function () {
    clearAllParameters();
    loadTable();
    var data = gatherData();
    updateUrl(data);
    showAllResults();
  });
});
