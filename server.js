var express = require("express");
const miio = require('miio');

var app = express();
var device = {}
var pmdata = {k:{time:[],pm:[]}, p1:{time:[],pm:[]}, p2:{time:[],pm:[]}, p3:{time:[],pm:[]}}
var devices = {}

//kuchnia
miio.device({ address: '192.168.1.121', token: '603d7708a8b51a2c1f938f9c0ddfcefb' })
.then(dev => {
  devices.k = dev;
  devices.k.on('pm2.5Changed', pm2_5 => onPMChanged("k", pm2_5))
})
.catch(err => console.log("nie moze sie polaczyc z kuchnia :(( ))"))

//2 piętro
miio.device({ address: '192.168.1.120', token: '6ff244d1a5fc3faaae1ee70006199c7c' })
.then(dev => {
  devices.p2 = dev;
  devices.p2.on('pm2.5Changed', pm2_5 => onPMChanged("p2", pm2_5))
})
.catch(err => console.log("nie moze sie polaczyc z pietrem 2"))

//3 piętro
miio.device({ address: '192.168.1.123', token: 'cd96fae0bbe387064d23035dc930b623' })
  .then(dev => {
    devices.p3 = dev;
    devices.p3.on('pm2.5Changed', pm2_5 => onPMChanged("p3", pm2_5))
})
.catch(err => console.log("nie moze sie polaczyc z pietrem 3"))

//1 piętro
miio.device({ address: '192.168.1.119', token: '0f02950cb5b6a1968dd26e21419d077b' })
  .then(dev => {
    devices.p1 = dev;
    device = dev;
    devices.p1.on('pm2.5Changed', pm2_5 => onPMChanged("p1", pm2_5))
})
.catch(err => console.log("nie moze sie polaczyc z pietrem 1 :((((()))))"))


function onPMChanged(id, pm2_5){
  console.log(pm2_5)
  var currentDate = new Date();
  pmdata[id].time.push(currentDate);
  pmdata[id].pm.push(pm2_5);
}


app.listen(3000, () => {
 console.log("Server running on port 3000");
});

app.get("/pm", (req, res, next) => {
  device.pm2_5()
    .then(pm => res.json(pm));
});

app.get("/pm/:id", (req, res, next) => {
  devices[req.params.id].pm2_5()
    .then(pm => res.json(pm));
});

app.get("/pmlog", (req, res, next) => {
  res.json(pmdata);
});

app.get("/pmlog/:id", (req, res, next) => {
  res.json(pmdata[req.params.id]);
});

app.get("/temperature", (req, res, next) => {
    device.temperature()
      .then(temp => res.json(temp));
});

app.get("/temperature/:id", (req, res, next) => {
    devices[req.params.id].temperature()
      .then(temp => res.json(temp));
});

app.get("/humidity", (req, res, next) => {
  device.relativeHumidity().then(hum => res.json(hum));
});

app.get("/humidity/:id", (req, res, next) => {
  devices[req.params.id].relativeHumidity().then(hum => res.json(hum));
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

app.get('/favorite/:id/:level', (req, res, next) =>  {
    console.log(req.params.level)
    devices[req.params.id].favoriteLevel(parseInt(req.params.level))
    res.json(req.params.level);
});

app.get('/on/:id', (req, res, next) =>  {
    devices[req.params.id].setPower(true).then(res.json("it's on"))
});

app.get('/off/:id', (req, res, next) =>  {
    devices[req.params.id].setPower(false).then(res.json("it's off :()"))
});

// app.get('/pmget', (req, res, next) =>  {
//   var settings = {
//     "async": true,
//     "crossDomain": true,
//     "url": "https://shipit-d1d3.restdb.io/rest/pmlog",
//     "method": "GET",
//     "headers": {
//       "content-type": "application/json",
//       "x-apikey": "8d319113cf1ac247ba50e02f47470662d6e60",
//       "cache-control": "no-cache"
//     }
//   }
//
//   $.ajax(settings).done(function (response) {
//     console.log(response);
//     res.json(response);
//   });
// });

// app.get('/pmpost', (req, res, next) => {
//   var settingspost = {
//     "async": true,
//     "crossDomain": true,
//     "url": "https://shipit-d1d3.restdb.io/rest/pmlog",
//     "method": "POST",
//     "headers": {
//       "content-type": "application/json",
//       "x-apikey": "8d319113cf1ac247ba50e02f47470662d6e60",
//       "cache-control": "no-cache"
//     },
//     "processData": false,
//     "data": JSON.stringify(pmdata)
//   }
//
//   $.ajax(settingspost).done(function (response) {
//     console.log(response);
//     res.json(response);
//
//   });
//
// });
