import fetch from "node-fetch"

export const searchImdb = async query => {
  try {
    // const imdbRes = await fetch(`https://www.imdb.com/find/?s=tt&q=${encodeURIComponent(req.query.query)}`)
    // if (!imdbRes.ok) return res.status(500).send("Failed to query IMDB")

    // const html = await imdbRes.text()
    // const match = /<script id="__NEXT_DATA__" type="application\/json">(?<json>.+?)<\/script>/s.exec(html)
    // if (!match) return res.status(500).send("Failed to find JSON in IMDB response")

    // const data = JSON.parse(match.groups.json)
    // res.send(data.props.pageProps.titleResults.results)

    const res = await fetch(`https://v3.sg.media-imdb.com/suggestion/titles/x/${encodeURIComponent(query)}.json`)
    if (!res.ok) throw new Error("Failed to query IMDB")

    const data = await res.json()
    return data.d
  }
  catch (err) {
    console.error(err)
    return []
  }
}