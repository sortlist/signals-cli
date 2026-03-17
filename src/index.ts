import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { listSignals, getSignal } from './commands/signals';
import { listBusinesses, getBusiness, createBusiness, updateBusiness } from './commands/businesses';
import { listSubscriptions, getSubscription, createSubscription, updateSubscription, pauseSubscription, resumeSubscription, deleteSubscription } from './commands/subscriptions';
import { listLeads, getLead, deleteLead } from './commands/leads';
import { listWebhooks, createWebhook, deleteWebhook } from './commands/webhooks';
import type { Argv } from 'yargs';

const businessOption = (yargs: Argv) =>
  yargs.option('business', {
    describe: 'Business ID',
    type: 'string',
    demandOption: true,
    alias: 'b',
  });

yargs(hideBin(process.argv))
  .scriptName('signals')
  .usage('$0 <command> [options]')

  // ── Signals ──

  .command(
    'signals:list',
    'List all available signal types',
    {},
    listSignals as any
  )
  .command(
    'signals:get <slug>',
    'Get details for a specific signal type',
    (yargs: Argv) => {
      return yargs
        .positional('slug', {
          describe: 'Signal slug (e.g. linkedin-company-engagers)',
          type: 'string',
        })
        .example('$0 signals:get linkedin-company-engagers', 'Get signal details');
    },
    getSignal as any
  )

  // ── Businesses ──

  .command(
    'businesses:list',
    'List all businesses in your team',
    {},
    listBusinesses as any
  )
  .command(
    'businesses:get <id>',
    'Get a business with its Ideal Customer Profile',
    (yargs: Argv) => {
      return yargs
        .positional('id', { describe: 'Business ID', type: 'string' })
        .example('$0 businesses:get 1', 'Get business details');
    },
    getBusiness as any
  )
  .command(
    'businesses:create',
    'Create a new business (from website URL or manually)',
    (yargs: Argv) => {
      return yargs
        .option('website', {
          describe: 'Website URL (triggers auto-analysis of name, description, and ICP)',
          type: 'string',
        })
        .option('name', {
          describe: 'Business name (required in manual mode)',
          type: 'string',
        })
        .option('description', {
          describe: 'Business description',
          type: 'string',
        })
        .option('icp', {
          describe: 'Ideal Customer Profile attributes as JSON string',
          type: 'string',
        })
        .example(
          '$0 businesses:create --website https://acme.com',
          'Auto-analyze website and create business'
        )
        .example(
          '$0 businesses:create --name "Acme Corp" --website https://acme.com',
          'Create business manually'
        );
    },
    createBusiness as any
  )
  .command(
    'businesses:update <id>',
    'Update a business and/or its Ideal Customer Profile',
    (yargs: Argv) => {
      return yargs
        .positional('id', { describe: 'Business ID', type: 'string' })
        .option('name', { describe: 'Business name', type: 'string' })
        .option('website', { describe: 'Website URL', type: 'string' })
        .option('description', { describe: 'Business description', type: 'string' })
        .option('icp', {
          describe: 'ICP attributes as JSON string (include "id" field to update existing ICP)',
          type: 'string',
        })
        .example(
          '$0 businesses:update 1 --name "New Name"',
          'Rename a business'
        )
        .example(
          '$0 businesses:update 1 --icp \'{"id":1,"target_job_titles":["CTO","VP Engineering"],"lead_matching_mode":70}\'',
          'Update ICP'
        );
    },
    updateBusiness as any
  )

  // ── Subscriptions ──

  .command(
    'subscriptions:list',
    'List all subscriptions for a business',
    (yargs: Argv) => businessOption(yargs),
    listSubscriptions as any
  )
  .command(
    'subscriptions:get <id>',
    'Get a subscription with stats',
    (yargs: Argv) => {
      return businessOption(yargs)
        .positional('id', { describe: 'Subscription ID', type: 'string' })
        .example('$0 subscriptions:get 42 --business 1', 'Get subscription details');
    },
    getSubscription as any
  )
  .command(
    'subscriptions:create',
    'Create a new subscription',
    (yargs: Argv) => {
      return businessOption(yargs)
        .option('signal', {
          describe: 'Signal slug from the catalog',
          type: 'string',
          demandOption: true,
        })
        .option('name', {
          describe: 'Name for this subscription',
          type: 'string',
          demandOption: true,
        })
        .option('config', {
          describe: 'Signal-specific config as JSON string',
          type: 'string',
        })
        .example(
          '$0 subscriptions:create --business 1 --signal linkedin-company-engagers --name "Apple Engagers" --config \'{"linkedin_url":"https://www.linkedin.com/company/apple/"}\'',
          'Create a subscription'
        );
    },
    createSubscription as any
  )
  .command(
    'subscriptions:update <id>',
    'Update a subscription',
    (yargs: Argv) => {
      return businessOption(yargs)
        .positional('id', { describe: 'Subscription ID', type: 'string' })
        .option('name', { describe: 'Updated name', type: 'string' })
        .option('active', { describe: 'Set active state', type: 'boolean' })
        .option('config', { describe: 'Updated config as JSON string', type: 'string' })
        .example('$0 subscriptions:update 42 --business 1 --name "New Name"', 'Rename a subscription');
    },
    updateSubscription as any
  )
  .command(
    'subscriptions:pause <id>',
    'Pause a subscription (stops scanning)',
    (yargs: Argv) => {
      return businessOption(yargs)
        .positional('id', { describe: 'Subscription ID', type: 'string' })
        .example('$0 subscriptions:pause 42 --business 1', 'Pause subscription');
    },
    pauseSubscription as any
  )
  .command(
    'subscriptions:resume <id>',
    'Resume a paused subscription',
    (yargs: Argv) => {
      return businessOption(yargs)
        .positional('id', { describe: 'Subscription ID', type: 'string' })
        .example('$0 subscriptions:resume 42 --business 1', 'Resume subscription');
    },
    resumeSubscription as any
  )
  .command(
    'subscriptions:delete <id>',
    'Delete a subscription',
    (yargs: Argv) => {
      return businessOption(yargs)
        .positional('id', { describe: 'Subscription ID', type: 'string' })
        .example('$0 subscriptions:delete 42 --business 1', 'Delete subscription');
    },
    deleteSubscription as any
  )

  // ── Leads ──

  .command(
    'leads:list',
    'List discovered leads for a business',
    (yargs: Argv) => {
      return businessOption(yargs)
        .option('page', { describe: 'Page number', type: 'number', default: 1 })
        .option('per-page', { describe: 'Results per page (max 100)', type: 'number', default: 25 })
        .example('$0 leads:list --business 1', 'List first page of leads')
        .example('$0 leads:list --business 1 --page 3 --per-page 50', 'Page through leads');
    },
    listLeads as any
  )
  .command(
    'leads:get <id>',
    'Get a lead with delivery history',
    (yargs: Argv) => {
      return businessOption(yargs)
        .positional('id', { describe: 'Lead ID', type: 'string' })
        .example('$0 leads:get 1234 --business 1', 'Get lead details');
    },
    getLead as any
  )
  .command(
    'leads:delete <id>',
    'Delete a lead (soft-delete)',
    (yargs: Argv) => {
      return businessOption(yargs)
        .positional('id', { describe: 'Lead ID', type: 'string' })
        .example('$0 leads:delete 1234 --business 1', 'Delete a lead');
    },
    deleteLead as any
  )

  // ── Webhooks ──

  .command(
    'webhooks:list',
    'List registered webhooks for a business',
    (yargs: Argv) => businessOption(yargs),
    listWebhooks as any
  )
  .command(
    'webhooks:create',
    'Register a new webhook',
    (yargs: Argv) => {
      return businessOption(yargs)
        .option('url', {
          describe: 'URL to receive POST requests',
          type: 'string',
          demandOption: true,
        })
        .option('secret', {
          describe: 'Secret for HMAC signature verification',
          type: 'string',
        })
        .example(
          '$0 webhooks:create --business 1 --url https://example.com/webhook --secret my_secret',
          'Create a webhook with signature verification'
        );
    },
    createWebhook as any
  )
  .command(
    'webhooks:delete <id>',
    'Delete a webhook',
    (yargs: Argv) => {
      return businessOption(yargs)
        .positional('id', { describe: 'Webhook ID', type: 'string' })
        .example('$0 webhooks:delete 10 --business 1', 'Delete a webhook');
    },
    deleteWebhook as any
  )

  .demandCommand(1, 'You need at least one command. Run signals --help to see available commands.')
  .help()
  .alias('h', 'help')
  .version()
  .alias('v', 'version')
  .epilogue(
    'For more information, visit: https://github.com/sortlist/signals-cli\n\n' +
    'Set your API key: export SIGNALS_API_KEY=your_api_key\n' +
    'Get your key from Settings > API Keys in your Signals dashboard.'
  )
  .parse();
