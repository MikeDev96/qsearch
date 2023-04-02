import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Box, CircularProgress, IconButton } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import CheckIcon from '@mui/icons-material/Check';
import { grey } from '@mui/material/colors';

const DownloadButton = ({
  data, progress, onDownload,
}) => {
  // progress = 1

  if (progress === 1) {
    return (
      // <CheckIcon color='success' sx={{ margin: "-6px -12px" }} />
      <CheckIcon color='success' sx={{margin: "0 0 0 .5em"}} />
    )
  }

  if (progress >= 0) {
    return (
      <Box sx={{ position: 'relative', display: 'inline-flex', margin: "-2px 0 -2px 1em" }}>
        <CircularProgress variant="determinate" value={1 * 100} size={18} style={{ color: grey[700] }} />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress variant="determinate" value={progress * 100} size={18} color="primary" />
        </Box>
      </Box>
    )
  }

  return (
    <IconButton aria-label="download" onClick={() => onDownload(data)} sx={{ margin: "-8px -8px -8px .5em" }}>
      <DownloadIcon fontSize="small" />
    </IconButton>
  )
}

export default DownloadButton