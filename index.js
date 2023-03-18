import express from 'express'
import fetch from 'node-fetch'
import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from 'url'

dotenv.config()

const app = express()

const token = "gmblwx3h6c"
const time = 2500

app.get('/api/search', (req, res) => {
  const doRarbg = () => {
    fetch(`https://torrentapi.org/pubapi_v2.php?mode=search&category=0&sort=seeders&format=json_extended&app_id=test&token=${token}&search_string=${encodeURIComponent(req.query.query)}&limit=100`)
      .then(res22 => {
        if (res22.ok) {
          res22.json()
            .then(res2 => {
              if (res2.rate_limit) {
                console.log("Rate limit")
                setTimeout(doRarbg, time)
              }
              else {
                const torrents = res2.torrent_results.map(tor => ({ ...tor, hash: /(?<=urn:btih:)\w+?(?=\b)/.exec(tor.download)[0] }))
                const hashes = torrents.map(tor => tor.hash).join("|")

                fetch(`${process.env.URL}/api/v2/torrents/info?hashes=${encodeURIComponent(hashes)}`)
                  .then(res3 => {
                    if (res3.ok) {
                      res3.json().then(res4 => {
                        const torMap = res4.reduce((acc, cur) => {
                          acc[cur.hash] = cur
                          return acc
                        }, {})

                        res.send(torrents.map(tor => {
                          return {
                            ...tor,
                            progress: torMap[tor.hash]?.progress || -1,
                          }
                        }))
                      })
                        .catch(err => {
                          res.status(500).send(`Failed to parse JSON - ${err}`)
                        })
                    }
                    else {
                      res.status(500).send(`Error when contacting qBittorrent API: ${res3.status} - ${res3.statusText}`)
                    }
                  })
                  .catch(err => {
                    res.status(500).send(`Error when fetching torrent progress: ${err}`)
                  })
              }
            })
            .catch(err => {
              console.log(err)
              setTimeout(doRarbg, time)
            })
        }
        else {
          console.log(`Status code ${res22.status} - ${res22.statusText}`)
          setTimeout(doRarbg, time)
        }
      })
      .catch(err => {
        console.log(err)
        setTimeout(doRarbg, time)
      })
  }

  doRarbg()
})

app.post('/api/download', (req, res) => {
  fetch(`${process.env.URL}/api/v2/torrents/add?urls=${encodeURIComponent(req.query.magnet)}`)
    .then(res2 => {
      res.sendStatus(200)
    }).catch(err => {
      console.log(err)
    })
})

app.get('/api/progress', (req, res) => {
  fetch(`${process.env.URL}/api/v2/torrents/info?hashes=${encodeURIComponent(req.query.hashes)}`)
    .then(res2 => {
      if (res2.ok) {
        res2.json().then(res3 => {
          res.send(res3.reduce((acc, cur) => {
            acc[cur.hash] = cur.progress
            return acc
          }, {}))
        })
        .catch(err => {
          res.status(500).send(`Failed to parse JSON - ${err}`)
        })
      }
      else {
        res.status(500).send(`Error when contacting qBittorrent API: ${res2.status} - ${res2.statusText}`)
      }
    })
    .catch(err => {
      res.status(500).send(`Error when fetching torrent progress: ${err}`)
    })
})

const __dirname = fileURLToPath(new URL('.', import.meta.url))

app.use(express.static(path.join(__dirname, "client/build")))

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "client/build", "index.html"))
})

const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})