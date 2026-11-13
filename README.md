# n8n-nodes-shelfrun

Use [ShelfRun](https://shelfrun.com) in n8n to scan e-commerce stores, extract product inventories, and track price and stock changes.

This community integration has not been verified by n8n. Publication metadata is pending an operator-approved public author email. Full lint blocks release until that is configured.

## Installation and credentials

After npm publication, install `n8n-nodes-shelfrun` in self-hosted n8n under Settings → Community Nodes. n8n Cloud installation requires n8n verification. Create an API key in the [ShelfRun dashboard](https://shelfrun.com/docs) and store it in the ShelfRun API credential. The key is sent only to `https://api.shelfrun.com` using `X-API-Key`.

## Operations

- **Quick Scan**: Extract products from a store URL; uses a credit.
- **Get Many Stores**: List monitored stores.
- **Add Store**: Add a store with one-time sync frequency.
- **Scrape Store**: Run a fresh extraction for an existing store.
- **Get Many Products**: Get the latest products from a monitored store.
- **Search Products**: Search products available to the connected account.
- **Get Product History**: Get dated price history for a product.
- **Get Store Changes**: Get price, stock, and new-product changes.
- **Get Usage**: Get API usage and credit balance.

Quick Scan and Scrape Store can consume credits. Add Store creates a monitored store with one-time sync frequency; the node does not silently enable a recurring schedule. Source URLs, product currencies, timestamps, and missing values are returned as supplied by the API. Requests do not retry automatically.

## Examples

Import `examples/basic.json`, choose your credential, and execute Get Many Stores. For AI Agent use, import `examples/ai-agent-tool.json`, select your chat-model and ShelfRun credentials, and run the agent. Replace the example store URL with a store you are authorized to process. The workflows contain no real keys, account data, or pinned results.

## Development

Use Node.js 24. Run `npm ci --ignore-scripts --legacy-peer-deps`, `npm run lint:code`, `npm run build`, and `npm test`. Run `npm run dev` for a local n8n instance. There are no runtime dependencies, telemetry, filesystem reads, or environment-variable reads in the node.

Full `npm run lint` also checks publication metadata, including the required public author email. GitHub Actions runs source lint, build, and tests. The publish workflow additionally requires full lint and publishes with provenance.

## Release and verification

See [RELEASE.md](RELEASE.md). Publication, a real uncut demonstration in self-hosted n8n, and n8n Creator Portal approval remain separate steps.

## License

MIT
