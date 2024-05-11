<script lang="ts">
	import { goto } from "$app/navigation";
	import IconGithub from "$lib/icons/icon-github.svelte";
	import Loading from "$lib/icons/icon-loading.svelte";
	import Post from "$lib/post.svelte";

	const { data } = $props();

	/** Search for a feed */
	async function search(query: string, language = "en-us") {
		const params = new URLSearchParams();
		if (query.length > 0)
			query.split(" ").forEach((filter) => params.append("q", filter.trim()));
		//params.append("lang", language);

		// NOTE(W2): Use goto to avoid invalidation and pushState
		goto(`/?${params.toString()}`, {
			replaceState: true,
			invalidateAll: false,
		});
	}
</script>

<header>
	<form
		class="center"
		role="search"
		onsubmit={(e) => {
			e.preventDefault(); // Svelte 5 removed piplines (workaround is there tho)
			search(e.currentTarget.search.value);
		}}
	>
		<a href="https://github.com/w2wizard" target="_blank" rel="noopener noreferrer">
			<img
				src="https://avatars.githubusercontent.com/u/63303990?v=4"
				alt="Logo"
				loading="lazy"
				width="32"
				height="32"
			/>
		</a>
		<input
			class="wui"
			type="text"
			spellcheck="false"
			name="search"
			placeholder="Search for feeds..."
		/>
		<menu>
			<li>
				<a href="https://github.com/w2wizard/flickrfeed" class="">
					<IconGithub size={32} />
				</a>
			</li>
		</menu>
		<!--<button class="wui button" type="submit"> Search </button>-->
	</form>
</header>

<main>
	<ul class="graph">
		{#await data.streamed}
			<div class="middle">
				<Loading size={42}/>
			</div>
		{:then feed}
			<!-- Calculate the number of items per column -->
			{#if feed.items.length > 0}
				{@const columnCount = 3}
				{@const itemsPerColumn = Math.ceil(feed.items.length / columnCount)}

				<!-- Create three columns -->
				{#each Array.from({ length: columnCount }) as _, i}
					<div id={`column-${i + 1}`} class="column">
						<!-- Distribute items to the current column -->
						{#each feed.items.slice(i * itemsPerColumn, (i + 1) * itemsPerColumn) as item, j}
							<!-- tabindex={(i * itemsPerColumn) + j}  -->
							<Post post={item} />
						{/each}
					</div>
				{/each}
			{:else}
				<div class="middle center" style="flex-direction: column; text-align: center;">
					<span style="font-size: 2rem;">🤔</span>
					<b>Nothing found</b>
				</div>
			{/if}
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
		min-height: var(--wui-header-height);
		padding: 0.5rem 1rem;
	}

	main {
		--main-padding: 1rem;
		padding: 0 var(--main-padding) var(--main-padding) var(--main-padding);
	}

	div.column {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	form[role="search"] {
		justify-content: space-between;
		gap: 1rem;

		& input.wui[type="text"] {
			width: 50%;
			border: none;
			box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 4px 2px inset;

			@media screen and (max-width: 768px) {
				width: 100%;
			}
		}
	}

	.middle {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.graph {
		padding: 1rem;
		display: grid;
		gap: 1rem;
		position: relative;
		grid-template-columns: repeat(3, 1fr);
		border-radius: var(--wui-radius);
		min-height: calc(100dvh - var(--main-padding) - var(--wui-header-height));
		box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 4px 2px inset;

		/* NOTE: This does kinda break tab indexing... */
		@media screen and (max-width: 1024px) {
			grid-template-columns: repeat(2, 1fr);
		}

		@media screen and (max-width: 768px) {
			grid-template-columns: 1fr;
		}
	}
</style>
