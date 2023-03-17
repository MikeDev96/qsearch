import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { CircularProgress, IconButton } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import CheckIcon from '@mui/icons-material/Check';

const DownloadButton = ({
  data, progress, onDownload,
}) => {
  if (progress === 1) {
    return (
      <CheckIcon color='success'  />
    )
  }

  if (progress >= 0) {
    return (
      <CircularProgress variant="determinate" value={progress * 100} size={18} sx={{ margin: "-2px" }} />
    )
  }

  return (
    <IconButton aria-label="download" onClick={() => onDownload(data)} sx={{ margin: -1 }}>
      <DownloadIcon fontSize="small" />
    </IconButton>
  )
}

export default DownloadButton