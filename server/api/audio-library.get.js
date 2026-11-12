
import { list } from '@vercel/blob'

export default defineEventHandler(async () => {
  try {
    if (!process.env.BLOB_STORE_ID) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Blob Store ID is not configured.'
      })
    }

    // Get all audio files from Vercel Blob
    let cursor
    const allBlobs = []

    do {
      const result = await list({
        prefix: 'audio/',
        limit: 1000,
        cursor,
        storeId: process.env.BLOB_STORE_ID
      })

      allBlobs.push(...result.blobs)
      cursor = result.cursor
    } while (cursor)

    // Return only supported audio files
    return allBlobs
      .filter(blob =>
        /\.(mp3|wav|ogg|m4a|aac)$/i.test(blob.pathname)
      )
      .map(blob => ({
        name: blob.pathname.split('/').pop(),
        url: blob.url
      }))
      .sort((a, b) => a.name.localeCompare(b.name))

  } catch (error) {
    console.error('AUDIO LIBRARY BLOB ERROR:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Unable to read audio library from Blob Storage.'
    })
  }
})
