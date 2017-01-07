function loadJSfiles() {
//head
  $('head').append(
      '<script type="text/javascript" src="https://cdn.rawgit.com/reg-cllec/reg/master/jquery.csv.js"></script>');
  // $('head').append('<script src="https://apis.google.com/js/client.js?onload=checkAuth">');
  $('head').append('<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>');
}
loadJSfiles();

function addWebElements() {
//shoulder
  $('body').append(
      '<div id="authorize-div" style="display: none"><span>Authorize access to Google Sheets API</span> <button id="authorize-button" onclick="handleAuthClick(event)"> Authorize </button> </div>');
  $('body > div.content').prepend('<br><br><div id="div_buttons"><button onclick="writeSheet()">Write Sheet</button><br></div><button onclick="readSheet()">Read Sheet</button><br><button onclick="drawCharts()">Draw Chart</button>');
}
addWebElements();


//toes

var baseURL = "https://ltx1-holdemaz02.grid.linkedin.com:8443";

var iosTitle1 = "IOS UUs Trend";
var iosTitle2 = "IOS BETA Usage";
var neptuneTitle1 = "Neptune UUs Trend";
var neptuneTitle2 = "Neptune Dogfooding Usage";
var androidTitle1 = "Public Android Beta Dogfood Users";
var androidTitle2 = "Public Android Beta ";
var emailTitle = "Dogfooding adoption weekly report";


var ios = {
  title1:iosTitle1,
  title2:"XXXXXXXXXX",
  startDate:"XXXXXXXXXX",
  endDate:"XXXXXXXXXX",
  prod:{"appVersion" : "XXXXXXXXXX", "uus" : 0},
  beta:{"appVersion" : "XXXXXXXXXX", "uus" : 0},
  versionUUS:[],
  pageUUS:[]
};
var neptune = {
  title1:neptuneTitle1,
  title2:"XXXXXXXXXX",
  startDate:"XXXXXXXXXX",
  endDate:"XXXXXXXXXX",
  pageUUS:[],
  dateUUS:[]
};
function AndroidVersion(t2,vs, pUUS) {
  this.title2 = t2;
  this.version = vs;
  this.pageUUS =pUUS;
}
var android = {
  title1:androidTitle1,
  versionUUS:[],
  versionPageUUS:[]
};
var reportTables =[];
var sheet ={
  read:false,
  write:false,
  toCell:"A3",
  text:"",
  emailTitle:"",
  values:[]
};



function getTables() {
  var links = [];
  $('a[download]').each(function (index) {
    var _link = baseURL + $(this).attr('href');
    links.push(_link);
  });
  var tables = [];
  for (var i = 0; i < links.length; i++) {
    $.ajax({
      url: links[i], type: 'GET', //dataType: 'text/csv',
      success: function (data) {
        var foo = $.csv.toArrays(data);
        tables.push(foo);
      }, error: function (jqXHR, textStatus, errorThrow) {
        alert("error:" + jqXHR.responseText);
      }, done: function (responseText) {
      }
    });
  }
  reportTables = tables;
}

