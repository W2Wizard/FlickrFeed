<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import type { FlickrItem } from "./types";

	const { post, ...rest }: Props = $props();
	interface Props extends HTMLAttributes<HTMLElement> {
		post: FlickrItem;
	}

	// NOTE(W2): This URL may or may not be correct, for example default profile images aren't handled.
	// they use a different URL altogether.
	const profileURL = `https://live.staticflickr.com/3708/buddyicons/${post.author_id}_r.jpg`;
	const userURL = `https://www.flickr.com/photos/${post.author_id}`;
	// Calculate the number of days ago the post was taken: 86400000 = 24 * 60 * 60 * 1000
	const daysAgo = Math.floor(
		(Date.now() - new Date(post.date_taken).getTime()) / 86400000,
	);
</script>

<article class="transition">
	<a
		class="profile"
		href={post.link}
		target="_blank"
		rel="noopener noreferrer"
		{...rest}
	>
		<img
			class="transition"
			loading="lazy"
			src={post.media.m}
			alt={post.title}
		/>
	</a>
	<div hidden class="content transition">
		<a
			href={userURL}
			target="_blank"
			rel="noopener noreferrer"
			title="View profile"
		>
			<img
				width="32px"
				height="32px"
				class="profile"
				loading="lazy"
				onerror={(e) => {
					//@ts-ignore // No clue why type is not correctly inferred
					e.currentTarget.src = "https://www.flickr.com/images/buddyicon.jpg";
				}}
				src={profileURL}
				alt={post.author}
			/>
		</a>
		<span>{post.title}</span>
		<small title={post.date_taken.toString()}>
			{#if daysAgo > 0}
				{daysAgo} days ago
			{:else}
				Today
			{/if}
		</small>
	</div>
</article>

<style>
	article {
		cursor: pointer;
		position: relative;
		border-radius: var(--wui-radius);

		& a img {
			width: 100%;
			object-fit: cover;
		}

		&:focus-within img {
			outline: var(--wui-primary) solid 2px;
			outline-offset: 2px;
		}

		/* Remove the outline if the user profile is being focused on */
		&:has(> div.content > a:focus) img {
			outline: none;
		}

		&:hover {
			box-shadow: 0px 0px 9px 1px rgb(0 0 0 / 0.25);
			transform: scale(1.015);

			& > div.content {
				opacity: 1;
			}
		}

		& div.content {
			display: flex;
			align-items: center;
			flex-direction: row;
			position: absolute;

			left: 0;
			bottom: 0;
			gap: 8px;
			width: 100%;

			padding: 8px;
			opacity: 0;

			z-index: 1;
			color: whitesmoke;
			backdrop-filter: blur(4px);
			border-radius: var(--wui-radius);

			& a {
				min-width: 32px;
				outline: none;
			}

			& small {
				font-size: 0.75rem;
				min-width: 32px;
			}

			& span {
				flex: 1;
			}

			& img {
				outline: none;
				border-radius: 50%;
				width: 32px;
				height: 32px;
			}

			&:has(a:focus) {
				opacity: 1;
				& img {
					outline: var(--wui-primary) solid 2px;
					outline-offset: 2px;
				}
			}
		}
	}
</style>
