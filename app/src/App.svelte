<script lang="ts">
  import SpatialNavigation from "spatial-navigation-ts";
  import DeviceCard from "./lib/DeviceCard.svelte";
  import { Modals, action } from "svelte-modals";
  import { SvelteToast } from "@zerodevx/svelte-toast";
  import type { Device } from "./lib/interfaces/bluetooth-device.interface";
  import { WebOSService } from "./lib/webos-service";
  import { catchError, tap, throwError } from "rxjs";
  import { afterUpdate } from "svelte";
  import type { Bluetooth2AdapterAwaitPairingRequestsSubscription } from "webos-typings";

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

  let devices = [
    process.env.NODE_ENV === "dev"
      ? {
          name: "Test",
          classOfDevice: 7896,
          paired: true,
        }
      : undefined,
    process.env.NODE_ENV === "dev"
      ? {
          name: "Test",
          classOfDevice: 7896,
          paired: true,
        }
      : undefined,
    process.env.NODE_ENV === "dev"
      ? {
          name: "Test",
          classOfDevice: 7896,
          paired: true,
        }
      : undefined,
    process.env.NODE_ENV === "dev"
      ? {
          name: "Test",
          classOfDevice: 7896,
          paired: true,
        }
      : undefined,
    process.env.NODE_ENV === "dev"
      ? {
          name: "Test",
          classOfDevice: 7896,
          paired: true,
        }
      : undefined,
    process.env.NODE_ENV === "dev"
      ? {
          name: "Test",
          classOfDevice: 7896,
          paired: true,
        }
      : undefined,
    process.env.NODE_ENV === "dev"
      ? {
          name: "Test",
          classOfDevice: 7896,
          paired: true,
        }
      : undefined,
    process.env.NODE_ENV === "dev"
      ? {
          name: "Test",
          classOfDevice: 7896,
          paired: true,
        }
      : undefined,
    process.env.NODE_ENV === "dev"
      ? {
          name: "Test",
          classOfDevice: 7896,
          paired: true,
        }
      : undefined,
    process.env.NODE_ENV === "dev"
      ? {
          name: "Test",
          classOfDevice: 7896,
          paired: true,
        }
      : undefined,
    process.env.NODE_ENV === "dev"
      ? {
          name: "Test",
          classOfDevice: 7896,
          paired: true,
        }
      : undefined,
    process.env.NODE_ENV === "dev"
      ? {
          name: "Test",
          classOfDevice: 7896,
          paired: true,
        }
      : undefined,
    process.env.NODE_ENV === "dev"
      ? {
          name: "Test",
          classOfDevice: 7896,
          paired: true,
        }
      : undefined,
    process.env.NODE_ENV === "dev"
      ? {
          name: "Test",
          classOfDevice: 7896,
          paired: true,
        }
      : undefined,
    process.env.NODE_ENV === "dev"
      ? {
          name: "Test",
          classOfDevice: 7896,
          paired: true,
        }
      : undefined,
    process.env.NODE_ENV === "dev"
      ? {
          name: "Test",
          classOfDevice: 7896,
          paired: true,
        }
      : undefined,
    process.env.NODE_ENV === "dev"
      ? {
          name: "Test",
          classOfDevice: 7896,
          paired: true,
        }
      : undefined,
  ].filter((d) => !!d) as Device[];

  const bluetoothService = new WebOSService("com.webos.service.bluetooth2");

  const incoming = bluetoothService
    .subscription<Bluetooth2AdapterAwaitPairingRequestsSubscription>(
      "adapter/awaitPairingRequests"
    )
    .subscribe((data) => {
      console.log("Incoming", data);
    });

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

<SvelteToast />

<Modals />

<svelte:window on:keydown={handleKeydown} />

<style>
  main {
    display: flex;
    flex-direction: column;
    width: 100vw;
    height: 100vh;
    background: #263238;
  }

  .top {
    height: 27%;
  }
  .middle {
    background: #37474f;
    height: 60%;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    overflow: hidden;
  }
</style>
