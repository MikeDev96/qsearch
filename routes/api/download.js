import { addTorrent } from "../../qbit.js"
import { getMagnetLink } from "../../rarbg.js"

export default async (req, res) => {
  try {
    const magnetHash = await getMagnetLink(req.query.magnet)
    if (!magnetHash) return res.status(500).send("Failed to get magnet link, see error log")

    const { magnet, hash } = magnetHash

    const added = await addTorrent(magnet)
    if (!added) return res.status(500).send("Failed to add torrent, see error log")

    res.send({ hash })
  }
  catch (err) {
    return res.status(500).send(`Something went wrong, see error:\n${err}`)
  }
}