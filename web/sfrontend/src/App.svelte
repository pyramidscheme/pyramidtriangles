<script>
  import Paper from '@smui/paper';
  import TopAppBar, {Row, Section, Title} from '@smui/top-app-bar';
  import GlobalSettings from "./GlobalSettings.svelte";
  import Playlist from "./Playlist.svelte";
  import PlayingSettings from "./PlayingSettings.svelte";
  import ShowSelector from "./ShowSelector.svelte";
  import Status from "./Status.svelte";

  export let name;
</script>

<main>
  <TopAppBar variant="static">
    <Row>
      <Section toolbar>
        <Title>
          Triangle Shows | <Status />
        </Title>
      </Section>
    </Row>
  </TopAppBar>

  <div class="container">
    <div class="item col-xs-6">
      <Paper class="show-selector">
        <ShowSelector />
      </Paper>
    </div>

    <div class="item col-xs-6">
      <Paper class="settings">
        <GlobalSettings />
      </Paper>
      <Paper class="settings">
        <Playlist />
      </Paper>
      <Paper class="settings">
        <PlayingSettings />
      </Paper>
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
    display: flex;
  }

  /*Background*/
</style>