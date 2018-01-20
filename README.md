# Node Washer Dryer Monitor

* IFTTT triggers when appliances begin or end their cycles based on https://github.com/Shmoopty/rpi-appliance-monitor

* Creates a webserver to monitor the status of the appliance at  `localhost:3000/status`
## Install

```
npm install
export MAKER_EVENT_NAME=YOUR_MAKER_EVENT_NAME
export MAKER_KEY=YOUR_MAKER_KEY
export PIN=YOUR_GPIO_PIN
node index.js
```

## Todo

- [ ] integrate with google home to get status
- [ ] make port configurable
- [ ] support other types of alerts
