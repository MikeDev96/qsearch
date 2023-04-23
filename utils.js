import { createWorker } from "tesseract.js"

export const imageToText = async buffer => {
  const worker = await createWorker({ cacheMethod: "none" })
  await worker.loadLanguage("eng")
  await worker.initialize("eng")

  const { data: { text } } = await worker.recognize(buffer)
  
  await worker.terminate()

  return text
}