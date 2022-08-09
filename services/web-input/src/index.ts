import Service from 'webos-service';
import { promises as fs } from 'fs'
const service = new Service('com.superd22.bluetooth-hid.service')


service.register('inputs/list', async (message) => {
  const devices = await fs.readFile('/proc/bus/input/devices', { encoding: 'utf-8' })

  console.log(devices)

})

service.call('/inputs/list', {}, (esh) => console.log("got answwer", esh))