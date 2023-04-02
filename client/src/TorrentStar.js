const TorrentStar = ({
  tor,
}) => {
  return (
    isStar(tor) && <span style={{ userSelect: "none" }}>⭐</span>
  )
}

export const isStar = data => data.title.endsWith("x265-RARBG")

export default TorrentStar