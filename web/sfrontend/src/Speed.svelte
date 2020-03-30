<script>
  import {onMount} from "svelte";

  let value = 1.0;

  onMount(async () => {
    const resp = await fetch("speed");
    const data = await resp.json();
    value = data.value;
  });

  const handleChange = async (e, v) => {
    await fetch("speed", {
      method: 'POST',
      data: {
        value: value,
      },
    });
  };
</script>

<div class="mb-2">
  <div>Speed Multiplier (lower is faster)</div>
  <input
    type="range"
    min="0.5"
    max="2.0"
    step="0.25"
    bind:value
    on:change={handleChange}
  >
  <!-- valueLabelDisplay="auto" -->
</div>