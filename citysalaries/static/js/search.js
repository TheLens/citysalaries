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
    url: "http://salaries.thelensnola.org/neworleans/data/export/data.csv",
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

$(document).ready(function () {
  getData();

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

  $(document).keypress(function (e) {
    if (e.which === 13) {
      loadTable();
    }
  });

  $(".search-button").on("click", function () {
    loadTable();
  });
});
