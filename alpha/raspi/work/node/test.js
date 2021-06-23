'use strict';
const Gpio = require('onoff').Gpio;
const led = new Gpio(17, 'out');
const button = new Gpio(4, 'in', 'both');
console.log(Gpio);
 
button.watch((err, value) => {
  if (err) {
    throw err;
  }
 
  led.writeSync(value);
});
 
process.on('SIGINT', _ => {
  led.unexport();
  button.unexport();
});

led.writeSync(1);
led.writeSync(0);

console.log('wait');


