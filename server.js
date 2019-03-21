var express = require("express");
const miio = require('miio');

var app = express();
var device = {}
var pmdata = []

miio.device({ address: '192.168.1.119', token: '0f02950cb5b6a1968dd26e21419d077b' })
  .then(dev => {
  device = dev;
  device.on('pm2.5Changed', onPMChanged)
})
function onPMChanged(pm2_5){
  console.log(pm2_5)
  var currentDate = new Date();
  pmdata.push({time: currentDate, pm: pm2_5})
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
