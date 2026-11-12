
import { put } from '@vercel/blob'
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

    // Hanapin ang audio field na ipinapadala ng frontend
    const file = body.find(item => item.name === 'audio')

    if (!file || !file.data || !file.filename) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid audio file.'
      })
    }

    // Maximum 4 MB para safe sa Vercel Function upload limit
    const MAX_SIZE = 4 * 1024 * 1024

    if (file.data.length > MAX_SIZE) {
      throw createError({
        statusCode: 413,
        statusMessage: 'Audio file must be smaller than 4 MB.'
      })
    }

    // Validate audio extension
    const originalName = path.basename(file.filename)
    const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, '_')
    const extension = path.extname(safeName).toLowerCase()

    const allowedExtensions = [
      '.mp3',
      '.wav',
      '.ogg',
      '.m4a',
      '.aac'
    ]

    if (!allowedExtensions.includes(extension)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Unsupported audio format.'
      })
    }

    // Check Blob Store ID for OIDC authentication
    if (!process.env.BLOB_STORE_ID) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Blob Store ID is not configured.'
      })
    }

    // Create a unique filename
    const baseName = path.basename(safeName, extension)
    const fileName = `${baseName}-${Date.now()}${extension}`

    // Audio MIME types
    const mimeTypes = {
      '.mp3': 'audio/mpeg',
      '.wav': 'audio/wav',
      '.ogg': 'audio/ogg',
      '.m4a': 'audio/mp4',
      '.aac': 'audio/aac'
    }

    const contentType = file.type || mimeTypes[extension]

    // Upload directly to Vercel Blob using OIDC
    const blob = await put(
      `audio/${fileName}`,
      file.data,
      {
        access: 'public',
        addRandomSuffix: true,
        contentType,
        storeId: process.env.BLOB_STORE_ID
      }
    )

    return {
      success: true,
      message: 'Audio successfully uploaded!',
      name: blob.pathname.split('/').pop(),
      url: blob.url
    }

  } catch (error) {
    console.error('BLOB AUDIO UPLOAD ERROR:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Unable to upload audio to Blob Storage.'
    })
  }
})
