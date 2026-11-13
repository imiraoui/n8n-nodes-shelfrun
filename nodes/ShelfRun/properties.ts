import type { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		default: 'listStores',
		options: [
			{
				value: 'addStore',
				name: 'Add Store',
				action: 'Add a monitored store',
				description: 'Add a store with one-time sync frequency',
			},
			{
				value: 'getProducts',
				name: 'Get Many Products',
				action: 'Get many store products',
				description: 'Get the latest products from a monitored store',
			},
			{
				value: 'listStores',
				name: 'Get Many Stores',
				action: 'Get many stores',
				description: 'List monitored stores',
			},
			{
				value: 'productHistory',
				name: 'Get Product History',
				action: 'Get product price history',
				description: 'Get dated price history for a product',
			},
			{
				value: 'storeChanges',
				name: 'Get Store Changes',
				action: 'Get store product changes',
				description: 'Get price, stock, and new-product changes',
			},
			{
				value: 'usage',
				name: 'Get Usage',
				action: 'Get API usage',
				description: 'Get API usage and credit balance',
			},
			{
				value: 'quickscan',
				name: 'Quick Scan',
				action: 'Scan a store',
				description: 'Extract products from a store URL; uses a credit',
			},
			{
				value: 'scrapeStore',
				name: 'Scrape Store',
				action: 'Scrape a monitored store',
				description: 'Run a fresh extraction for an existing store',
			},
			{
				value: 'searchProducts',
				name: 'Search Products',
				action: 'Search products',
				description: 'Search products available to the connected account',
			},
		],
	},
	{
		displayName: 'Store URL',
		name: 'url',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				operation: ['quickscan', 'addStore'],
			},
		},
		required: true,
		description: 'HTTPS URL of the store to scan or monitor',
		placeholder: 'https://example.com',
	},
	{
		displayName: 'Store ID',
		name: 'storeId',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				operation: ['scrapeStore', 'getProducts', 'productHistory', 'storeChanges'],
			},
		},
		required: true,
		description: 'Store UUID returned by Add Store or Get Many Stores',
	},
	{
		displayName: 'Product ID',
		name: 'productId',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				operation: ['productHistory'],
			},
		},
		required: true,
		description: 'Exact product identifier returned by Get Many Products',
	},
	{
		displayName: 'Search Query',
		name: 'query',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				operation: ['searchProducts'],
			},
		},
		required: true,
		description: 'Product search terms; at least two characters',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		displayOptions: {
			show: {
				operation: ['quickscan', 'listStores', 'getProducts', 'searchProducts'],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 200,
		},
		description: 'Max number of results to return',
	},
	{
		displayName: 'Offset',
		name: 'offset',
		type: 'number',
		default: 0,
		displayOptions: {
			show: {
				operation: ['listStores', 'getProducts', 'searchProducts'],
			},
		},
		typeOptions: {
			minValue: 0,
		},
		description: 'Number of results to skip',
	},
	{
		displayName: 'Days',
		name: 'days',
		type: 'number',
		default: 7,
		displayOptions: {
			show: {
				operation: ['storeChanges'],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 90,
		},
		description: 'Days of changes to return',
	},
	{
		displayName: 'Days',
		name: 'days',
		type: 'number',
		default: 30,
		displayOptions: {
			show: {
				operation: ['productHistory'],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 365,
		},
		description: 'Days of price history to return',
	},
	{
		displayName: 'Change Type',
		name: 'changeType',
		type: 'options',
		default: 'all',
		displayOptions: {
			show: {
				operation: ['storeChanges'],
			},
		},
		description: 'Type of product changes to return',
		options: [
			{
				name: 'All',
				value: 'all',
			},
			{
				name: 'New Product',
				value: 'new_product',
			},
			{
				name: 'Out of Stock',
				value: 'out_of_stock',
			},
			{
				name: 'Price Change',
				value: 'price_change',
			},
		],
	},
];
