const rpio = require('rpio');
var express = require('express')
var axios = require('axios')
var app = express()
let lastVibrationChange = 0;
let wasVibrating = false;
let startTime = 0;
const key = process.env['MAKER_KEY'] || ''
const eventName = process.env['MAKER_EVENT_NAME'] || 'dryer'
const pin = Number(process.env['PIN'])

const isVibrating = () => {
  const currentTime = new Date().getTime()
  return currentTime - lastVibrationChange < 60000
}
rpio.open(pin, rpio.INPUT, rpio.PULL_DOWN);

rpio.poll(pin, (pin) => {
  const currentState = rpio.read(pin);
  const wasVibrating = isVibrating();

  const state = currentState? 'vibrating' : 'not vibrating'
  lastVibrationChange = new Date().getTime();
}, rpio.POLL_HIGH);

setInterval(() => {
  const isVibratingNow = isVibrating()
  if (wasVibrating && !isVibratingNow) {
    console.log(`The ${eventName} has stopped ${new Date().toLocaleDateString()}`)
    const stopTime = new Date().getTime()
      axios.post(`https://maker.ifttt.com/trigger/${eventName}/with/key/${key}`, {
        value1: 'stopped',
        value2: new Date().getTime(),
        value3: stopTime - startTime
      })
      .then(function (response) {
      })
      .catch(function (error) {
        console.log(error);
      });
      wasVibrating = false

  } else if (!wasVibrating && isVibratingNow) {
    console.log(`The ${eventName} has started ${new Date().toLocaleDateString()}`)
    startTime = new Date().getTime()
      axios.post(`https://maker.ifttt.com/trigger/${eventName}/with/key/${key}`, {
        value1: 'started',
        value2: new Date().getTime()
      })
      .then(function (response) {
      })
        .catch(function (error) {
          console.log(error);
      });
    wasVibrating = true;
  }
}, 5000);

app.get('/status', function (req, res) {
  res.json({
    isVibrating: isVibrating()
  })
})

app.listen(3000)