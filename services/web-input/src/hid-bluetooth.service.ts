import type { Message } from "webos-service";
import { WebOSServiceWrapper, Endpoint, WebOSService } from 'webos-service-wrapper'
import { EnsureIsSendingEventsCommand } from "./commands/ensure-is-sending-events.command";
import { InitHidsCommand } from "./commands/init-hids.command";
import { ListInputCommand } from "./commands/list-inputs.command";
import { RegisterInWebappCommand } from "./commands/register-in-webapp.command";
import { InputService } from "./services/input.service";
import { Container } from 'typedi'

@WebOSService('com.superd22.bluetoothhid.service')
export class HIDBluetoothService {

  protected readonly inputs = Container.get(InputService)

  @Endpoint('input/init')
  public async initHids(message: Message): Promise<void> {
    try {
      await new InitHidsCommand().init()
      message.respond({
        success: true
      })
    } catch (e) {
      message.respond({
        success: false,
        error: e.toString()
      })
    }
  }


  @Endpoint('input/ensure')
  public async ensureSendable(message: Message): Promise<void> {
    try {
      await new EnsureIsSendingEventsCommand().ensure(message.payload.address)
      message.respond({
        success: true
      })
    } catch (e) {
      message.respond({
        success: false,
        error: e.toString()
      })
    }
  }



  @Endpoint('input/registerWeb')
  public async registerForWeb(message: Message): Promise<void> {
    try {
      await new RegisterInWebappCommand().registerDevice(message.payload.address)
      message.respond({
        success: true
      })
    } catch (e) {
      message.respond({
        success: false,
        error: e.toString(),
        stack: e.stack
      })
    }
  }



  @Endpoint('web/keydown')
  public async listenForInputs(message: Message): Promise<void> {
    try {
      const sub = this.inputs.webBus.subscribe((data) => {
        message.respond({
          data,
        })
      })

      message.respond({
        status: 'SUBSCRIBED'
      })
    } catch (e) {

      message.respond({
        error: "could not sub",
        msg: e.toString(),
        stack: e.stack
      })
    }
  }

  @Endpoint('input/list')
  public listInputs(message: Message): void {
    try {
      const devices = new ListInputCommand().list()
      message.respond({
        devices
      })
    } catch (e) {
      message.respond({
        error: e.toString()
      })
    }
  }

}