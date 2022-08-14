import type Webos from '@procot/webostv'
import type Service from 'webos-service'
import { Observable } from 'rxjs';

/**
 * Helper class to call a webos service throug LUNA.
 * Works both in web-apps and in node, using either webOSTV or webos-service
 */
export class WebOSServiceWrapper {

  protected implementation!: Service | WebOSTV.WebOS['service']

  protected isWeb!: boolean

  constructor(
    public readonly serviceName: string
  ) {
    if (webOS && webOS.service) {
      try {
        this.implementation = webOS.service
        this.isWeb = true
      } catch (e) {

      }
    } else {
      try {
        const ServiceImpl: typeof Service = require('webos-service')
        this.implementation = new ServiceImpl('luna://' + serviceName)
        this.isWeb = false
      } catch (e) {
        console.log('agrougrougrou', e)
      }
    }

    // @todo don't throw in dev env
    throw new Error('Could not find window.webOS nor webos-service')
  }

  /**
   * Makes a one shot request to the given endpoint
   * @param endpoint endpoint in this service to send to
   * @param parameters parameters to send to the endpoint
   */
  public async request<Data = any>(endpoint: string, parameters?: Record<string, any>): Promise<Data> {
    return this.makeRequest(endpoint, parameters)
  }

  /**
   * Triggers a subscription to the given endpoint
   * @param endpoint endpoint in this service to subscribe to
   * @param parameters 
   * @returns 
   */
  public subscription<Data = any>(endpoint: string, parameters?: Record<string, any>): Observable<Data> {
    return this.makeRequest(endpoint, parameters, true)
  }


  protected makeRequest<T = any>(
    endpoint: string,
    parameters: Record<any, any>,
    subscribe: true,
  ): Observable<T>
  protected makeRequest<T = any>(
    endpoint: string,
    parameters: Record<any, any>,
  ): Promise<T>
  protected makeRequest<T = any>(
    endpoint: string,
    parameters: Record<any, any>,
    subscribe?: boolean,
  ): Promise<T> | Observable<T> {
    if (this.isWeb) {
      const impl = this.implementation as WebOSTV.WebOS['service']

      if (subscribe) {
        return new Observable((subscriber) => {
          const original = impl.request(`luna://${this.serviceName}`, {
            method: endpoint,
            parameters,
            subscribe: true,
            resubscribe: false,
            onSuccess: (success) => {
              subscriber.next(success as any)
            },
            onFailure: (error) => {
              subscriber.error(error)
              subscriber.complete()
            }
          })

          subscriber.add(() => {
            original.cancel()
          })
        })
      } else {
        return new Promise((resolve, reject) => {
          webOS.service.request(`luna://${this.serviceName}`, {
            method: endpoint,
            parameters,
            subscribe: false,
            resubscribe: false,
            onSuccess: (success) => {
              resolve(success as any)
            },
            onFailure: (error) => {
              reject(error)
            }
          })
        })
      }
    }
    else {
      const impl = this.implementation as Service

      if (subscribe) {
        return new Observable((subscriber) => {
          const original = impl.subscribe(`luna://${this.serviceName}/${endpoint}`, parameters)

          original.on('response', (data) => subscriber.next(data))
          original.on('cancel', (data) => {
            if (data) subscriber.next(data)
            subscriber.complete()
          })

          subscriber.add(() => {
            original.cancel()
          })
        })
      } else {
        return new Promise<T>((resolve, reject) => {
          const original = impl.call(`luna://${this.serviceName}/${endpoint}`, parameters, (message) => {
            resolve(message as any as T)
          })
        })
      }
    }
  }
}