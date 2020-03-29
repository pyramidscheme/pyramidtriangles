<script>
  import {Item, Text, Graphic} from '@smui/list';
</script>

<Item button onClick={handleClick}>
  <Text>
    <div class="mdc-typography--headline5">
      Global Settings
    </div>
  </Text>
  {#if open}
    <Graphic class="material-icons">expand_less</Graphic>
  {:else}
    <Graphic class="material-icons">expand_more</Graphic>
  {/if}
</Item>
  <Collapse in={open} timeout="auto">
    <Grid
      className={classes.grid}
      container
      direction="column"
      justify="center"
    >
      <Brightness />
      <ShowCycle />
      <Speed />
    </Grid>
  </Collapse>