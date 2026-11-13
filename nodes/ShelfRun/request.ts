import type { IDataObject, IHttpRequestOptions } from 'n8n-workflow';

export interface RequestPlan {
	options: IHttpRequestOptions;
	rpc: boolean;
}
function required(p: IDataObject, key: string): string {
	const v = String(p[key] ?? '').trim();
	if (!v) throw new Error(`${key} is required`);
	return v;
}
function bounded(p: IDataObject, key: string, fallback: number, min: number, max: number): number {
	const v = Number(p[key] ?? fallback);
	if (!Number.isInteger(v) || v < min || v > max)
		throw new Error(`${key} must be between ${min} and ${max}`);
	return v;
}
export function buildRequest(base: string, operation: string, p: IDataObject): RequestPlan {
	const options: IHttpRequestOptions = {
		method: 'GET',
		url: base,
		json: true,
		timeout: 300000,
		disableFollowRedirect: true,
		headers: { Accept: 'application/json' },
	};
	const plan = { options, rpc: false };
	if (['quickscan', 'addStore'].includes(operation)) {
		const url = required(p, 'url');
		const parsed = new URL(url);
		if (parsed.protocol !== 'https:' || parsed.username || parsed.password)
			throw new Error('Store URL must use HTTPS without embedded credentials');
		options.method = 'POST';
		options.url += operation === 'quickscan' ? '/quickscan' : '/stores';
		options.body =
			operation === 'quickscan'
				? { url, limit: bounded(p, 'limit', 50, 1, 200) }
				: { url, sync_frequency: 'once' };
	} else if (['listStores', 'searchProducts'].includes(operation)) {
		options.url += operation === 'listStores' ? '/stores' : '/search';
		options.qs = {
			limit: bounded(p, 'limit', 50, 1, 200),
			offset: bounded(p, 'offset', 0, 0, 1000000),
		};
		if (operation === 'searchProducts') {
			const q = required(p, 'query');
			if (q.length < 2) throw new Error('Search query needs at least two characters');
			options.qs.q = q;
		}
	} else if (operation === 'usage') options.url += '/usage';
	else if (['scrapeStore', 'getProducts', 'productHistory', 'storeChanges'].includes(operation)) {
		const id = required(p, 'storeId');
		if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id))
			throw new Error('Store ID must be a UUID');
		if (operation === 'scrapeStore') {
			options.method = 'POST';
			options.url += '/scrape/' + id;
		} else {
			options.url += '/stores/' + id;
			if (operation === 'getProducts') {
				options.url += '/products';
				options.qs = {
					format: 'json',
					limit: bounded(p, 'limit', 50, 1, 200),
					offset: bounded(p, 'offset', 0, 0, 1000000),
				};
			}
			if (operation === 'productHistory') {
				options.url += '/products/' + encodeURIComponent(required(p, 'productId')) + '/history';
				options.qs = { days: bounded(p, 'days', 30, 1, 365) };
			}
			if (operation === 'storeChanges') {
				options.url += '/changes';
				options.qs = { days: bounded(p, 'days', 7, 1, 90) };
				const type = String(p.changeType ?? 'all');
				if (!['all', 'price_change', 'new_product', 'out_of_stock'].includes(type))
					throw new Error('Invalid change type');
				if (type !== 'all') options.qs.change_type = type;
			}
		}
	} else throw new Error('Unknown ShelfRun operation');
	return plan;
}
export function unwrapResponse(response: unknown): IDataObject {
	return Array.isArray(response)
		? { results: response }
		: response && typeof response === 'object'
			? (response as IDataObject)
			: { data: response as string };
}
