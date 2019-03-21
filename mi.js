const miio = require('miio');
const pms = []
miio.device({ address: '192.168.1.119', token: '0f02950cb5b6a1968dd26e21419d077b' })
  .then(doTheMagic)
  .catch(err => console.log(err));

function doTheMagic(device){
  console.log('Connected to', device)
  device.power()
    .then(isOn => console.log('Air purifier on:', isOn))

  device.temperature()
    .then(temp => console.log('Temperature:', temp.celsius))

    device.pm2_5()
      .then(pm => console.log('PM 2.5:', pm))

    device.on('pm2.5Changed', onPMChanged)

}

function onPMChanged(pm2_5){
  console.log(pm2_5)
  pms.push(pm2_5)
}
