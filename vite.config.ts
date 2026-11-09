import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { labNumber } from './src/kit/collection.ts';

// The prerendered summary in index.html takes the lab number from the collection, like the header.
const labNumberInHtml = { name: 'lab-number', transformIndexHtml: (html: string) => html.replaceAll('%LAB_NUMBER%', labNumber('oleoduto')) };
export default defineConfig({ plugins: [react(), labNumberInHtml], base: './', server: { host: '127.0.0.1', port: 4311 } });
