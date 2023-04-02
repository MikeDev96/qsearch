import express from 'express'
import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from 'url'
import router from './routes/api/router.js'

dotenv.config()

const app = express()

app.use("/", router)

const __dirname = fileURLToPath(new URL('.', import.meta.url))

app.use(express.static(path.join(__dirname, "client/build")))

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "client/build", "index.html"))
})

const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})