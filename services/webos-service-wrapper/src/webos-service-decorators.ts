import type { Message } from "webos-service"
import Service from "webos-service"

export function WebOSService(name: string, opts?: ServiceOptions) {
  return (constructor) => {
    const { [SERVICE_ENDPOINT_META]: endpoints } = constructor.prototype as ServiceMeta

    const impl = new constructor()
    const service = new Service(name)
    endpoints.forEach(e => service.register(e.name, e.fn.bind(impl)))
  }
}

export function Endpoint(name: string, opts?: EndpointOptions) {
  return (prototype: any, fnName: string, descriptor?: PropertyDescriptor): void => {
    if (!prototype[SERVICE_ENDPOINT_META]) prototype[SERVICE_ENDPOINT_META] = []

    prototype
    prototype[SERVICE_ENDPOINT_META].push({
      name,
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
  fn: (message: Message) => Promise<void> | void
}

export interface EndpointOptions { }
export interface ServiceOptions { }