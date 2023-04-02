import { searchImdb } from "../../imdb.js"

export default async (req, res) => {
  try {
    const imdb = await searchImdb(req.query.q)
    res.send(imdb)
  }
  catch (err) {
    console.log(err)
  }
}