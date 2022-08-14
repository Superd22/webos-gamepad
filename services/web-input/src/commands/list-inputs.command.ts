import { Input, InputService } from '../services/input.service'
import { Container } from 'typedi'

/**
 * List all the inputs currently connected through /proc/bus/input/devices
 */
export class ListInputCommand {

  protected inputs = Container.get(InputService)

  public list(): Input[] {
    return this.inputs.listInputs()
  }

}