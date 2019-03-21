var url = 'http://localhost:3000/pmlog';
var pmUrl = 'http://localhost:3000/pm';
var favoriteUrl = 'http://localhost:3000/favorite';
var pm;
var times = []; 
fetch(url)
    .then((response) => response.json())
    .then(function(data){ 
            
        drawPlot(data.pm, data.times)
        
    })

function drawPlot(pm, time){
    var trace1 = {
        x: time,
        y: pm,
        mode: 'lines',
        name: 'PM',
        line: {
        color: 'rgb(219, 64, 82)',
        width: 3
        }
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
      
      var data = [trace1];
      
      Plotly.newPlot('myDiv', data, layout);

}
var obj
function setTurbo(){
   fetch(pmUrl)
    .then(res => res.json())
    .then(pm => {
        if(pm>25){
            fetch(favoriteUrl).then(response=>response.json())
                .then(favorite=>{
                    console.log("favorite",favorite)
                    if(favorite<10){
                        fetch(favoriteUrl+"/16").then(response=>response.json()).then(level=>console.log("level",level))
                    }
                })
        }
        if(pm<25){
            fetch(favoriteUrl).then(response=>response.json())
                .then(favorite=>{
                    console.log(favorite)
                    if(favorite>8){
                        fetch(favoriteUrl+"/5").then(response=>response.json()).then(level=>console.log(level))
                    }
                })
        }
        console.log('pm',pm)
    })
}

setTurbo()
