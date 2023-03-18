import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Avatar, Box, CircularProgress, Container, createTheme, CssBaseline, IconButton, InputAdornment, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, ThemeProvider, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';
import ClearIcon from '@mui/icons-material/Clear';
import { useEffect, useRef, useState } from 'react';
import DownloadButton from './DownloadButton';
import { filesize } from "filesize";
import useDownloadManager from './useDownloadManager';
import { useSearchParams } from 'react-router-dom';
import { deviceType } from 'detect-it';
import TorrentTitle from './TorrentTitle';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  const [searchParams, setSearchParams] = useSearchParams()
  const setSearchParamsRef = useRef(setSearchParams)

  const [query, setQuery] = useState(searchParams.get("query") ?? "")
  const [query2, setQuery2] = useState(query)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  const { progressMap: dl, download } = useDownloadManager(data, setData)

  useEffect(() => {
    setSearchParamsRef.current({ query })
    setData([])

    if (!query) return

    setLoading(true)
    fetch(`api/search?query=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(res => {
        setData(res.sort((a,b) => (isStar(b) | 0) - (isStar(a) | 0)))
      })
      .finally(() => setLoading(false))
  }, [query])

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container component="main" maxWidth="md">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <SearchIcon />
          </Avatar>
          <Typography component="h1" variant="h5">qSearch</Typography>
          <TextField
            margin="normal"
            fullWidth
            id="query"
            label="Query"
            name="query"
            autoFocus
            onKeyDown={e => {
              if (e.key === "Enter") {
                setQuery(e.target.value)
                if (deviceType === "touchOnly") {
                  e.target.blur()
                }
              }
            }}
            // defaultValue={query}
            value={query2}
            onChange={e => setQuery2(e.target.value)}
            InputProps={{
              endAdornment: <InputAdornment position="end">
                {loading && <CircularProgress />}
                {!!query2 &&
                  <IconButton
                    onClick={e => {
                      setQuery("")
                      setQuery2("")
                    }}
                  >
                    <ClearIcon />
                  </IconButton>
                }
              </InputAdornment>,
            }}
          />
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  {/* <TableCell></TableCell> */}
                  <TableCell>Title</TableCell>
                  <TableCell align="right">Size</TableCell>
                  <TableCell align="right">Seeders</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row, idx) => (
                  <TableRow
                    key={idx}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    {/* <TableCell>
                    </TableCell> */}
                    <TableCell sx={{ wordBreak: "break-word" }}>
                      {/* {isStar(row) && <StarIcon sx={{ margin: "-8px 8px -8px -8px", color: 'gold' }} />} */}
                      <TorrentTitle title={row.title} />
                      {isStar(row) && <span style={{ userSelect: "none" }}>⭐</span>}
                    </TableCell>
                    {/* <TableCell align="right">{filesize(row.size)}</TableCell> */}
                    <TableCell align="right">{row.size}</TableCell>
                    <TableCell align="right">{row.seeders}</TableCell>
                    <TableCell align='center'>
                      <DownloadButton data={row} progress={dl[row.hash] || row.progress} onDownload={download} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

const isStar = data => data.title.endsWith("x265-RARBG")

export default App;
