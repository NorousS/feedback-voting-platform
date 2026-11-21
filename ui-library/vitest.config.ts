import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/components/Button.tsx'],
      thresholds: { lines: 70, statements: 70, branches: 70, functions: 70 }
    }
  }
})
