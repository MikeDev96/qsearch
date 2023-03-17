import { useCallback, useEffect, useRef, useState } from "react"

const useDownloadManager = (torrents, setTorrents) => {
  const [progressMap, setProgressMap] = useState({})

  const handleRef = useRef()

  const getProgress = useCallback(() => {
    const hashes = torrents.filter(tor => tor.progress >= 0 && tor.progress < 1).map(tor => tor.hash)
    if (!hashes.length) return Promise.reject()

    return fetch(`api/progress?hashes=${encodeURIComponent(hashes.join("|"))}`)
      .then(res => res.json())
      .then(res => {
        setProgressMap(res)
      })
      .catch(err => {
        console.error(err)
      })
  }, [torrents])

  useEffect(() => {
    const startLoop = () => {
      getProgress()
        .then(() => {
          handleRef.current = setTimeout(startLoop, 2000)
        })
        .catch(() => {

        })
    }

    startLoop()

    return () => {
      clearTimeout(handleRef.current)
    }
  }, [getProgress, torrents])

  const download = torrent => {
    fetch(`api/download?magnet=${encodeURIComponent(torrent.download)}`, { method: "POST" })
      .then(res => {
        if (res.ok) {
          setTorrents(tors => {
            const idx = tors.findIndex(tor => tor.hash === torrent.hash)
            return [
              ...tors.slice(0, idx),
              { ...tors[idx], progress: 0 },
              ...tors.slice(idx + 1),
            ]
          })
          // getProgress()
        }
      })
      .catch(err => {
        console.error(err)
      })
  }

  return {
    progressMap,
    download,
  }
}

export default useDownloadManager