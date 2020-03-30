<script>
  import {onMount} from "svelte";

  let value = 60;

  onMount(async () => {
    const resp = await fetch("cycle_time");
    const data = await resp.json();
    value = data.value;
  });

  const handleChange = async (e, v) => {
    await fetch("cycle_time", {
      method: 'POST',
      data: {
        value: value,
      },
    });
  };
</script>

<div class="mb-2">
  <div>Show duration (s)</div>
  <input
    type="range"
    min="10"
    max="120"
    step="10"
    bind:value
    on:change={handleChange}
  >
  <!-- valueLabelDisplay="auto" -->
</div>