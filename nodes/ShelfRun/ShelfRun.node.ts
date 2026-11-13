import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';
import { properties } from './properties';
import { buildRequest, unwrapResponse } from './request';

export class ShelfRun implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'ShelfRun',
		name: 'shelfRun',
		icon: { light: 'file:shelfrun.svg', dark: 'file:shelfrun.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Scan stores, extract product inventories, and track product changes',
		defaults: { name: 'ShelfRun' },
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [{ name: 'shelfRunApi', required: true }],
		properties,
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const output: INodeExecutionData[] = [];
		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				const operation = this.getNodeParameter('operation', itemIndex) as string;
				const params: IDataObject = {};
				for (const property of properties) {
					const operations = property.displayOptions?.show?.operation;
					if (property.name !== 'operation' && (!operations || operations.includes(operation)))
						params[property.name] = this.getNodeParameter(
							property.name,
							itemIndex,
							property.default,
						) as IDataObject[string];
				}
				const plan = buildRequest('https://api.shelfrun.com/v1', operation, params);
				const response = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'shelfRunApi',
					plan.options,
				);
				output.push({ json: unwrapResponse(response), pairedItem: { item: itemIndex } });
			} catch (error) {
				if (this.continueOnFail())
					output.push({ json: { error: error.message }, pairedItem: { item: itemIndex } });
				else throw new NodeOperationError(this.getNode(), error, { itemIndex });
			}
		}
		return [output];
	}
}
