import fs from "fs"
import { searchTorrents } from '../../rarbg.js'
import { getTorrentProgress } from '../../qbit.js'

export default async (req, res) => {
  // if (fs.existsSync("../../dummydata/api/search.js")) {
    // return fs.readFileSync("dummydata/api/search.js")
    // return res.send((await import("../../dummydata/api/search.js")).default)
  // }

  try {
    const torrents = await searchTorrents(req.query.query)

    const hashes = torrents.filter(tor => tor.hash).map(tor => tor.hash).join("|")
    const torMap = await getTorrentProgress(hashes)

    res.send(torrents.map(tor => {
      return {
        ...tor,
        progress: torMap[tor.hash] ?? -1,
      }
    }))
  }
  catch (err) {
    res.status(500).send(err.toString())
  }
}