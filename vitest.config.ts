import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    include: ['src/**/*.test.ts'],
    // Unit tests never touch a database or the network; these only satisfy env validation.
    env: {
      DATABASE_URL: 'postgres://test:test@localhost:5432/test',
      PAYLOAD_SECRET: 'test-payload-secret-0123456789abcdef0123',
      SERVER_URL: 'http://localhost:3001',
      FRONTEND_URL: 'http://localhost:3000',
      REVALIDATE_SECRET: 'test-revalidate-secret-0123456789abcdef',
      CONTACT_API_KEY: 'test-contact-api-key-0123456789abcdef01',
    },
  },
})
