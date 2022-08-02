<script lang="ts">
  import type { Device } from "./interfaces/bluetooth-device.interface";
  import PlusThick from "svelte-material-icons/PlusThick.svelte";
  import Gamepad from "svelte-material-icons/GoogleController.svelte"
  export let device: Device;
</script>

<div
  class="device-card focusable"
  class:empty={!device}
  class:connected={device?.paired}
  tabindex="0"
>
  {#if device}
    <div class="title"></div>

    <div class="icon">
      <Gamepad></Gamepad>
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
    background-color: white;
    border: 5px solid black;
    width: 128px;
    display: flex;
    height: 240px;
    margin: 32px;
    opacity: 0.5;
    display: flex;
    flex-direction: column;
    .icon {
      font-size: 3em
    }

    &.connected {
      opacity: 1;
    }

    &.empty {
      background-color: rgb(163, 163, 163);
      border: 5px solid black;
      opacity: 1;
      .add {
        position: relative;
        display: flex;
        color: #3b3b3b;
        width: 100%;
        height: 100%;
        align-items: center;
        justify-content: center;
        font-size: 4em;
      }
    }
  }
</style>