function getiOSJSON() {
  // reset value
  ios = {
    title1:iosTitle1,
    title2:"XXXXXXXXXX",
    startDate:"XXXXXXXXXX",
    endDate:"XXXXXXXXXX",
    prod:{"appVersion" : "XXXXXXXXXX", "uus" : 0},
    beta:{"appVersion" : "XXXXXXXXXX", "uus" : 0},
    versionUUS:[],
    pageUUS:[]
  };
  var iV = (reportTables[0].length<10)? 0:1;
  var iP   = 1 - iV;
  ios.startDate = reportTables[iV][1][5];
  ios.endDate = reportTables[iV][1][6];

  //parse version table
  for(var i=1;i<reportTables[iV].length;i++){
    var uus = reportTables[iV][i][4];
    uus =  isNaN(uus)  ? 0: uus;
    if(reportTables[iV][i][2] == "PROD"){
      ios.prod.appVersion = reportTables[iV][i][1];
      ios.prod.uus = uus;
    }
    if(reportTables[iV][i][2] == "BETA"){
      ios.beta.appVersion = reportTables[iV][i][1];
      ios.beta.uus = uus;
    }
  }

  //pop pages table
  var pages = reportTables[iP];
  for(var j=1;j<pages.length;j++){
    var uus = parseInt(pages[j][3]);
    uus =  isNaN(uus)  ? 0: uus;
    ios.pageUUS.push([pages[j][1],uus]);
  }

  //pop title2
  var dt = ios.startDate;
  var start_date = dt.substring(4, 6) + '/' + dt.substring(6, 8) + '/' + dt.substring(0, 4);
  dt = ios.endDate;
  var end_date = dt.substring(4, 6) + '/' + dt.substring(6, 8) + '/' + dt.substring(0, 4);
  ios.title2 = iosTitle2 + " (" + start_date + " - " + end_date + ")";

  sheet.text = JSON.stringify(ios);
  sheet.write = true;
  sheet.read = false;
  sheet.toCell = "A1";
}
function getAndroidJSON() {
  //reset value
  android = {
    title1:androidTitle1,
    versionUUS:[],
    versionPageUUS:[]
  };
  var iV = (reportTables[0].length<10)? 0:1;
  var iP   = 1 - iV;

  //pop date table
  var versions = reportTables[iV];
  for(var i=1;i<versions.length;i++){
    var vs = versions[i][0].substring(0,3);
    var sd =  versions[i][2].substring(4, 6) + '/' + versions[i][2].substring(6, 8) + '/' + versions[i][2].substring(0, 4);
    var ed =  versions[i][3].substring(4, 6) + '/' + versions[i][3].substring(6, 8) + '/' + versions[i][3].substring(0, 4);
    var uus = parseInt(versions[i][1]);
    uus =  isNaN(uus)  ? 0: uus;
    var t2 = androidTitle2 + vs.toString() + " Usage (" + sd + "/" + ed + ")";

    var oVersion = new AndroidVersion(t2,vs,[]);

    //900(12/07 - 12/09)
    //Public Android Beta 900 Usage (12/07/16 - 12/09/16)
    android.versionUUS.push([vs+"("+versions[i][2].substring(4, 6) + '/' + versions[i][2].substring(6, 8) + " - "
    + versions[i][3].substring(4, 6) + '/' + versions[i][3].substring(6, 8)+")",uus]);
    android.versionPageUUS.push(oVersion);
  }

  //pop pages table
  var pages = reportTables[iP];
  for(var j=1;j<pages.length;j++){
    for(var k = 0; k < android.versionPageUUS.length;k++){
      if(pages[j][0].substring(0,3) == android.versionPageUUS[k].version){
        var uus = parseInt(pages[j][2]);
        uus =  isNaN(uus)  ? 0: uus;
        android.versionPageUUS[k].pageUUS.push([pages[j][1],uus]);
      }
    }
  }
  sheet.text = JSON.stringify(android);
  sheet.write = true;
  sheet.read = false;
  sheet.toCell = "B1";
}
function getNeptuneJSON() {
  //reset neptune
  neptune = {
    title1:neptuneTitle1,
    title2:"XXXXXXXXXX",
    startDate:"XXXXXXXXXX",
    endDate:"XXXXXXXXXX",
    pageUUS:[],
    dateUUS:[]
  };
  var iD = (reportTables[0].length<10)? 0:1;
  var iP   = 1 - iD;

  reportTables[iD].sort(function(a, b) {
    return parseInt(a[0]) - parseFloat(b[0]);
  });

  neptune.startDate = reportTables[iD][1][0];
  neptune.endDate = reportTables[iD][reportTables[iD].length-1][0];

  //pop date table
  var dates = reportTables[iD];
  for(var i=1;i<dates.length;i++){
    var uus = parseInt(dates[i][2]);
    uus =  isNaN(uus)  ? 0: uus;
    neptune.dateUUS.push([dates[i][0],uus]);
  }


  //pop pages table
  var pages = reportTables[iP];
  for(var j=1;j<pages.length;j++){
    var uus = parseInt(pages[j][2]);
    uus =  isNaN(uus)  ? 0: uus;
    neptune.pageUUS.push([pages[j][0],uus]);
  }

  //pop title2
  var dt = neptune.startDate;
  var start_date = dt.substring(4, 6) + '/' + dt.substring(6, 8) + '/' + dt.substring(0, 4);
  dt = neptune.endDate;
  var end_date = dt.substring(4, 6) + '/' + dt.substring(6, 8) + '/' + dt.substring(0, 4);
  neptune.title2 = neptuneTitle2 + " (" + start_date + " - " + end_date + ")";

  sheet.text = JSON.stringify(neptune);
  sheet.write = true;
  sheet.read = false;
  sheet.toCell = "C1";
  sheet.emailTitle = emailTitle + " (" + start_date + " - " + end_date + ")";
}


