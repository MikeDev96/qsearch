import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Autocomplete, Avatar, Box, CircularProgress, Container, createTheme, CssBaseline, debounce, Grid, TextField, ThemeProvider, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import useDownloadManager from './useDownloadManager';
import { useSearchParams } from 'react-router-dom';
import TorrentsView from './TorrentsView';
import { isStar } from './TorrentStar';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const controller = new AbortController();
const { signal } = controller;

function App() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [query, setQuery] = useState(searchParams.get("query") ?? "")
  const [data, setData] = useState([])
  const [imdbLoading, setImdbLoading] = useState(false)
  const [torrentLoading, setTorrentLoading] = useState(false)
  const [imdb, setImdb] = useState(null)
  const [imdbId, setImdbId] = useState(searchParams.get("id") ?? "")
  const [imdbResults, setImdbResults] = useState([])

  const { progressMap: dl, download } = useDownloadManager(data, setData)

  const searchImdb = useCallback((q) => {
    if (q) {
      setImdbLoading(true)
      fetch(`api/imdb?q=${encodeURIComponent(q)}`, { signal })
        .then(res => res.json())
        .then(setImdbResults)
        .finally(() => setImdbLoading(false))
    }
  }, [])

  const inputRef = useRef()
  const { current: searchImdbDebounced } = useRef(debounce(searchImdb, 500))

  useEffect(() => {
    setSearchParams({ id: imdbId, query: query }, { replace: true })
  }, [imdbId, query, setSearchParams])

  useEffect(() => {
    setData([])

    if (!imdbId) return

    setTorrentLoading(true)
    fetch(`api/search?query=${encodeURIComponent(imdbId)}`)
      .then(res => {
        if (res.ok) {
          res.json().then(data => {
            setData(data.sort((a, b) => (isStar(b) | 0) - (isStar(a) | 0)))
            const imdb = data.find(item => item.id === imdbId)
            if (imdb) {
              setImdb(imdb)
            }
          })
        }
        else {
          console.log(`${res.status} - ${res.statusText}`)
        }
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => setTorrentLoading(false))
  }, [imdbId])

  useEffect(() => {
    if (!query) {
      searchImdbDebounced.clear()
      setImdbResults([])
    }
    else {
      searchImdbDebounced(query)
    }
  }, [query, searchImdbDebounced])

  useEffect(() => {
    setTimeout(() => {
      inputRef.current.focus()
    }, 100)
  }, [])

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container component="main" maxWidth="md">
        <Box
          sx={{
            marginTop: 8,
            marginBottom: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <SearchIcon />
          </Avatar>
          <Typography component="h1" variant="h5">qSearch</Typography>
          <Autocomplete
            fullWidth
            options={imdbResults}
            autoComplete
            filterOptions={(x) => x}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            filterSelectedOptions
            value={imdb}
            noOptionsText="No results..."
            getOptionLabel={option => option.l ?? ""}
            onChange={(event, newValue) => {
              setImdb(newValue)
              setImdbId(newValue?.id ?? "")
            }}
            onInputChange={(event, newInputValue) => {
              if (event?.type === "change") {
                setQuery(newInputValue)
              }
            }}
            inputValue={query}
            blurOnSelect
            renderInput={(params) =>
              <TextField
                {...params}
                margin="normal"
                label="Search IMDb..."
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <Fragment>
                      {imdbLoading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </Fragment>
                  ),
                }}
                inputRef={inputRef}
                autoComplete="off"
                autoCapitalize="off"
              />
            }
            renderOption={(props, option) => {
              return (
                <li {...props} key={option.id}>
                  <Grid container alignItems="center">
                    <Grid item sx={{ display: 'flex', width: 50 }}>
                      <img loading="lazy" width={40} src={option.i?.imageUrl ?? ""} alt="" />
                    </Grid>
                    <Grid item sx={{ width: 'calc(100% - 50px)', wordWrap: 'break-word' }}>
                      <Box
                        component="span"
                        sx={{ fontWeight: 'bold' }}
                      >
                        {option.l}
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {option.y}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {option.s}
                      </Typography>
                    </Grid>
                  </Grid>
                </li>
              )
            }}
          />
          {torrentLoading && <CircularProgress color="inherit" sx={{ marginTop: 2 }} />}
          {!!data.length && <TorrentsView torrents={data} dl={dl} onDownload={download} />}
        </Box>
      </Container>
    </ThemeProvider>
  )
}

export default App