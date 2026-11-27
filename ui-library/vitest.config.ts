import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/components/Button.tsx'],
      thresholds: { lines: 90, statements: 90, branches: 90, functions: 90 }
    }
  }
})
