<script lang="ts">
	import { goto } from '$app/navigation';

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

<form
	role="search"
	onsubmit={(e) => {
		e.preventDefault(); // Svelte 5 removed piplines (workaround is there tho)
		search(e.currentTarget.search.value);
	}}
>
	<input type="search" name="search" placeholder="Search..." />
	<button type="submit">Search</button>
</form>

{#await data.streamed}
	<p>...waiting</p>
{:then feed}
	{#each feed.items as item}
		<article>
			<h2>{item.title}</h2>
			{@html item.description}
		</article>
	{/each}
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}
