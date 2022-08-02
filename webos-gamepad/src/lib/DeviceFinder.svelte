<script lang="ts">
  import { closeModal } from "svelte-modals";

  enum Step {
    Find,
    DisplayCode,
    ConfirmCode,
    EnterCode,
  }

  let isSearching = false;
  let step: Step = Step.Find;

  async function search() {
    isSearching = true;
    setTimeout(() => (isSearching = false), 20000);
  }

  async function pair() {
    step = Step.DisplayCode;
  }

  search();
</script>

<div class="modal">
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
      <button class:active={isSearching} on:click={search}>
        {#if isSearching}
          Searching
        {:else}
          Relaunch search
        {/if}
      </button>

      <ul>
        <li class="focusable" tabindex="0" on:click={pair}>
          Xbox Wireless Controller
        </li>
        <li class="focusable" tabindex="0" on:click={closeModal}>Lime</li>
        <li class="focusable" tabindex="0">Bluetooth Keyboard</li>
        <li class="focusable" tabindex="0">Bluetooth Keyboard</li>
        <li class="focusable" tabindex="0">Bluetooth Keyboard</li>
        <li class="focusable" tabindex="0">Bluetooth Keyboard</li>
        <li class="focusable" tabindex="0">Bluetooth Keyboard</li>
        <li class="focusable" tabindex="0">Bluetooth Keyboard</li>
        <li class="focusable" tabindex="0">Bluetooth Keyboard</li>
        <li class="focusable" tabindex="0">Bluetooth Keyboard</li>
        <li class="focusable" tabindex="0">Bluetooth Keyboard</li>
        <li class="focusable" tabindex="0">Bluetooth Keyboard</li>
        <li class="focusable" tabindex="0">Bluetooth Keyboard</li>
        <li class="focusable" tabindex="0">Bluetooth Keyboard</li>
        <li class="focusable" tabindex="0">Bluetooth Keyboard</li>
        <li class="focusable" tabindex="0">Bluetooth Keyboard</li>
        <li class="focusable" tabindex="0">Bluetooth Keyboard</li>
        <li class="focusable" tabindex="0">Bluetooth Keyboard</li>
        <li class="focusable" tabindex="0">Bluetooth Keyboard</li>
        <li class="focusable" tabindex="0">Bluetooth Keyboard</li>
        <li class="focusable" tabindex="0">Bluetooth Keyboard</li>
        <li class="focusable" tabindex="0">Bluetooth Keyboard</li>
        <li class="focusable" tabindex="0">Bluetooth Keyboard</li>
        <li class="focusable" tabindex="0">Bluetooth Keyboard</li>
        <li class="focusable" tabindex="0">Bluetooth Keyboard</li>
        <li class="focusable" tabindex="0">Bluetooth Keyboard</li>
        <li class="focusable" tabindex="0">Bluetooth Keyboard</li>
        <li class="focusable" tabindex="0">Bluetooth Keyboard</li>
        <li class="focusable" tabindex="0">Bluetooth Keyboard</li>
        <li class="focusable" tabindex="0">Bluetooth Keyboard</li>
        <li class="focusable" tabindex="0">Bluetooth Keyboard</li>
        <li class="focusable" tabindex="0">Bluetooth Keyboard</li>
        <li class="focusable" tabindex="0">Bluetooth Keyboard</li>
        <li class="focusable" tabindex="0">Bluetooth Keyboard</li>
        <li class="focusable" tabindex="0">Actis Wireless Pro</li>
      </ul>
    </div>
  {/if}

  {#if step === Step.DisplayCode}
    <div class="content">
      <h1>Pairing XBox Wireless Controller</h1>
      <em
        >Please make sure the code displayed below matches the one on your
        device</em
      >

      <button class="code" disabled="true">CODE ABCDEF</button>
    </div>

    <div class="action">wait</div>
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
