export interface AudioTrack {
  id: string
  title: string
  duration: string
  speed: number
  dateAdded: string
  url: string
}

export const useAudioLibrary = () => {
  const tracks = useState<AudioTrack[]>('audio_library_tracks', () => [
    {
      id: '1',
      title: 'Rain Ambience Sample',
      duration: '03:45',
      speed: 1.0,
      dateAdded: new Date().toLocaleDateString(),
      url: 'https://actions.google.com/sounds/v1/ambiences/rain_heavy.ogg'
    }
  ])

  const addTrack = (track: Omit<AudioTrack, 'id' | 'dateAdded'>) => {
    const newTrack: AudioTrack = {
      ...track,
      id: Date.now().toString(),
      dateAdded: new Date().toLocaleDateString()
    }
    tracks.value.push(newTrack)
  }

  const deleteTrack = (id: string) => {
    tracks.value = tracks.value.filter(t => t.id !== id)
  }

  return {
    tracks,
    addTrack,
    deleteTrack
  }
}