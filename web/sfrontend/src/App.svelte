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
  <div class="flex items-center flex-wrap bg-purple p-6 fixed w-full z-10 pin-t">
    Triangle Shows | <Status />
  </div>
<!--  <AppBar variant="static">-->
<!--    <div class="p-6">-->
<!--      Triangle Shows | <Status />-->
<!--    </div>-->
<!--  </AppBar>-->

  <div class="grid grid-cols-2 gap-4 bg-dark-gray">
    <div class="col-span-1">
      <div class="paper show-selector p-4 bg-gray rounded-lg shadow-lg">
        <ShowSelector />
      </div>
    </div>

    <div class="col-span-1">
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