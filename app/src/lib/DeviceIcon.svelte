<script lang="ts">
  import type { Device } from "./interfaces/bluetooth-device.interface";
  import Gamepad from "svelte-material-icons/GoogleController.svelte";
  import Keyboard from "svelte-material-icons/Keyboard.svelte";
  import Headphones from "svelte-material-icons/Headphones.svelte";
  import Cellphone from "svelte-material-icons/Cellphone.svelte";
  import Mouse from "svelte-material-icons/Mouse.svelte";
  import Remote from "svelte-material-icons/Remote.svelte";

  export let device: Device;

  enum BluetoothMajorDeviceClass {
    "UNCATEGORIZED" = 0b1111100000000,
    "GAMEPAD" = 0b0010100001000,
    "KBM" = 0b0010111000000,
    "KEYBOARD" = 0b0010101000000,
    "MOUSE" = 0b0010110000000,
    "PERIPHERAL" = 0b0010100000000,
    "AUDIOVIDEO" = 0b0010000000000,
    "COMPUTER" = 0b0000100000000,
    "PHONE" = 0b0001000000000,
    "LAN" = 0b0001100000000,
    "MISC" = 0b000000000000,
  }

  const iconMap: { [key in BluetoothMajorDeviceClass]?: any } = {
    [BluetoothMajorDeviceClass.GAMEPAD]: Gamepad,
    [BluetoothMajorDeviceClass.KEYBOARD]: Keyboard,
    [BluetoothMajorDeviceClass.AUDIOVIDEO]: Headphones,
    [BluetoothMajorDeviceClass.PHONE]: Cellphone,
    [BluetoothMajorDeviceClass.MOUSE]: Mouse,
    [BluetoothMajorDeviceClass.UNCATEGORIZED]: Remote,
  };

  function getType(classOfDevice: number): any {
    const bin = Number("0b" + classOfDevice.toString(2).padStart(13, "0"));
    for (const deviceClass of Object.values(BluetoothMajorDeviceClass).filter(
      Number
    ) as number[]) {
      if ((deviceClass & bin) === deviceClass) return deviceClass;
    }
  }
</script>

<svelte:component this={iconMap[getType(device.classOfDevice)]} />
