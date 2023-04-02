import { getTorrentProgress } from "../../qbit.js"

export default async (req, res) => {
  try {
    const progress = await getTorrentProgress(req.query.hashes)
    res.send(progress)
  }
  catch (err) {
    console.error(err)
    res.status(500).send(`Failed to get torrent progress\n${err.message}`)
  }
}