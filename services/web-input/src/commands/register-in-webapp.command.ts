import { InputService } from "../services/input.service"
import { Container } from 'typedi'
/**
 * Makes an input usable in webapps
 */
export class RegisterInWebappCommand {


  protected readonly inputs = Container.get(InputService)

  public async registerDevice(address: string): Promise<void> {
    const inputs = this.inputs.listInputs()

    const device = inputs.find(i => i.address.toLowerCase() === address.toLowerCase())
    if (!device) throw new Error(`Device does not seem to be an input [${address}] ${JSON.stringify(inputs)}`)

    const handlers = device.handlers.filter(h => h.startsWith('event'))
    if (handlers.length !== 1) throw new Error(`Device does not seem to have event handler, ${JSON.stringify(handlers)}`)

    this.inputs.register(handlers[0] as `event${number}`)
  }

}