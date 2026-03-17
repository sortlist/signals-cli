export interface SignalsConfig {
  apiKey: string;
}

export function getConfig(): SignalsConfig {
  const apiKey = process.env.SIGNALS_API_KEY;

  if (!apiKey) {
    console.error('Error: SIGNALS_API_KEY environment variable is required.');
    console.error('Set it using: export SIGNALS_API_KEY=your_api_key');
    console.error('Get your key from Settings > API Keys in your Signals dashboard.');
    process.exit(1);
  }

  return { apiKey };
}
