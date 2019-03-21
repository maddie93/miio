const miio = require('miio');

miio.device({ address: '192.168.1.119', token: '0f02950cb5b6a1968dd26e21419d077b' })
  .then(device => console.log('Connected to', device))
  .catch(err => console.log(err));
