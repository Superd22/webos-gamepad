<script lang="ts">
import BluetoothFinder from "./lib/BluetoothFinder.svelte";
import SpatialNavigation from "spatial-navigation-ts";
SpatialNavigation.init();
SpatialNavigation.add({
  selector: '.focusable'
});

SpatialNavigation.makeFocusable();
SpatialNavigation.focus();
</script>

<main>
  <div class="top"></div>
  <div class="middle">
    <BluetoothFinder></BluetoothFinder>
  </div>
  <div class="bottom"></div>
</main>


<style>
  main {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 3fr 10fr 2fr;
    width: 100vw;
    height: 100vh;
    background: #2c3191;
  }

  .middle {
    background: rgba(255, 255, 255, 0.8);
  }
</style>