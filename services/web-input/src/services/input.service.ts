import { readFileSync } from 'fs'
import { Service } from 'typedi';
import InputEvent from 'input-event'
import { Observable, Subject } from 'rxjs';

@Service()
export class InputService {

  protected readonly listenedEvents: InputEvent[] = []

  public readonly webBus: Subject<any> = new Subject()

  public register(eventInput: `event${number}`): void {
    const input = new InputEvent.Keyboard(`/dev/input/${eventInput}`)

    input?.on('raw', (data) => {
      // @todo map to keyboard
      this.webBus?.next(data)
    })
    input?.on('data', (data) => {
      this.webBus?.next(data)
    })
  }

  public listInputs(): Input[] {
    const raw = readFileSync('/proc/bus/input/devices', { encoding: 'utf-8' })

    return raw
      .split('\n\n')
      .map(rawDevice => {
        const lines = rawDevice.split('\n')
        if (lines.length < 3) return

        const name = lines.find(l => l.startsWith('N:'))?.match(/Name="(.*)"/)[1]
        const address = lines.find(l => l.startsWith('P:'))?.match(/Phys=(.*)/)[1]
        const handlers = lines.find(l => l.startsWith('H:'))?.split('=')[1].split(' ').filter(h => !!h)

        return {
          name,
          address,
          handlers
        }
      }).filter(d => !!d)
  }

}


export interface Input {
  name: string,
  address: string
  handlers: string[]
}