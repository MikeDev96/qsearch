import fetch from "node-fetch"

export const getTorrentProgress = async hashes => {
  if (!hashes) return {}

  try {
    const res = await fetch(`${process.env.URL}/api/v2/torrents/info?hashes=${encodeURIComponent(hashes)}`)
    if (!res.ok) return {}

    const data = await res.json()
    const hashMap = data.reduce((acc, cur) => {
      acc[cur.hash] = cur.progress
      return acc
    }, {})

    return hashMap
  }
  catch (err) {
    console.error(`Failed to get torrent progress\n${err.message}`)
    return {}
  }
}

export const addTorrent = async magnet => {
  try {
    const res = await fetch(`${process.env.URL}/api/v2/torrents/add?urls=${encodeURIComponent(magnet)}`)
    if (!res.ok) throw new Error(`Failed to download in qBittorrent\n${res.status}: ${res.statusText}`)

    return true
  }
  catch (err) {
    console.error(err)
    return false
  }
}