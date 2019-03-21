var url = 'http://localhost:3000/pmlog';
var pmUrl = 'http://localhost:3000/pm';
var favoriteUrl = 'http://localhost:3000/favorite';
var pm;
var times = [];
getPlotData(url)
window.setTimeout(function(){ getPlotData(url);
    setTurbo()
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
async function getCurrentPM(){
    var data
    await fetch(pmUrl)
    .then(res => res.json())
    .then(d=> data=d)
    console.log('pm',data)
    return data
}
async function getCurrentFavoriteMode(){
    var data
    await fetch(favoriteUrl).then(response=>response.json())
        .then(d=> data=d)
        console.log('fav',data)

    return data
}
async function setFavoriteLevel(level){
    var data;
    await fetch(favoriteUrl+level).then(response=>response.json())
        .then(d=> data=d)
     return data
}
function setTurbo(){
   getCurrentPM()
    .then(pm => {
        if(pm>25){
                getCurrentFavoriteMode()
                .then(favorite=>{
                    console.log("favorite",favorite)
                    if(favorite<10){
                        setFavoriteLevel(16).then(level=>console.log("level",level))
                    }
                })
        }
        if(pm<25){
            getCurrentFavoriteMode()
                .then(favorite=>{
                    console.log(favorite)
                    if(favorite>8){
                        setFavoriteLevel("5").then(level=>console.log(level))
                    }
                })
        }
        console.log('pm',pm)
    })
}

setTurbo()
