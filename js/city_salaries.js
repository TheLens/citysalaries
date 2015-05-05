//http://stackoverflow.com/questions/149055/how-can-i-format-numbers-as-money-in-javascript
Number.prototype.formatMoney = function(c, d, t) {
    var n = this,
        c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};


function process_request(request){

    var result = {}, key;

    var output = window.salaries; //start assuming any can be returned
    
    if (request['department']!=""){
        output = _.filter(output, function(item){ return item['department'] == request['department']; });
    }

    if (request['position']!=""){
        output = _.filter(output, function(item){ return item['position'] == request['position']; });
    }

    if (request['name']!=""){
        output = _.filter(output, function(item){ return item['first'].toUpperCase().indexOf(request['name'].toUpperCase()) != -1 || 
                                                         item['last'].toUpperCase().indexOf(request['name'].toUpperCase()) != -1 });
    }

    return output;

}


//to do: template engine
function get_row(item){
  return '<tr data-total="16" data-page="0">\
    <td class="first">' + item['first'].toUpperCase() + '</td>\
    <td class="last">' + item['last'].toUpperCase() + '</td>\
    <td class="department">' + item['department'].toUpperCase() + '</td>\
    <td class="title">'+ item['department'].toUpperCase() +'</td>\
    <td id="1" class="salary">'+ item['salary'].toUpperCase() +'</td>\
  </tr>'
}


function reformat(id) {
    var newval = "$" + (Number($(id).html()).formatMoney(2, '.', ','));
    $(id).html(newval);
}


function get_rows(results){
    output = "";
    for (var i = 0; i < results.length; i++) {
        var row = get_row(results[i]);
        output += row
    }
    return output;
}

function loadTable() {
    $("#results_status").html('');
    var name = encodeURIComponent($('#namebox').val());
    var data = {};
    data['department'] = $('#department :selected').first().text();
    data['position'] =$('#position :selected').first().text();
    data['name'] = name;
    data['page'] = 1;
    $("#tbody").html("");
    var html = $("#myTable").html();
    $("#results_status").html("Searching...");
    var results = process_request(data);
    var new_rows = get_rows(results);
    $("#tbody").html(new_rows);
    $("#myTable").trigger("update");
    $("#results_status").html(results.length + " results found");
            $.each($(".salary"), function(index, val) {
                reformat("#" + (index + 1));
    });
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
        if (e.which == 13) {
            loadTable();
        }
    });

    adjustWidth();

    $("#searchButton").on("click", function() {
        loadTable();
    });
});