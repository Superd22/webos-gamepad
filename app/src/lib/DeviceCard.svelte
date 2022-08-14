<script lang="ts">
  import type { Device } from "./interfaces/bluetooth-device.interface";
  import PlusThick from "svelte-material-icons/PlusThick.svelte";
  import Gamepad from "svelte-material-icons/GoogleController.svelte";
  import { openModal } from "svelte-modals";
  import DeviceFinder from "./DeviceFinder.svelte";
  import SpatialNavigation from "spatial-navigation-ts";
  import DeviceIcon from "./DeviceIcon.svelte";
  import { catchError, Observable, of } from "rxjs";
  import { toast } from "@zerodevx/svelte-toast";
  import type { Bluetooth2AdapterPairSubscription } from "webos-typings";
  import { onMount } from "svelte";
  import { WebOSService } from "./webos-service";

  export let device: Device;
  let showMenu: boolean = false;
  let menu;
  let card;
  const bluetoothService = new WebOSService("com.webos.service.bluetooth2");

  let status: { connected: boolean; connecting: boolean } = {
    connected: false,
    connecting: false,
  };

  onMount(() => {
    if (!device) return;
    bluetoothService
      .subscription("hid/getStatus", { address: device.address })
      .subscribe((data) => {
        status = data;
      });
  });

  function pairNewDevice() {
    openModal(DeviceFinder);
  }

  function toggleMenu(event: MouseEvent) {
    event.stopImmediatePropagation();
    event.preventDefault();
    showMenu = !showMenu;
    setTimeout(() => {
      menu.focus();
    });
  }

  function focusOut(
    event: FocusEvent & {
      currentTarget: EventTarget & HTMLDivElement;
    }
  ) {
    setTimeout(() => {
      if (
        card.contains(document.activeElement) === true ||
        document.activeElement.tagName.toLowerCase() === "body"
      ) {
        event.stopImmediatePropagation();
        return;
      }
      showMenu = false;
    });
  }

  async function toggleConnect(event?: MouseEvent) {
    event?.stopImmediatePropagation();
    if (device.connectedProfiles?.includes("hid")) {
      await bluetoothService.request("hid/disconnect", {
        address: device.address,
      });
    } else {
      const co = bluetoothService
        .subscription("hid/connect", {
          address: device.address,
        })
        .pipe(catchError((error) => of(error)))
        .subscribe(async (data) => {
          if (data.errorCode) {
            toast.push(data.errorText);
          }

          if (data.returnValue) {
          }

          console.log("Connecting", data);
        });
    }
  }

  async function unpair(event: MouseEvent) {
    event.stopImmediatePropagation();
    await bluetoothService.request("adapter/unpair", {
      address: device.address,
    });
  }
</script>

<div
  class="device-card"
  class:focusable={!showMenu}
  class:empty={!device}
  class:connected={device?.connectedProfiles?.length > 0}
  tabindex={showMenu ? -1 : 0}
  on:focusout={focusOut}
  on:click={(event) => (!device ? pairNewDevice(event) : toggleMenu(event))}
  bind:this={card}
>
  {#if device}
    <div class="overlay" />
    <div class="title">{device.name}</div>

    <div class="icon">
      <DeviceIcon {device} />
    </div>

    <div class="details" />
  {:else}
    <div class="add">
      <PlusThick />
    </div>
  {/if}

  {#if showMenu}
    <div class="menu">
      <button
        tabindex="0"
        class="focusable"
        on:click={toggleConnect}
        bind:this={menu}
      >
        {status.connected
          ? "Disconnect"
          : status.connecting
          ? "Connecting"
          : "Connect"}
        {#if status.connecting}<span />{/if}
      </button>

      <button tabindex="0" class="focusable" on:click={unpair}>Unpair</button>
    </div>
  {/if}
</div>

<style lang="scss">
  .device-card {
    background-color: rgb(196, 196, 196);
    border: 5px solid black;
    color: #213547;
    padding: 12px;
    width: 188px - 12px * 2;
    display: flex;
    height: 340px;
    margin: 32px;
    opacity: 0.5;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;

    .title {
      font-size: 19px;
    }
    .icon {
      font-size: 5em;
    }

    &.connected {
      opacity: 1;
    }

    &.empty {
      background-color: rgb(38 50 56);
      border: 5px solid rgb(30 38 43);
      opacity: 1;
      color: #eee;
      .add {
        position: relative;
        display: flex;
        color: #eee;
        width: 100%;
        height: 100%;
        align-items: center;
        justify-content: center;
        font-size: 4em;
      }
    }

    .menu {
      position: absolute;
      top: 0px;
      left: 0px;
      background: rgba(0, 0, 0, 0.9);
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;

      button {
        margin: 10px 5px;
        background: rgba(255, 255, 255, 0.5);
        span {
          &:after {
            overflow: hidden;
            display: inline-block;
            vertical-align: bottom;
            -webkit-animation: ellipsis steps(4, end) 3000ms infinite;
            animation: ellipsis steps(4, end) 3000ms infinite;
            content: "\2026"; /* ascii code for the ellipsis character */
            width: 0px;
            position: absolute;
          }
        }
      }
    }
  }

  @keyframes ellipsis {
    to {
      width: 1.25em;
    }
  }

  @-webkit-keyframes ellipsis {
    to {
      width: 1.25em;
    }
  }
</style>
