<script lang="ts">
  import { of } from "rxjs";
  import { catchError, tap } from "rxjs/operators";
  import { onDestroy } from "svelte";
  import { closeModal } from "svelte-modals";
  import type {
    Bluetooth2AdapterCancelPairingCallReturn,
    Bluetooth2AdapterPairSubscription,
  } from "webos-typings";
  import type { Device } from "./interfaces/bluetooth-device.interface";
  import { WebOSService } from "./webos-service";

  let pairables: Device[] = [];
  let targetDevice: Device = null;
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
        console.debug("Got pairing sub data", data, data.request);
        switch (data.request) {
          case "endPairing": {
            if (data.returnValue) {
              // Now connect
              const co = bluetoothService
                .subscription("hid/connect", {
                  address: device.address,
                })
                .pipe(catchError((error) => of(error)))
                .subscribe(async (data) => {
                  if (data.errorCode) {
                    step = Step.Error;
                    error = `[${(data as any).errorCode}] ${
                      (data as any).errorText
                    }`;
                  }

                  if (data.returnValue) {
                    step = Step.Success;
                  }

                  console.log("Connecting", data);
                });
            } else {
              step = Step.Error;
              error = `[${(data as any).errorCode}] ${(data as any).errorText}`;
            }
            break;
          }
          case "displayPinCode": {
            step = Step.DisplayCode;
            break;
          }
          case "displayPasskey": {
            step = Step.DisplayCode;
            break;
          }
          case "confirmPassKey": {
            step = Step.ConfirmCode;
            break;
          }
        }
      });
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

    try {
      const abort =
        await bluetoothService.request<Bluetooth2AdapterCancelPairingCallReturn>(
          "adapter/cancelPairing",
          {
            address: targetDevice.address,
          }
        );
    } catch (e) {}
  }

  search();

  function handleKeydown({ keyCode }) {
    if (keyCode !== 461) return;

    if (step === Step.Find) return exit();
    else return newSync();
  }
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
        class="focusable"
        class:active={isSearching}
        class:dotdotdot={isSearching}
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
      <em>Waiting<span class="dotdotdot" /></em>
    </div>

    <div class="action">
      <button class="focusable" on:click={newSync} tabindex="0">Cancel</button>
    </div>
  {/if}

  {#if step === Step.Error}
    <div class="content">
      <h1>Could not pair {targetDevice.name}</h1>
      <em>Got an error while trying to pair your device</em>

      <pre class="error">{error}</pre>
    </div>

    <div class="action">
      <button on:click={retry} class="focusable" tabindex="0">Retry</button>
      <button on:click={newSync} class="focusable" tabindex="0"
        >Sync a new device</button
      >
      <button on:click={exit} class="focusable" tabindex="0"
        >Back to devices</button
      >
    </div>
  {/if}

  {#if step === Step.Success}
    <div class="content">
      <h1>Sucesfully paired {targetDevice.name}!</h1>
      <em>Device has been sucesfully paired with this TV</em>
    </div>

    <div class="action">
      <button on:click={exit} class="focusable" tabindex="0"
        >Back to devices</button
      >
      <button on:click={newSync} class="focusable" tabindex="0"
        >Sync a new device</button
      >
    </div>
  {/if}
</div>

<svelte:window on:keydown={handleKeydown} />

<style lang="scss">
  .dotdotdot {
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