getTables();



// Your Client ID can be retrieved from your project in the Google
// Developer Console, https://console.developers.google.com
var CLIENT_ID = '771319609939-0lk2qq8qi7ebf0k8enfs82iop7ukqk5q.apps.googleusercontent.com';
var SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly", "https://www.googleapis.com/auth/spreadsheets"];

/**
 * Check if current user has authorized this application.
 */
function checkAuth() {
  gapi.auth.authorize(
      {
        'client_id': CLIENT_ID,
        'scope': SCOPES.join(' '),
        'immediate': true
      }, handleAuthResult);
}
/**
 * Handle response from authorization server.
 *
 * @param {Object} authResult Authorization result.
 */
function handleAuthResult(authResult) {
  var authorizeDiv = document.getElementById('authorize-div');
  if (authResult && !authResult.error) {
    // Hide auth UI, then load client library.
    authorizeDiv.style.display = 'none';
    loadSheetsApi();
  } else {
    // Show auth UI, allowing the user to initiate authorization by
    // clicking authorize button.
    authorizeDiv.style.display = 'inline';
  }
}

/**
 * Initiate auth flow in response to user clicking authorize button.
 *
 * @param {Event} event Button click event.
 */
function handleAuthClick(event) {
  gapi.auth.authorize(
      {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
      handleAuthResult);
  return false;
}

/**
 * Load Sheets API client library.
 */
function loadSheetsApi() {
  var discoveryUrl =
      'https://sheets.googleapis.com/$discovery/rest?version=v4';
  gapi.client.load(discoveryUrl).then(listMajors);
}

/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * https://docs.google.com/spreadsheets/d/1judnGxTSxOD6l6ImvjWo6r1qxACO0YPEyfe8R7wDXms/edit#gid=1899385777
 */
function listMajors() {
  if(sheet.write == true){
    gapi.client.sheets.spreadsheets.values.update({
      spreadsheetId: '1judnGxTSxOD6l6ImvjWo6r1qxACO0YPEyfe8R7wDXms',
      range: 'latest!'+sheet.toCell,
      valueInputOption: 'USER_ENTERED',
      values: sheet.values
    }).then(function(response) {
      console.log(response);
    });
  }

  if(sheet.read == true){
    gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: '1judnGxTSxOD6l6ImvjWo6r1qxACO0YPEyfe8R7wDXms',
      range: 'latest!A1:C2',
    }).then(function(response) {
      var range = response.result;
      if (range.values.length > 0) {
        //appendPre('Name, Major:');
        var row = range.values[0];
        ios = JSON.parse(row[0]);
        android = JSON.parse(row[1]);
        neptune = JSON.parse(row[2]);
        sheet.emailTitle=range.values[1][2];

      } else {
        alert('No data found.');
      }
    }, function(response) {
      alert('Error: ' + response.result.error.message);
    });
  }
}

//


