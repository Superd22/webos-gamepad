<script lang="ts">
  import SpatialNavigation from "spatial-navigation-ts";
  import DeviceCard from "./lib/DeviceCard.svelte";
  import { Modals, action } from "svelte-modals";
  import type { Device } from "./lib/interfaces/bluetooth-device.interface";
  import { WebOSService } from "./lib/webos-service";
  import { catchError, tap, throwError } from "rxjs";
  import { afterUpdate } from "svelte";

  let isModalShowing: boolean = false;

  action.subscribe((a) => {
    if (a === "push") isModalShowing = true;
    else isModalShowing = false;
  });

  function handleKeydown(event: KeyboardEvent) {
    if (event.keyCode == "13") {
      event.stopImmediatePropagation();
      event.preventDefault();
      document.activeElement.click();
    }
  }

  afterUpdate(() => {
    SpatialNavigation.init();
    SpatialNavigation.add({
      selector: ".focusableArea .focusable",
    });
    SpatialNavigation.makeFocusable();
    SpatialNavigation.focus();
  });

  let devices = [{} as Device];
  const bluetoothService = new WebOSService("com.webos.service.bluetooth2");
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

  function getFilteredDevices(devices: Device[]): Device[] {
    return devices
      .sort((a, b) => a.name?.localeCompare(b?.name))
      .sort((a, b) => {
        if (a.connectedProfiles?.length && !b.connectedProfiles?.length)
          return -1;
        if (!a.connectedProfiles?.length && b.connectedProfiles?.length)
          return 1;
        else return 0;
      })
      .filter((d) => d.paired);
  }
</script>

<main class:focusableArea={!isModalShowing}>
  <div class="top" />
  <div class="middle">
    <DeviceCard device={null} />
    {#each getFilteredDevices(devices) as device}
      <DeviceCard {device} />
    {/each}
  </div>
  <div class="bottom" />
</main>

<Modals />

<svelte:window on:keydown={handleKeydown} />

<style>
  main {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 3fr 10fr 2fr;
    width: 100vw;
    height: 100vh;
    background: #263238;
  }

  .middle {
    background: #37474f;
    display: flex;
    justify-content: center;
  }
</style>
