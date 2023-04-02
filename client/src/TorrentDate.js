import { DateTime } from "luxon"

const TorrentDate = ({
  tor, dateTimeNewLine,
}) => {
  let str = DateTime.fromISO(tor.date.replace(" ", "T")).toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS)
  if (dateTimeNewLine) {
    str = str.replace(", ", "\n")
  }

  return str
}

export default TorrentDate