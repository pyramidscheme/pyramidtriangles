<script>
  import {onMount} from "svelte";
  import Icon from "smelte/src/components/Icon";
  import List from "smelte/src/components/List";
  import createRipple from "smelte/src/components/Ripple/ripple";
  import {addToPlaylist} from "./playlist_actions";

  let shows = [];

  const updateShowList = async () => {
    const resp = await fetch('shows');
    const data = await resp.json();
    shows = data.shows;
  };

  onMount(async () => {
    await updateShowList();
  });

  const clickPlay = async (show) => {
    await fetch('shows', {
      method: 'POST',
      body: JSON.stringify({value: show}),
    });
  };

  const clickEnqueue = async (show) => {
    await addToPlaylist(show);
  };

  let selected;

  const ripple = createRipple();
</script>

<h5>Show Selector</h5>

<List bind:value={selected} items={shows} dense>
    <li slot="item" let:item={item}>
      <div class="flex flex-col p-0">
        <div class="bg-gray-200 dark:bg-primary-transLight">{item.name}</div>

        <div class="text-gray-600 p-0 text-sm">{item.description}</div>

        <div
          use:ripple
          on:click={() => clickPlay(item.name)}
        >
          <Icon>play_circle</Icon>
        </div>

        <div
          use:ripple
          on:click={() => clickEnqueue(item.name)}
        >
          <Icon>playlist_add</Icon>
        </div>
      </div>
    </li>
<!-- Divider -->
</List>