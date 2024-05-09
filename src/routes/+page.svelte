<script lang="ts">
	import { goto } from '$app/navigation';
	import Loading from '$lib/loading.svelte';

	const { data } = $props();

	/** Search for a feed */
	async function search(query: string) {
		const params = new URLSearchParams();
		query.split(' ').forEach((filter) => params.append('q', filter.trim()));

		// NOTE(W2): Use goto to avoid invalidation and pushState
		goto(`/?${params.toString()}`, {
			replaceState: true,
			invalidateAll: false
		});
	}
</script>

<header>
	<form
		role="search"
		onsubmit={(e) => {
			e.preventDefault(); // Svelte 5 removed piplines (workaround is there tho)
			search(e.currentTarget.search.value);
		}}
	>
		<input class="wui" type="text" spellcheck="false" name="search" placeholder="Search..." />
		<button class="wui button" type="submit"> Search </button>
	</form>
</header>

<main>
	<ul class="graph">
		{#await data.streamed}
			<Loading />
		{:then feed}
			{#each feed.items as item}
				<li>
					<article>
						<h2>{item.title}</h2>
						{@html item.description}
					</article>
				</li>
			{/each}
		{:catch error}
			<p>{error.message}</p>
		{/await}
	</ul>
</main>

<style>
	header {
		display: grid;
		background-color: var(--wui-header);
		width: 100%;
		height: var(--wui-header-height);
		padding-inline: 1rem;
	}

	main {
		--main-padding: 1rem;
		padding: var(--main-padding);
	}

	.graph {
		padding: 8px;
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		border-radius: var(--wui-radius);
		min-height: calc(100dvh - var(--main-padding) - var(--wui-header-height));
		box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 4px 2px inset;
	}
</style>
