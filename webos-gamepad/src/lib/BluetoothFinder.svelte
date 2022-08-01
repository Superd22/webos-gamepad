<script lang="ts">
  import "@procot/webostv";
  import { tap, catchError, filter } from "rxjs/operators";
  import { WebOSService } from "./webos-service";
  import { Observable, throwError } from "rxjs";
  import type { Device } from "./interfaces/bluetooth-device.interface";
  const bluetoothService = new WebOSService("com.webos.service.bluetooth2");

  let devices: Device[] = [];
  const request = bluetoothService
    .subscription("device/getStatus")
    .pipe(
      tap((data) => {
        console.log(data["devices"]);
        devices = data["devices"];
      }),
      catchError((error) => {
        console.error("oh no", error);
        return throwError(() => error);
      })
    )
    .subscribe();

  async function search() {
    const issEarching = await bluetoothService.request(
      "adapter/startDiscovery"
    );
  }
</script>

<div class="finder">
  <button on:click={search} class="focusable">Click to search</button>

  <ul>
    {#each devices.filter(d => !!d.name) as device}
      <li>{device.name}</li>
    {/each}
  </ul>
</div>
