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


function reformat(id) {
    var newval = "$" + (Number($(id).html()).formatMoney(2, '.', ','));
    $(id).html(newval);
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
    results = process_request(data);
    if (results.length == 0){
        $("#results_status").html(s);
    }
/**    $.post("citysalaries/search", request, function(s) {
//        if (s == "No results found") {
//           $("#results_status").html(s);
//        } else {
            $("#myTable").tablesorter();
            $("#tbody").html(s);
            // let the plugin know that we made a update 
            $("#myTable").trigger("update");
            var found;
            if ($(window).width() > 500) {
                found = $("#tbody tr").first().attr("data-total");
            } else {
                found = $("#tbody .tablerow").length;
            }

            $("#results_status").html(found + " results found");
            $.each($(".salary"), function(index, val) {
                reformat("#" + (index + 1));
            });
            var tblwidth = $("#myTable").width();
            var rowidth = $($(".row")[0]).width();
        }
    });
**/
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