import { exec } from 'child_process'
import { Input, InputService } from "../services/input.service"
import { Container } from 'typedi'

/**
 * Makes sure a given device is sending events and that those events
 * can be read by the system
 */
export class EnsureIsSendingEventsCommand {

  protected inputs = Container.get(InputService)

  /**
   * 
   * @param address address of the device 
   */
  public async ensure(address: string) {
    if (!address) throw new Error('Device address not provided')

    const device = this.inputs.listInputs()
      .find(d => d.address.toLowerCase() === address.toLowerCase())

    if (!device) throw new Error(`Device does not seem connected`)

    const handlers = device.handlers.filter(h => h.startsWith('event'))
    if (handlers.length !== 1) throw new Error(`Device does not seem to have an event handler`)

    const devInput = `/dev/input/${handlers[0]}` as const
    // make sure input handler exists
    await this.exec(`stat ${devInput}`).catch(e => {
      throw new Error(`[${devInput}] Device event input file does not exist ${e.toString()}`)
    })

    if (process.env.NODE_ENV === 'production') {
      await this.exec(`chown root:compositor ${devInput}`)
      await this.exec(`chmod 0660 ${devInput}`)
    }

  }

  protected async findStaleHandlers(devices: Input[]): Promise<string[]> {
    const existingInputs = (await this.exec('ls /dev/input'))
      .split(/\n/)
      .filter(i => i.startsWith('event'))

    const connectedInputs = devices
      .flatMap(d => d.handlers)
      .filter(i => i.startsWith('event'))


    return existingInputs.filter(i => !connectedInputs.includes(i))
  }

  /**
   * exec a native command
   */
  protected exec(cmd: string): Promise<string> {
    return new Promise((resolve, reject) => {
      exec(cmd, (error, stdout, stderr) => {
        if (error || stderr) reject(error || stderr)
        resolve(stdout)
      })
    })
  }

  /**
   * Returns the first unsued event handler
   * @param inputs current connected inputs
   */
  protected findNextFreeHandler(inputs: Input[]): `event${number}` {
    const handlers = inputs
      .flatMap(i => i.handlers)
      .filter(h => h.startsWith('event'))
      .map(e => Number(e.replace('event', '')))
      .sort((a, b) => a - b)

    return `event${handlers[handlers.length - 1]}`
  }

}
