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
  // const setSearchParamsRef = useRef(setSearchParams)

  const [query] = useState(searchParams.get("query") ?? "")
  const [query2, setQuery2] = useState(query)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [loading2, setLoading2] = useState(false)
  const [test, setTest] = useState(null)
  const [id, setId] = useState(searchParams.get("id") ?? "")

  const { progressMap: dl, download } = useDownloadManager(data, setData)

  useEffect(() => {
    setSearchParams({ id, query: query2 }, { replace: true })
  }, [id, query2, setSearchParams])

  useEffect(() => {
    setData([])

    if (!id) return

    setLoading2(true)
    fetch(`api/search?query=${encodeURIComponent(id)}`)
      .then(res => {
        if (res.ok) {
          res.json().then(data => {
            setData(data.sort((a, b) => (isStar(b) | 0) - (isStar(a) | 0)))
            const lul = data.find(item => item.id === id)
            console.log(data, lul, id)
            if (lul) {
              setTest(lul)
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
      .finally(() => setLoading2(false))
  }, [id])

  const [imdbResults, setImdbResults] = useState([])

  const hmm = useCallback((q) => {
    if (!q) {
      console.log("fire1")
      // setImdbResults([])
    }
    else {
      setLoading(true)
      fetch(`api/imdb?q=${encodeURIComponent(q)}`, { signal })
        .then(res => res.json())
        .then(setImdbResults)
        .finally(() => setLoading(false))
    }
  }, [])

  const testy = useRef(debounce(hmm, 500))

  useEffect(() => {
    if (!query2) {
      testy.current.clear()
      setImdbResults([])
    }
    else {
      testy.current(query2)
    }
  }, [query2])

  const inputRef = useRef()

  useEffect(() => {
    inputRef.current.focus()
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
            value={test}
            noOptionsText="No results..."
            getOptionLabel={option => option.l ?? ""}
            onChange={(event, newValue) => {
              setTest(newValue)
              setId(newValue?.id ?? "")
            }}
            onInputChange={(event, newInputValue) => {
              console.log("set to", newInputValue, event?.type, event)
              if (event?.type === "change") {
                console.log("wtf")
                setQuery2(newInputValue)
              }
            }}
            inputValue={query2}
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
                      {loading ? <CircularProgress color="inherit" size={20} /> : null}
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
          {loading2 && <CircularProgress color="inherit" sx={{ marginTop: 2 }} />}
          {!!data.length && <TorrentsView torrents={data} dl={dl} onDownload={download} />}
        </Box>
      </Container>
    </ThemeProvider>
  )
}

export default App