var express = require("express");
const miio = require('miio');

var app = express();
var device = {}
var pmdata = {time: [], pm: []}

miio.device({ address: '192.168.1.119', token: '0f02950cb5b6a1968dd26e21419d077b' })
  .then(dev => {
  device = dev;
  device.on('pm2.5Changed', onPMChanged)
})
function onPMChanged(pm2_5){
  console.log(pm2_5)
  var currentDate = new Date();
  pmdata.time.push(currentDate);
  pmdata.pm.push(pm2_5);
}


app.listen(3000, () => {
 console.log("Server running on port 3000");
});

app.get("/pm", (req, res, next) => {
  device.pm2_5()
    .then(pm => res.json(pm));
});

app.get("/pmlog", (req, res, next) => {
  res.json(pmdata);
});

app.get("/temperature", (req, res, next) => {
    device.temperature()
      .then(temp => res.json(temp));
});

app.get("/humidity", (req, res, next) => {
  device.relativeHumidity().then(hum => res.json(hum));
});

app.get("/ledon", (req, res, next) => {
  device.led(true).then(res.json("turn on the lights!!!"));
});

app.get("/ledoff", (req, res, next) => {
  device.led(false).then(res.json("it's dark here"));
});

app.get('/favorite', (req, res, next) => {
    device.favoriteLevel().then(fav => res.json(fav))
});

app.get('/favorite/:level', (req, res, next) =>  {
    console.log(req.params.level)
    device.favoriteLevel(parseInt(req.params.level))
    res.json(req.params.level);
});


app.get('/pmget', (req, res, next) =>  {
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://shipit-d1d3.restdb.io/rest/pmlog",
    "method": "GET",
    "headers": {
      "content-type": "application/json",
      "x-apikey": "8d319113cf1ac247ba50e02f47470662d6e60",
      "cache-control": "no-cache"
    }
  }

  $.ajax(settings).done(function (response) {
    console.log(response);
    res.json(response);
  });
});

app.get('/pmpost', (req, res, next) => {
  var settingspost = {
    "async": true,
    "crossDomain": true,
    "url": "https://shipit-d1d3.restdb.io/rest/pmlog",
    "method": "POST",
    "headers": {
      "content-type": "application/json",
      "x-apikey": "8d319113cf1ac247ba50e02f47470662d6e60",
      "cache-control": "no-cache"
    },
    "processData": false,
    "data": JSON.stringify(pmdata)
  }

  $.ajax(settingspost).done(function (response) {
    console.log(response);
    res.json(response);

  });});
