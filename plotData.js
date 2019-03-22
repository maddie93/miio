var addres = "http://192.168.1.114:3000";
var url = addres+'/pmlog';
var pmUrl = addres+'/pm';
var favoriteUrl = addres+'/favorite';
var favoriteLevelUrl = addres+'/favoritelevel';
var temperatureUrl = addres+'/temperature';
var humidityUrl = addres+'/humidity';
var ledonUrl = addres+'/ledon';
var ledoffUrl = addres+'/ledoff';

var isOnUrl = addres+'/ison';
var onUrl = addres+'/on';
var offUrl = addres+'/off';

var modeUrl = addres+'/mode'




var pm;
var times = [];
getPlotData(url)
window.setInterval(function(){
    setTurbo("k");
    setTurbo("p1");
    setTurbo("p2");
    setTurbo("p3");
    getPlotData(url);
}, 10000);

function getPlotData(url){
    console.log("Getting data for plot"+ url)
    fetch(url)
    .then((response) => response.json())
    .then(function(data){
        console.log("drawing")
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

async function getTemperature(device){
    var data
    await fetch(temperatureUrl+"/"+device).then(response=>response.json())
        .then(d=> data=d)
        console.log('temperature',data)

    return data
}
async function getHumidity(device){
    var data
    await fetch(humidityUrl+"/"+device).then(response=>response.json())
        .then(d=> data=d)
        console.log('humidity',data)

    return data
}
async function getMode(device){
    var data
    await fetch(modeUrl+"/"+device).then(response=>response.json())
        .then(d=> data=d)
        console.log('mode',data)

    return data

}

async function isOn(device){
    var data
    await fetch(isOnUrl+"/"+device).then(response=>response.json())
        .then(d=> data=d)
        console.log('is on',data)

    return data

}

async function setFavoriteLevel(device, level){
    var data;
    await fetch(favoriteUrl+"/"+device + "/"+level).then(response=>response.json())

}

async function setLedOn(device){
    await fetch(ledonUrl+"/"+device).then(response=>response.json());
}
async function setLedOff(device){
    await fetch(ledoffUrl+"/"+device).then(response=>response.json());
}
async function turnOff(device){
    await fetch(offUrl+"/"+device).then(response=>response.json());
}
async function turnOn(device){
    await fetch(onUrl+"/"+device).then(response=>response.json());

}
function setTurbo(device){
   console.log("running set turbo")
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
    setDataInTab(name);
  }

function setDataInTab(name){
        tabContent = document.getElementById(name)


        if(tabContent.children.length<=1){
            spanPm = document.createElement("span")
            spanPm.id = "pmData";
            labelPm =  document.createElement("label")
            labelPm.textContent="PM 2.5: ";

            spanFav = document.createElement("span")
            labelFav =  document.createElement("label")
            labelFav.textContent="Favorite level: ";

            spanTemp = document.createElement("span")
            labelTemp =  document.createElement("label")
            labelTemp.textContent="Temperature: ";

            spanHum = document.createElement("span")
            labelHum =  document.createElement("label")
            labelHum.textContent="Humidity: ";

            spanMode = document.createElement("span")
            labelMode=  document.createElement("label")
            labelMode.textContent="Mode: ";

            div = document.createElement("div");

            buttonLed= document.createElement("button")
            buttonLed.onclick=function(){setLedOn(name)}
            buttonLed.textContent= "Turn Led on"
            buttonLedOff= document.createElement("button")
            buttonLedOff.onclick=function(){setLedOff(name)}
            buttonLedOff.textContent= "Turn Led off"

            buttonOn= document.createElement("button")
            buttonOn.onclick=function(){
                turnOn(name)
                document.getElementById(name).children[0].children[0].className = "dot green"
            }
            buttonOn.textContent= "Turn on"

            buttonOff= document.createElement("button")
            buttonOff.onclick=function(){
                turnOff(name)
                document.getElementById(name).children[0].children[0].className = "dot red"
            }
            buttonOff.textContent= "Turn off"

            div.appendChild(buttonLed)
            div.appendChild(buttonLedOff)
            div.appendChild(buttonOff)
            div.appendChild(buttonOn)

            tabContent.appendChild(labelPm)
            tabContent.appendChild(spanPm)
            tabContent.appendChild(labelFav)
            tabContent.appendChild(spanFav)
            tabContent.appendChild(labelTemp)
            tabContent.appendChild(spanTemp)
            tabContent.appendChild(labelHum)
            tabContent.appendChild(spanHum)
            tabContent.appendChild(labelMode)
            tabContent.appendChild(spanMode)
            tabContent.appendChild(div)






        }
         ////////////////////////////////////////PM/////////////////////////////////////////////////////////////
        getCurrentPM(name).then(pm=>{
            spanPm.textContent=pm + " micrograms"

        })

         ////////////////////////////////////////Favorite level/////////////////////////////////////////////////////////////

         getCurrentFavoriteMode(name).then(fav=>{
             spanFav.textContent="Level: "+ fav
         })

         ////////////////////////////////////////Temperature/////////////////////////////////////////////////////////////
         getTemperature(name).then(temp=>{
             spanTemp.textContent= temp.value +" " +temp.unit + " degrees";
         }

         )

          ////////////////////////////////////////Humidity/////////////////////////////////////////////////////////////
         getHumidity(name).then(hum=>{
            spanHum.textContent= hum + " %";
         })
                   ////////////////////////////////////////Mode/////////////////////////////////////////////////////////////
        getMode(name).then(mode=>{
            spanMode.textContent= mode ;
         })

         isOn(name).then(on => {
           document.getElementById(name).children[0].children[0].className = on ? "dot green" : "dot red";
         })

  }
