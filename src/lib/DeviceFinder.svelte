<script lang="ts">
  import { throwError } from "rxjs";
  import { catchError, tap } from "rxjs/operators";
  import SpatialNavigation from "spatial-navigation-ts";
  import { onDestroy, onMount, afterUpdate } from "svelte";
  import { closeModal } from "svelte-modals";
  import type {
    Bluetooth2AdapterCancelPairingCallReturn,
    Bluetooth2AdapterPairSubscription,
  } from "webos-typings";
  import type { Device } from "./interfaces/bluetooth-device.interface";
  import { WebOSService } from "./webos-service";

  let pairables: Device[] = [];
  let targetDevice: Device = null;
  let isCancelling: boolean = false;
  let error: string = "";

  const bluetoothService = new WebOSService("com.webos.service.bluetooth2");
  const deviceSub = bluetoothService
    .subscription("device/getStatus")
    .pipe(
      tap((data) => {
        pairables = (data["devices"] as Device[])
          .filter((d) => d.paired === false)
          .filter((d) => !!d.name);
      })
    )
    .subscribe();

  onDestroy(() => {
    deviceSub.unsubscribe();
  });

  enum Step {
    Find,
    WaitingOn,
    DisplayCode,
    ConfirmCode,
    Success,
    Error,
  }

  let isSearching = false;
  let step: Step = Step.Find;

  async function search() {
    await bluetoothService.request("adapter/startDiscovery");
    isSearching = true;
    setTimeout(async () => {
      await bluetoothService.request("adapter/cancelDiscovery");
      isSearching = false;
    }, 20000);
  }

  async function pair(device: Device) {
    targetDevice = device;
    step = Step.WaitingOn;

    const pairing = bluetoothService
      .subscription<Bluetooth2AdapterPairSubscription>("adapter/pair", {
        address: targetDevice.address,
        subscribe: true,
      })
      .subscribe((data) => {
        console.debug("Got pairing sub data", data);
        switch (data.request) {
          case "request:endPairing": {
            if (data.returnValue) {
              step = Step.Success;
            } else {
              step = Step.Error;
              error = `[${(data as any).errorCode}] ${(data as any).errorText}`;
            }

            pairing.unsubscribe();
          }
          case "displayPinCode":
          case "displayPasskey": {
            step = Step.DisplayCode;
          }
          case "confirmPassKey": {
            step = Step.ConfirmCode;
          }
        }
      });
    step = Step.DisplayCode;
  }

  async function exit() {
    closeModal();
  }

  async function newSync() {
    await cancelPair();
    targetDevice = null;
    step = Step.Find;
  }

  async function retry() {
    await cancelPair();
    pair(targetDevice);
  }

  async function cancelPair() {
    if (!targetDevice) return;

    const abort =
      await bluetoothService.request<Bluetooth2AdapterCancelPairingCallReturn>(
        "adapter/cancelPairing",
        {
          address: targetDevice.address,
        }
      );
  }

  search();
</script>

<div class="modal focusableArea">
  {#if step === Step.Find}
    <div class="content">
      <h1>Pick a new device to sync with</h1>
      <em
        >Ensure your device is in pairing mode to be discoverable by this tool,
        then select it in this list. <br /> <br />Devices that you have already
        paired with this TV can be found in the previous screen</em
      >
    </div>
    <div class="action">
      <button
        class:active={isSearching}
        on:click={search}
        disabled={isSearching}
        tabindex="0"
      >
        {#if isSearching}
          Searching
        {:else}
          Relaunch search
        {/if}
      </button>

      <ul>
        {#each pairables as pairable}
          <li class="focusable" tabindex="0" on:click={() => pair(pairable)}>
            {pairable.name}
          </li>
        {/each}
      </ul>
    </div>
  {/if}

  {#if step === Step.WaitingOn}
    <div class="content">
      <h1>Pairing {targetDevice.name}</h1>
      <em>Waiting...</em>
    </div>

    <div class="action">
      <button on:click={cancelPair}>Cancel</button>
    </div>
  {/if}

  {#if step === Step.Error}
    <div class="content">
      <h1>Could not pair {targetDevice.name}</h1>
      <em>Got an error while trying to pair your device</em>

      <pre class="error">{error}</pre>
    </div>

    <div class="action">
      <button on:click={retry}>Retry</button>
      <button on:click={newSync}>Sync a new device</button>
      <button on:click={exit}>Back to devices</button>
    </div>
  {/if}

  {#if step === Step.Success}
    <div class="content">
      <h1>Sucesfully paired {targetDevice.name}!</h1>
      <em>Device has been sucesfully paired with this TV</em>
    </div>

    <div class="action">
      <button on:click={exit}>Back to devices</button>
      <button on:click={newSync}>Sync a new device</button>
    </div>
  {/if}
</div>

<style lang="scss">
  .modal {
    z-index: 99999;
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    color: #eeeeee;
  }
  .content {
    background-color: #263238;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 86px;
    padding-top: 15%;
    text-align: left;
    h1 {
      margin-top: 0px;
      font-weight: 500;
    }
    em {
      font-weight: 100;
      font-size: 2em;

      line-height: 1.25em;
    }

    button {
      &.code {
        font-size: 1.5em;
        margin: 24px;
        margin-left: 0px;
        border-radius: 4px;
        margin-top: 90px;
        width: 33%;
        color: black;
      }
    }
  }
  .action {
    background-color: #37474f;
    width: 40%;
    padding: 48px;
    padding-top: 15%;
    font-size: 20px;

    button {
      width: 100%;
      background: #263238;
      color: #eeeeee;
      border-radius: 4px;

      &.active {
        background: transparent;
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

    ul {
      list-style: none;
      padding: 0px;
      overflow: hidden;
      display: block;
      height: calc(100% - 80px);
      li {
        background: rgba(255, 255, 255, 0.1);
        color: #eeeeee;
        margin: 22px 0px;
        padding: 12px;
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
