<script lang="ts">
import BluetoothFinder from "./lib/BluetoothFinder.svelte";
import SpatialNavigation from "spatial-navigation-ts";
import DeviceCard from "./lib/DeviceCard.svelte";
import { Modals, closeModal } from 'svelte-modals'

SpatialNavigation.init();
SpatialNavigation.add({
  selector: '.focusable'
});
SpatialNavigation.makeFocusable();
SpatialNavigation.focus();
</script>

<main>
  <div class="top">
  </div>
  <div class="middle">
    <DeviceCard></DeviceCard>
    <DeviceCard device="{({paired: true})}"></DeviceCard>
    <DeviceCard device="{({})}"></DeviceCard>
    <DeviceCard device="{({})}"></DeviceCard>
    <DeviceCard device="{({})}"></DeviceCard>
    <DeviceCard device="{({})}"></DeviceCard>
  </div>
  <div class="bottom"></div>
</main>


<Modals>
</Modals>


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