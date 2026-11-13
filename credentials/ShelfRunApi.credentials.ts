import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
	Icon,
} from 'n8n-workflow';
export class ShelfRunApi implements ICredentialType {
	name = 'shelfRunApi';
	displayName = 'ShelfRun API';
	documentationUrl = 'https://shelfrun.com/docs';
	icon: Icon = { light: 'file:shelfrun.svg', dark: 'file:shelfrun.dark.svg' };
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'API key from the ShelfRun dashboard',
		},
	];
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: { headers: { 'X-API-Key': '={{$credentials.apiKey}}' } },
	};
	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.shelfrun.com/v1',
			url: '/stores',
			method: 'GET',
			qs: { limit: 1, offset: 0 },
		},
	};
}
