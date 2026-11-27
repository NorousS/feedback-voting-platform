import { createApp } from './app.js'

const port: number = Number(process.env.PORT ?? 3001)

createApp().listen(port, () => {
  console.info(`API работает: http://localhost:${port}`)
})
