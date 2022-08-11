import Service from 'webos-service';
import { readFileSync } from 'fs'
const service = new Service('com.superd22.bluetoothhid.service')


service.register('inputs/list', async (message) => {
  message.respond({
    "coucou": "hello"
  })
  try {
    const devices = readFileSync('/proc/bus/input/devices', { encoding: 'utf-8' })
    console.log(devices)
    message.respond({
      devices
    })
  } catch (e) {
    message.respond({
      error: e.toString()
    })
  }

})