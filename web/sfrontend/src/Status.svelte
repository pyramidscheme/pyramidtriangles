<script>
  import {status, seconds_remaining} from "./stores";
</script>

<span>running <strong>{$status.show}</strong> : {$seconds_remaining} seconds remaining</span>