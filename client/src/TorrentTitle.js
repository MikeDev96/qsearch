import { Fragment } from "react"

const TorrentTitle = ({
  title,
}) => {
  const split = title.split("x265")
  if (split.length < 2) {
    return title
  }

  return (
    <Fragment>
      {split[0]}
      <span style={{ background: "gold", color: "black" }}>x265</span>
      {split[1]}
    </Fragment>
  )
}

export default TorrentTitle