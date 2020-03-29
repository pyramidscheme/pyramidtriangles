<script>
  import {onDestroy, onMount} from "svelte";
  import IconButton from '@smui/icon-button';
  import List, {Item, Text, PrimaryText, SecondaryText} from '@smui/list';
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

  const interval = setInterval(updateShowList, 10_000);
  onDestroy(() => clearInterval(interval));

  const clickPlay = async (show) => {
    await fetch('shows', {
      method: 'POST',
      body: JSON.stringify({value: show}),
    });
  };

  const clickEnqueue = async (show) => {
    await addToPlaylist(show);
  }
</script>

<div class="mdc-typography--headline5">
  Show Selector
</div>

<List dense>
  {#each shows as show}
    <Item color="primary" divider>
      <Text>
        <PrimaryText>{show.name}</PrimaryText>
        <SecondaryText>{show.description}</SecondaryText>
      </Text>
      <IconButton on:click={() => clickPlay(show.name)}>play_circle</IconButton>
      <IconButton on:click={() => clickEnqueue(show.name)}>playlist_add</IconButton>
    </Item>
  {/each}
</List>