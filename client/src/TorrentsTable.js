import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import DownloadButton from './DownloadButton';
import TorrentDate from './TorrentDate';
import TorrentStar from './TorrentStar';
import TorrentTitle from './TorrentTitle';

const TorrentsTable = ({
  torrents, dl, onDownload,
}) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell align="right">Added</TableCell>
            <TableCell align="right">Size</TableCell>
            <TableCell align="right">Seeders</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {torrents.map((row, idx) => (
            <TableRow
              key={idx}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell sx={{ wordBreak: "break-word" }}>
                <TorrentTitle title={row.title} />
                <TorrentStar tor={row} />
              </TableCell>
              <TableCell align="right"><TorrentDate tor={row} dateTimeNewLine /></TableCell>
              <TableCell align="right">{row.size}</TableCell>
              <TableCell align="right">{row.seeders}</TableCell>
              <TableCell align='center'>
                <DownloadButton data={row} progress={dl[row.hash] || row.progress} onDownload={onDownload} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default TorrentsTable