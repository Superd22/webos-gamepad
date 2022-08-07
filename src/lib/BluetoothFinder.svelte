<script lang="ts">
  import "@procot/webostv";
  import { tap, catchError, filter } from "rxjs/operators";
  import { WebOSService } from "./webos-service";
  import { Observable, throwError } from "rxjs";
  import type { Device } from "./interfaces/bluetooth-device.interface";
  const bluetoothService = new WebOSService("com.webos.service.bluetooth2");
  import type {
    Bluetooth2AdapterStartDiscoveryCallReturn,
    Bluetooth2DeviceGetStatusSubscription,
  } from "webos-typings";

  let devices: Device[] = [];
  // test
  const request = bluetoothService
    .subscription<Bluetooth2DeviceGetStatusSubscription>("device/getStatus")
    .pipe(
      tap((data) => {
        console.log(data["devices"]);
        devices = data["devices"] as any;
      }),
      catchError((error) => {
        console.error("oh no", error);
        return throwError(() => error);
      })
    )
    .subscribe();

  async function search() {
    const issEarching =
      await bluetoothService.request<Bluetooth2AdapterStartDiscoveryCallReturn>(
        "adapter/startDiscovery"
      );
  }
</script>

<div class="finder">
  <button on:click={search} class="focusable">Click to search</button>

  <ul>
    {#each devices.filter((d) => !!d.name) as device}
      <li>{device.name}</li>
    {/each}
  </ul>
</div>
