<script>
  import AppBar from "smelte/src/components/AppBar";
  import GlobalSettings from "./GlobalSettings.svelte";
  import Playlist from "./Playlist.svelte";
  import PlayingSettings from "./PlayingSettings.svelte";
  import ShowSelector from "./ShowSelector.svelte";
  import Status from "./Status.svelte";

  import "material-icons/iconfont/material-icons.css";
</script>

<main>
  <AppBar variant="static">
    <div>
      Triangle Shows | <Status />
    </div>
  </AppBar>

  <div class="container">
    <div class="item col-xs-6">
      <div class="paper show-selector">
        <ShowSelector />
      </div>
    </div>

    <div class="item col-xs-6">
      <div class="paper settings">
        <GlobalSettings />
      </div>
      <div class="paper settings">
        <Playlist />
      </div>
      <div class="paper settings">
        <PlayingSettings />
      </div>
    </div>
  </div>
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }

  .container {
    display: grid;
  }

  /*Background*/
</style>