function writeSheet(){
  if(reportTables.length==0){
    getTables();
  }
  sheet.write = true;
  sheet.read = false;
  var title = $('div.well').text();
  switch(title) {
    case "beta usage at LI adhoc":
      getiOSJSON();
      sheet.toCell = "A1";
      sheet.values=[[sheet.text]];
      break;
    case "Test Android beta usage for external users 3in1":
      getAndroidJSON();
      sheet.toCell = "B1";
      sheet.values=[[sheet.text]];
      break;
    case "Neptune usage by product page key groups":
      getNeptuneJSON();
      sheet.toCell = "C1:C2";
      sheet.values=[[sheet.text],[sheet.emailTitle]];
      break;
    default:
      return;
  }
  $('head').append('<script src="https://apis.google.com/js/client.js?onload=checkAuth">');
}


function readSheet(){
  sheet.write = false;
  sheet.read = true;
  $('head').append('<script src="https://apis.google.com/js/client.js?onload=checkAuth">');
}


function drawCharts() {
  $('body').append('<pre id="dogfood_title">Dogfooding adoption weekly report</pre>');
  $('body').append('<br><div style="font-size:12.8px"><div style="font-size:12.8px"><span style="font-size:12.8px"><b>Summary:</b></span></div><div><ul><li style="margin-left:15px"> <br></li></ul></div></div>');
  $('body').append('<br><div style="font-size:12.8px"><i style="font-size:12.8px"><span style="color:rgb(153,0,0)"><b><font size="4">IOS:&nbsp;</font></b></span></i><i style="font-size:12.8px"><span style="color:rgb(153,0,0)"><b><font size="4"><font color="#000000"><font size="2"><i>&nbsp;<a href="http://go/viBeta" target="_blank" data-saferedirecturl="https://www.google.com/url?hl=en&amp;q=http://go/viBeta&amp;source=gmail&amp;ust=1483813111180000&amp;usg=AFQjCNF6fM9B6wZPah3CqwDikeLkvmxDSw">http://go/viBeta</a></i></font></font></font></b></span></i><br></div>');
  $('body').append('<div id="ios_line" style="width: 1000px; height: 700px;"></div>');
  $('body').append('<div id="ios_pie" style="width: 1000px; height: 700px;"></div>');
  $('body').append('<div style="font-size:12.8px"><i style="font-size:large"><span style="color:rgb(153,0,0)"><b>Android:&nbsp;<span style="color:rgb(255,255,255)"><font size="2"><a href="http://go/vaBeta" target="_blank" data-saferedirecturl="https://www.google.com/url?hl=en&amp;q=http://go/vaBeta&amp;source=gmail&amp;ust=1483813111180000&amp;usg=AFQjCNFowO9_2NT6-5dq2m1ERlaVFkhFUQ">http://go/vaBeta</a></font></span></b></span></i><br></div>');
  $('body').append('<div id="android_bar" style="width: 1000px; height: 700px;"></div>');
  $('body').append('<div id="android_pie1" style="width: 1000px; height: 700px;"></div>');
  $('body').append('<div id="android_pie2" style="width: 1000px; height: 700px;"></div>');
  $('body').append('<div id="android_pie3" style="width: 1000px; height: 700px;"></div>');
  $('body').append('<div><font size="4" color="#990000"><b><i><div style="display:inline-block"></div>Neptune</i></b></font></div>');
  $('body').append('<div id="neptune_line" style="width: 1000px; height: 700px;"></div>');
  $('body').append('<div id="neptune_pie" style="width: 1000px; height: 700px;"></div><br>');

  $("#dogfood_title").text(sheet.emailTitle);
  google.charts.load('current', {packages: ['corechart', 'line', 'bar']});
  google.charts.setOnLoadCallback(drawIOSLine);
  google.charts.setOnLoadCallback(drawIOSPie);
  google.charts.setOnLoadCallback(drawAndroidPie);
  google.charts.setOnLoadCallback(drawNeptunePie);
  google.charts.setOnLoadCallback(drawNeptuneLine);
  google.charts.setOnLoadCallback(drawAndroidColumn);
}

