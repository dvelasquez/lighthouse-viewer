<script lang="ts">
	import { onMount } from 'svelte';
	import {DOM, ReportRenderer, ReportUIFeatures, Logger} from 'lighthouse-viewer';
	import SvelteReportTemplate from "./SvelteReportTemplate.svelte";

	export let json: any = {}

	onMount(() => {
		console.log('This is mounted')

		document.addEventListener('lh-log', (e: CustomEventInit) => {
			const lhLogElement = document.querySelector('#lh-log');
			if (lhLogElement) {
				const logger = new Logger(lhLogElement);
				switch (e.detail.cmd) {
					case 'log':
						logger.log(e.detail.msg);
						break;
					case 'warn':
						logger.warn(e.detail.msg);
						break;
					case 'error':
						logger.error(e.detail.msg);
						break;
					case 'hide':
						logger.hide();
						break;
					default:
				}
			}
		});
		const dom = new DOM(document);
		const renderer = new ReportRenderer(dom);
		const container = document.querySelector('main.svelte-lighthouse-viewer');
		renderer.renderReport(json, container);
		const features = new ReportUIFeatures(dom);
		features.initFeatures(json);
	})
</script>

<div>
	<div class="lh-root lh-vars">
		<SvelteReportTemplate />
		<main class="svelte-lighthouse-viewer" />
		<div id="lh-log" />
	</div>
</div>