// =============================================================================
// Copyright (c) 2024 - W2Wizard
// See README in the root of this project for more information.
// =============================================================================

import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { FlickrFeed } from '$lib/types';

// Flickr API
// =============================================================================

/**
 * A fetch wrapper that adds a timeout to the request.
 * @param url The URL to fetch
 * @param curl The fetch function to use
 * @param init The fetch options
 * @returns The fetch response as a unresolved promise
 */
async function httpFetch(url: string, curl: typeof fetch, init?: RequestInit) {
	return curl(url, {
		...init,
		signal: AbortSignal.timeout(5000)
	});
}

// =============================================================================

export const load: PageServerLoad = async (event) => {
	const filters = event.url.searchParams.getAll('q');
	const params = new URLSearchParams({
		format: 'json',
		nojsoncallback: '1', // Undocumented, but it prevents the JSONP callback
		tagmode: 'any', // "all"
		tags: `[${filters.join(',')}]`
	});

	const url = `https://www.flickr.com/services/feeds/photos_public.gne?${params}`;
	const response = await httpFetch(url, event.fetch);
	if (!response.ok) {
		error(response.status, response.statusText);
	}

	return { streamed: response.json() as Promise<FlickrFeed> };
};
