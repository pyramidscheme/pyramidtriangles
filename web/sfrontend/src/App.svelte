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
  <nav class="bg-purple p-2 mt-0 fixed w-full z-10 top-0">
    <div class="container mx-auto justify-left">
      Triangle Shows | <Status />
    </div>
  </nav>

  <div class="container grid grid-cols-2 gap-4">
    <div class="col-span-1">
      <div class="p-4 bg-gray rounded-lg shadow-lg">
        <ShowSelector />
      </div>
    </div>

    <div class="col-span-1">
      <div class="p-8 bg-gray rounded-lg shadow-lg">
        <GlobalSettings />
      </div>
      <div class="p-4 bg-gray rounded-lg shadow-lg">
        <Playlist />
      </div>
      <div class="p-4 bg-gray rounded-lg shadow-lg">
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