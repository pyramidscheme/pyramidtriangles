<script>
  import Brightness from "./Brightness.svelte";
  import ShowCycle from "./ShowCycle.svelte";
  import Speed from "./Speed.svelte";
</script>

<style>
  .container {
    display: grid;
    justify-items: center;
  }
</style>

<div class="item">
  <h5>Global Settings</h5>
</div>
<div class="container">
  <Brightness />
  <ShowCycle />
  <Speed />
</div>