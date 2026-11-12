
import fs from 'node:fs'
import path from 'node:path'

export default defineEventHandler(() => {
  try {
    const audioDir = path.resolve(process.cwd(), 'public/audio')

    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir, { recursive: true })
    }

    const files = fs.readdirSync(audioDir, {
      withFileTypes: true
    })

    return files
      .filter(file =>
        file.isFile() &&
        /\.(mp3|wav|ogg|m4a|aac)$/i.test(file.name)
      )
      .map(file => ({
        name: file.name,
        url: `/audio/${encodeURIComponent(file.name)}`
      }))
      .sort((a, b) => a.name.localeCompare(b.name))

  } catch (error) {
    console.error('AUDIO LIBRARY ERROR:', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Unable to read audio library.'
    })
  }
})
