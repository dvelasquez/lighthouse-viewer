<div class="test">
  this is the JSON content
  <pre><code>{JSON.stringify(json, null, 2)}</code></pre>
</div>

<style>
  .test {
    background-color: darkgray;
  }
</style>

<script lang="ts">
  import { onMount } from 'svelte'

  export let json: any = {}

  onMount(() => {
    console.log('This is mounted')
    console.log(json)
  })

  $: {}

</script>