<script lang="ts">
  import type { Device } from "./interfaces/bluetooth-device.interface";
  import PlusThick from "svelte-material-icons/PlusThick.svelte";
  import Gamepad from "svelte-material-icons/GoogleController.svelte";
  import { openModal } from "svelte-modals";
  import DeviceFinder from "./DeviceFinder.svelte";
  import { WebOSService } from "./webos-service";

  export let device: Device;
  const bluetoothService = new WebOSService("com.webos.service.bluetooth2");

  function pairNewDevice() {
    openModal(DeviceFinder);
  }

  async function connect() {
    const connect = await bluetoothService.request("hid/connect", {
      address: device.address,
    });

    console.debug(connect);
  }
</script>

<div
  class="device-card focusable"
  class:empty={!device}
  class:connected={device?.connectedProfiles?.length > 0}
  tabindex="0"
  on:click={!device ? pairNewDevice : connect}
>
  {#if device}
    <div class="title">{device.name}</div>

    <div class="icon">
      <Gamepad />
    </div>

    <div class="details" />
  {:else}
    <div class="add">
      <PlusThick />
    </div>
  {/if}
</div>

<style lang="scss">
  .device-card {
    background-color: #eee;
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
  }
</style>
