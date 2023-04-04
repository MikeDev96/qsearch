import { chromium } from "playwright"
import ReadText from "text-from-image"
import fs from "fs"
import fetch from "node-fetch"

let hashMap
let rookie = ""

if (!fs.existsSync("cache")) {
  fs.mkdirSync("cache")
}

if (fs.existsSync("cache/rarbg-hash-map.json")) {
  hashMap = JSON.parse(fs.readFileSync("cache/rarbg-hash-map.json"))
}
else {
  hashMap = {}
}

export const getRookie = async () => {
  if (!rookie) {
    if (fs.existsSync("cache/rookie.txt")) {
      rookie = fs.readFileSync("cache/rookie.txt", { encoding: "utf8" })
    }
  }

  if (!rookie) {
    rookie = await getRarbgCookie()
    fs.writeFileSync("cache/rookie.txt", rookie, { encoding: "utf8" })
  }

  return rookie
}

export const getRarbgCookie = async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.goto("https://rarbgto.org/torrents.php")

  if (page.url().includes("threat_defence.php")) {
    await page.waitForSelector("input[name='solve_string']")

    const captchaBuffer = await page.screenshot({ clip: { x: 640, y: 168.65625, width: 160, height: 75 } })
    const answer = (await ReadText(captchaBuffer)).trim()

    const el = await page.$("input[name='solve_string']")
    await el.type(answer)
    await el.press("Enter")

    await page.waitForURL("https://rarbgto.org/torrents.php*")
  }

  const cookies = await page.context().cookies()
  const cookieString = cookies.map(c => `${c.name}=${c.value}`).join("; ")

  await page.close()
  await browser.close()

  return cookieString
}

export const getRarbgId = downloadLink => {
  const { groups: { rarbgId } } = downloadLink.match(/\/torrent\/(?<rarbgId>.+)/)
  return rarbgId
}

export const getMagnetLink = async torrentId => {
  try {
    const rarbgRes = await fetch(`https://rarbgto.org${torrentId}`, {
      headers: {
        "cookie": (await getRookie()),
        "user-agent": `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36`,
      },
    })

    if (!rarbgRes.ok) throw new Error(`Failed to fetch from RARBG\n${rarbgRes.status}: ${rarbgRes.statusText}`)

    const html = await rarbgRes.text()

    const match = html.match(/(?<magnet>magnet:.+?urn:btih:(?<hash>.+?)\b.+?.+?)"/)
    if (!match) throw new Error(`Failed to find a magnet link`)

    const { groups: { magnet, hash } } = match

    hashMap[getRarbgId(torrentId)] = hash
    fs.writeFileSync("cache/rarbg-hash-map.json", JSON.stringify(hashMap, null, 2))

    return { magnet, hash }
  }
  catch (err) {
    console.error(err.message)
    return null
  }
}

export const searchTorrents = async query => {
  try {
    const res = await fetch(`https://rarbgto.org/torrents.php?search=${query}`, {
      headers: {
        "cookie": (await getRookie()),
        "user-agent": `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36`,
      }
    })

    if (!res.ok) throw new Error(`Failed to search RARBG\n${res.status}: ${res.statusText}`)

    if (res.url.includes("threat_defence.php")) {
      rookie = ""
      fs.writeFileSync("cache/rookie.txt", rookie, { encoding: "utf8" })
      return await searchTorrents(query)
    }

    const html = await res.text()
    if (html.includes("We have too many requests from your ip in the past 24h.")) throw new Error("You have been IP banned from RARBG")

    const torrents = Array.from(html.matchAll(/<tr class="lista2".+?<td.+?<td.+?href="(?<download>.+?)".+?title="(?<title>.+?)".+?<td.+?>(?<date>.+?)<.+?<td.+?>(?<size>.+?)<.+?<td.+?color=.+?>(?<seeders>.+?)<.+?<td.+?>(?<leechers>.+?)<.+?<\/tr>/gs))
      .map(m => ({
        ...m.groups,
        hash: hashMap[getRarbgId(m.groups.download)],
      }))

    return torrents
  }
  catch (err) {
    // console.error(err)
    throw err
    return []
  }
}