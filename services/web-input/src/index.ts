import Service from 'webos-service';
import { readFileSync } from 'fs'
const service = new Service('com.superd22.bluetoothhid.service')


service.register('inputs/list', async (message) => {
  try {
    const devices = readFileSync('/proc/bus/input/devices', { encoding: 'utf-8' })
    message.respond({
      devices
    })
  } catch (e) {
    message.respond({
      error: e.toString()
    })
  }
})