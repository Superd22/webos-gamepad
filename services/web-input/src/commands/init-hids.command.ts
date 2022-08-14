import { exec } from 'child_process'
import { Input, InputService } from "../services/input.service";
import { Container } from 'typedi'

/**
 * Action to be executed once on startup to ensure we're ready to connect to new HIDs
 */
export class InitHidsCommand {

  protected readonly inputs = Container.get(InputService)

  public async init() {
    const devices = this.inputs.listInputs()
    const disconnectedInputs = await this.findStaleHandlers(devices)

    if (process.env.NODE_ENV === 'production') {
      /**
       * Maybe one day this will break something, but it's nothing
       * that can't be solved by a simple reboot of the T.V
       * 
       * Basically sometimes bluetooth2.hid can't reconnect because an input is stale
       * This ensures that it isn't
       */
      await this.exec(`rm -rf ${disconnectedInputs.map(d => `/dev/input/${d}`).join(" ")}`)
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
