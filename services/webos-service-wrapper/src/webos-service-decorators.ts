import type { Message } from "webos-service"
import Service from "webos-service"

export function WebOSService(name: string, opts?: ServiceOptions) {
  return (constructor) => {
    const { [SERVICE_ENDPOINT_META]: endpoints } = constructor.prototype as ServiceMeta

    const impl = new constructor()
    const service = new Service(name)


    console.log("Registering endpoints", endpoints)
    const methods = endpoints?.map(e => service.register(
      e.name,
      e.fn.bind(impl),
      e.subscribable ? e.fn.bind(impl) : undefined)
    )

    console.log("adding test")

    service.register("test", (msg) => {

      msg.respond({ data: "tas" })
      setInterval(() => msg.respond({ anotherOne: 'yas' }), 1000)
    }, (cncl) => {
      cncl.respond({ cncl: "yas" })
    })

  }
}

export function Endpoint<IsSubscription extends boolean = false>(
  name: string,
  opts?: EndpointOptions<IsSubscription>
) {
  return (prototype: any, fnName: string, descriptor?: PropertyDescriptor): void => {
    if (!prototype[SERVICE_ENDPOINT_META]) prototype[SERVICE_ENDPOINT_META] = []

    prototype
    prototype[SERVICE_ENDPOINT_META].push({
      name,
      subscribable: !!opts?.subscribable,
      fn: prototype[fnName]
    })
    prototype
  }
}

const SERVICE_ENDPOINT_META = Symbol('Metadata about service endpoints')

interface ServiceMeta {
  [SERVICE_ENDPOINT_META]?: EndpointMeta[]
}

interface EndpointMeta {
  name: string,
  subscribable: boolean
  fn: (message: Message) => Promise<void> | void
}

export interface EndpointOptions<IsSubscription extends boolean = false> {
  subscribable?: IsSubscription
}

export interface ServiceOptions { }