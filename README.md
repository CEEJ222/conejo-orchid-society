# conejo-orchid-society

## Development

Local development should use the [Netlify CLI](https://docs.netlify.com/cli/get-started/) so clean URLs, redirects, and serverless functions (e.g. `netlify/functions`) behave like production.

1. Install the CLI once: `npm install -g netlify-cli`
2. From the repo root, run:

```bash
netlify dev
```

Do not rely on a plain static file server alone; Netlify Dev is required for a correct local setup.
