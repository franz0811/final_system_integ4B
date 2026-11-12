
import fs from 'node:fs'
import path from 'node:path'

export default defineEventHandler(async (event) => {
  try {
    const body = await readMultipartFormData(event)

    if (!body || body.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No audio file received.'
      })
    }

    const file = body.find(item => item.name === 'audio') || body[0]

    if (!file.data || !file.filename) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid audio file.'
      })
    }

    const uploadDir = path.resolve(process.cwd(), 'public/audio')

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    const originalName = path.basename(file.filename)
    const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, '_')
    const extension = path.extname(safeName).toLowerCase()

    if (!['.mp3', '.wav', '.ogg', '.m4a', '.aac'].includes(extension)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Unsupported audio format.'
      })
    }

    const baseName = path.basename(safeName, extension)
    const fileName = `${baseName}-${Date.now()}${extension}`

    const filePath = path.join(uploadDir, fileName)

    fs.writeFileSync(filePath, file.data)

    return {
      success: true,
      message: 'Audio successfully uploaded!',
      name: fileName,
      url: `/audio/${encodeURIComponent(fileName)}`
    }

  } catch (error) {
    console.error('UPLOAD ERROR:', error)

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || 'Server upload error.'
    })
  }
})
