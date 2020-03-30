<script>
  import {onMount} from "svelte";

  let value = 100;

  onMount(async () => {
    const resp = await fetch("brightness");
    const data = await resp.json();
    value = data.value;
  });

  const handleChange = async (e, v) => {
    await fetch("brightness", {
      method: 'POST',
      data: {
        value: value,
      },
    });
  };
</script>

<div class="mb-2">
  <div>Brightness</div>
  <input
    type="range"
    min="0"
    max="100"
    bind:value
    on:change={handleChange}
  >
  <!-- valueLabelDisplay="auto" -->
</div>