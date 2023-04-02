import { useMediaQuery, useTheme } from "@mui/material"
import TorrentsList from "./TorrentsList"
import TorrentsTable from "./TorrentsTable"

const TorrentsView = ({
  torrents, dl, onDownload,
}) => {
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.up('md'))

  return (
    matches ? <TorrentsTable torrents={torrents} dl={dl} onDownload={onDownload} /> : <TorrentsList torrents={torrents} dl={dl} onDownload={onDownload} />
  )
}

export default TorrentsView