function drawAndroidColumn() {

  android.versionUUS.unshift(['version','uus']);
  var data = google.visualization.arrayToDataTable(android.versionUUS);
  //
  // var data = new google.visualization.arrayToDataTable([
  //   ['version', 'uus'],
  //   ['900(12/07 - 12/09)', 2208],
  //   ['901(12/09 - 12/12)', 2350],
  //   ['902(12/12 - 12/13)', 1406]
  // ]);

  var options = {
    title: android.title1,
    legend: { position: 'none' },
    chart: { subtitle: 'popularity by percentage' },
    axes: {
      x: {
        0: { side: 'bottom'} // Top x-axis.
      }
    },
    bar: { groupWidth: "90%" }
  };
  options = google.charts.Bar.convertOptions(options)



  //var chart = new google.charts.Bar(document.getElementById('android_bar'));
  // // Convert the Classic options to Material options.
  // chart.draw(data, options);

  var chart_div = document.getElementById('android_bar');
  var chart = new google.visualization.ColumnChart(chart_div);


  google.visualization.events.addListener(chart, 'ready', function () {
    chart_div.innerHTML = '<img src="' + chart.getImageURI() + '">';
    console.log(chart_div.innerHTML);

  });
  chart.draw(data, options);

}
function drawNeptuneLine() {
  var data = new google.visualization.DataTable();
  data.addColumn('date', 'label');
  data.addColumn('number', 'UUs');

  for (var j = 0; j < neptune.dateUUS.length; j++) {

    var dt = neptune.dateUUS[j][0];
    data.addRow(
        [new Date(parseInt(dt.substring(0, 4)), parseInt(dt.substring(4, 6)) - 1, parseInt(dt.substring(6, 8))), neptune.dateUUS[j][1]]);

  }
  var options = {
    title: neptune.title2,
    legend: 'none',
    hAxis: {
      format: 'M/d/yy',
      gridlines: {count: 15}
    }
  };
  var chart_div = document.getElementById('neptune_line');
  var chart = new google.visualization.LineChart(chart_div);

  google.visualization.events.addListener(chart, 'ready', function () {
    chart_div.innerHTML = '<img src="' + chart.getImageURI() + '">';
    console.log(chart_div.innerHTML);
  });

  chart.draw(data, options);
}
function drawIOSPie() {
  drawChart(ios.pageUUS,12,"ios_pie",ios.title2);
}
function drawAndroidPie() {
  for(var i = 0;i<android.versionPageUUS.length;i++){
    drawChart(android.versionPageUUS[i].pageUUS,12,"android_pie"+(i+1).toString(),android.versionPageUUS[i].title2);
  }
}
function drawNeptunePie() {
  drawChart(neptune.pageUUS,10,"neptune_pie",neptune.title2);
}
function drawIOSLine() {
  var data = new google.visualization.DataTable();
  data.addColumn('date', 'label');
  data.addColumn('number', 'UUs');
  data.addRows([
    [new Date(2016, 11, 1),5459],
    [new Date(2016, 11, 2),4736],
    [new Date(2016, 11, 3),1150],
    [new Date(2016, 11, 4),2069],
    [new Date(2016, 11, 5),5684],
    [new Date(2016, 11, 6),5625],
    [new Date(2016, 11, 7),5615]
  ]);
  var options = {
    title: 'Neptune UUs Trend',
    legend: 'none',
    hAxis: {
      format: 'M/d/yy',
      gridlines: {count: 15}
    }
  };

  var chart = new google.visualization.LineChart(document.getElementById('ios_line'));

  chart.draw(data, options);
}

function drawChart(arr,topI,element,title) {
  var others = 0;
  for(var j = topI; j < arr.length; j++){
    others +=arr[j][1];
  }

  var bar = arr.slice(0,topI);
  bar.push(['others',others]);
  bar.unshift(['task','hours']);
  var data = google.visualization.arrayToDataTable(bar);
  var options = {
    title: title,
    legend: 'labeled'
  };
  var chart_div = document.getElementById(element);
  var chart = new google.visualization.PieChart(chart_div);

  google.visualization.events.addListener(chart, 'ready', function () {
    chart_div.innerHTML = '<img src="' + chart.getImageURI() + '">';
    console.log(chart_div.innerHTML);
  });

  chart.draw(data, options);
}
