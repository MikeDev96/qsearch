import { Divider, List, ListItem, ListItemText, Paper } from "@mui/material"
import { Fragment } from "react"
import TorrentTitle from "./TorrentTitle"
import DownloadButton from "./DownloadButton"
import TorrentStar from "./TorrentStar"
import TorrentDate from "./TorrentDate"

const TorrentsList = ({
  torrents, dl, onDownload,
}) => {
  return (
    <Paper sx={{ width: "100%" }}>
      <List disablePadding>
        {torrents.map((tor, idx) =>
          <Fragment>
            <ListItem key={idx}>
              <ListItemText
                primary={
                  <Fragment>
                    <TorrentTitle title={tor.title} />
                    <TorrentStar tor={tor} />
                  </Fragment>
                }
                primaryTypographyProps={{ sx: { wordBreak: "break-word" } }}
                secondary={
                  <Fragment>
                    <TorrentDate tor={tor} />
                    {" • "}
                    {tor.size}
                    {" • "}
                    {`${tor.seeders} Seeders`}
                  </Fragment>
                }
              />
              <DownloadButton data={tor} progress={dl[tor.hash] || tor.progress} onDownload={onDownload} />
            </ListItem>
            {idx !== (torrents.length - 1) && <Divider component="li" />}
          </Fragment>
        )}
      </List>
    </Paper>
  )
}

export default TorrentsList