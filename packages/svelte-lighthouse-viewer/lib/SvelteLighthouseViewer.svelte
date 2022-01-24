<script lang="ts">
	import { onMount } from 'svelte';
	import { renderReport } from 'lighthouse-viewer';

	export let json: any = {}

	let container: HTMLDivElement;

	onMount(() => {
		const renderedReport = renderReport(json, {});
		container.appendChild(renderedReport);	
	})
</script>

<div bind:this={container}></div>