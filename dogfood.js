function addElement() {
  $('head').append('<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>');
  $('div.container').append('<div id="chart_buttons"></div>');
  $('#chart_buttons').append('<button onclick="neptune()">Neptune</button>');
  $('#chart_buttons').append('<button onclick="android()">android</button>');
  $('#chart_buttons').append('<button onclick="ios()">ios</button>');
}
function neptune(){
  $('div.container').append('<div id="piechart" style="width: 900px; height: 500px;"></div>');
  $('div.container').append('<div id="chart_div" style="width: 900px; height: 500px;"></div>');
  var pieTable = document.getElementsByClassName('table table-bordered table-striped')[0];
  var lineTable = document.getElementsByClassName('table table-bordered table-striped')[1];

  var pLength = pieTable.rows.length;
  var lLength = lineTable.rows.length;

  var pages =[];
  var days =[];
  for (i = 1; i < pLength; i++){
    var pCells = pieTable.rows.item(i).cells;
    pages.push([pCells.item(0).innerHTML, parseInt(pCells.item(2).innerHTML)]);
  }
  for (i = 1; i < lLength; i++){
    var lCells = lineTable.rows.item(i).cells;
    days.push([lCells.item(0).innerHTML, parseInt(lCells.item(2).innerHTML)]);
  }
  pages.sort(function(a, b) {
    return parseInt(a[1]) - parseFloat(b[1]);
  });

  google.charts.load('current', {packages: ['corechart', 'line']});
  google.charts.setOnLoadCallback(drawBasic);

  var start_date;
  var end_date;
  function drawBasic() {
    var data = new google.visualization.DataTable();
    data.addColumn('date', 'label');
    data.addColumn('number', 'UUs');
    for (var j = 0; j < days.length; j++) {

      var dt = days[j][0];
      data.addRow(
          [new Date(parseInt(dt.substring(0, 4)), parseInt(dt.substring(4, 6)) - 1, parseInt(dt.substring(6, 8))), days[j][1]]);
      var options = {
        title: 'Neptune UUs Trend', legend: 'none',

        hAxis: {
          format: 'M/d/yy', gridlines: {count: 15}
        }
      };
      var chart_div = document.getElementById('chart_div');
      var chart = new google.visualization.LineChart(chart_div);

      google.visualization.events.addListener(chart, 'ready', function () {
        chart_div.innerHTML = '<img src="' + chart.getImageURI() + '">';
        console.log(chart_div.innerHTML);
      });

      chart.draw(data, options);
    }
  }

  google.charts.load('current', {'packages':['corechart']});
  google.charts.setOnLoadCallback(drawChart);
  function drawChart() {
    var others = 0;
    for(var j = 0; j < 5; j++){
      others +=pages[j][1];
    }

    var bar = pages.slice(5,15);
    bar.push(['others',others]);
    bar.unshift(['task','hours']);
    var data = google.visualization.arrayToDataTable(bar);
    var options = {
      title: 'Neptune Dogfooding Usage (12/01/2016 - 12/07/2016)',
      legend: 'labeled'
    };
    var chart_div = document.getElementById('piechart');
    var chart = new google.visualization.PieChart(chart_div);

    google.visualization.events.addListener(chart, 'ready', function () {
      chart_div.innerHTML = '<img src="' + chart.getImageURI() + '">';
      console.log(chart_div.innerHTML);
    });

    chart.draw(data, options);
  }
}
