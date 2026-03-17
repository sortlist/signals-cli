import { SignalsAPI } from '../api';
import { getConfig } from '../config';

export async function listLeads(args: { business: string; page?: number; 'per-page'?: number }) {
  const config = getConfig();
  const api = new SignalsAPI(config);

  try {
    const result = await api.listLeads(args.business, {
      page: args.page,
      per_page: args['per-page'],
    });
    console.log(JSON.stringify(result, null, 2));
  } catch (error: any) {
    console.error('Failed to list leads:', error.message);
    process.exit(1);
  }
}

export async function getLead(args: { business: string; id: string }) {
  const config = getConfig();
  const api = new SignalsAPI(config);

  if (!args.id) {
    console.error('Lead ID is required.');
    process.exit(1);
  }

  try {
    const result = await api.getLead(args.business, args.id);
    console.log(JSON.stringify(result, null, 2));
  } catch (error: any) {
    console.error('Failed to get lead:', error.message);
    process.exit(1);
  }
}

export async function deleteLead(args: { business: string; id: string }) {
  const config = getConfig();
  const api = new SignalsAPI(config);

  if (!args.id) {
    console.error('Lead ID is required.');
    process.exit(1);
  }

  try {
    await api.deleteLead(args.business, args.id);
    console.log(JSON.stringify({ success: true, message: `Lead ${args.id} deleted.` }, null, 2));
  } catch (error: any) {
    console.error('Failed to delete lead:', error.message);
    process.exit(1);
  }
}
