var url = 'http://localhost:3000/pmlog';
var pmUrl = 'http://localhost:3000/pm';
var favoriteUrl = 'http://localhost:3000/favorite';
var favoriteLevelUrl = 'http://localhost:3000/favoritelevel';

var pm;
var times = [];
getPlotData(url)
window.setTimeout(function(){ getPlotData(url);
    setTurbo("k");
    setTurbo("p1");
    setTurbo("p2");
    setTurbo("p3");
}, 10000);

function getPlotData(url){
    fetch(url)
    .then((response) => response.json())
    .then(function(data){
        drawPlot(data);

    })
}
function drawPlot(data){

    var trace1 = {
        x: data.k.time,
        y: data.k.pm,
        mode: 'lines',
        name: 'kuchnia'
      };
      var trace2 = {
          x: data.p1.time,
          y: data.p1.pm,
          mode: 'lines',
          name: 'pietro 1'
        };
        var trace3 = {
                x: data.p2.time,
                y: data.p2.pm,
                mode: 'lines',
                name: 'pietro 2',
              };
              var trace4 = {
                      x: data.p3.time,
                      y: data.p3.pm,
                      mode: 'lines',
                      name: 'pietro 3',
                    };
      var layout = {
        title:'PM 2.5 against time',
        xaxis: {
            showgrid: false,
             zeroline: false
        },
        yaxis: {
        title: 'PM-2.5',
        showline: false
        },
        height: 500,
    };

      var data = [trace1, trace2, trace3, trace4];

      Plotly.newPlot('myDiv', data, layout);

}
async function getCurrentPM(device){
    var data
    await fetch(pmUrl + "/"+device)
    .then(res => res.json())
    .then(d=> data=d)
    console.log(device +" pm" + data)
    return data
}
async function getCurrentFavoriteMode(device){
    var data
    await fetch(favoriteLevelUrl+"/"+device).then(response=>response.json())
        .then(d=> data=d)
        console.log('fav',data)

    return data
}
async function setFavoriteLevel(device, level){
    var data;
    await fetch(favoriteUrl+"/"+device + "/"+level).then(response=>response.json())
        
}
function setTurbo(device){
   getCurrentPM(device)
    .then(pm => {
        if(pm>25){
            console.log(device + " greater")
                getCurrentFavoriteMode(device)
                .then(favorite=>{
                    if(favorite<10){
                        console.log(device+ 'favorite low pm high',favorite)
                        setFavoriteLevel(device, "16")
                    }
                })
        }
        if(pm<25){
            console.log("lower")
            getCurrentFavoriteMode(device)
                .then(favorite=>{
                    console.log(favorite)
                    if(favorite>8){
                        console.log('favorite high pm low',favorite)
                        setFavoriteLevel(device, "5")
                    }
                })
        }
        console.log('pm',pm)
    })
}

function openTab(evt, name) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(name).style.display = "block";
    evt.currentTarget.className += " active";
  }


