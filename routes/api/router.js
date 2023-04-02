import { Router } from "express"
import download from "./download.js"
import imdb from "./imdb.js"
import progress from "./progress.js"
import search from "./search.js"

const router = Router()

router.get('/api/search', search)
router.get('/api/progress', progress)
router.get('/api/imdb', imdb)
router.post('/api/download', download)

export default router