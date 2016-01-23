import React from "react"

// Feeling down?  Plop one of these components somewhere in your page for hours of entertainment!

export class MagicShadow extends React.Component {
  constructor() {
    super(...arguments)

    this.state = {
      coords: [],
      mouseDown: false,
    }
  }

  componentDidMount() {
    window.addEventListener("mousedown", this.onMouseDown)
    window.addEventListener("mouseup", this.onMouseUp)
    window.addEventListener("mousemove", this.onMouseMove)
  }
  componentWillUnmount() {
    window.removeEventListener("mousedown", this.onMouseDown)
    window.removeEventListener("mouseup", this.onMouseUp)
    window.removeEventListener("mousemove", this.onMouseMove)
  }

  getRelativeCoords = (e) => {
    const smile = React.findDOMNode(this.refs.shmiley)
    const rect = smile.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    return [x, y]
  }

  onMouseDown = (e) => {
    this.state.coords.push(this.getRelativeCoords(e))
    this.setState({
      mouseDown: true,
      coords: this.state.coords,
    })
  }

  onMouseUp = (e) => {
    this.setState({
      mouseDown: false,
    })
  }

  onMouseMove = (e) => {
    if (this.state.mouseDown) {

      this.state.coords.push(this.getRelativeCoords(e))
      this.setState({
        coords: this.state.coords,
      })
    }
  }

  render() {
    const shadowCoords = this.state.coords.map((c) => {
      return `${c[0]}px ${c[1]}px`
    }).join(", ")
    return (
      <i ref="shmiley" className="fa fa-smile-o" style={{zIndex: 9001, textShadow: shadowCoords}} />
    )
  }
}

export class MagicShadowImage extends React.Component {
  static propTypes = {
    imgURL: React.PropTypes.string.isRequired,
  }

  constructor() {
    super(...arguments)

    this.state = {
      img: null,
      canvas: null,
      shadow: "",
    }
  }

  componentDidMount() {
    let img = new Image()
    img.src = this.props.imgURL
    img.onload = () => {
      let canvas = document.createElement("canvas")
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      let ctx = canvas.getContext("2d")
      ctx.drawImage(img, 0, 0)
      let idat = ctx.getImageData(0, 0, canvas.width, canvas.height).data
      let shadow = []
      for(let i = 0; i < idat.length; i += 4) {
        const x = Math.floor((i / 4) / canvas.width)
        const y = Math.floor((i / 4) - (x * canvas.width))
        shadow.push(`${x + 1}px ${y + 1}px rgb(${idat[i]}, ${idat[i + 1]}, ${idat[i + 2]})`)
      }
      shadow = shadow.join(", ")
      this.setState({
        img,
        canvas,
        shadow,
      })
    }
  }

  render() {
    return (
      <i className="fa fa-smile-o" style={{fontSize: "1px", zIndex: 9001, textShadow: this.state.shadow}} />
    )
  }
}
