import { ElementKeys } from '~/constants/ConfigKeys'

const addCanvasBackground = (imageUrl: string) => {
  var div = document.getElementById(ElementKeys.PAGE)
  const style = `url(${imageUrl})`
  if (!div) { return }
  div.style.background = style
}

const openExternalWindow = (url: string) => {
  const page = window.open(url, '_blank')
  if (page && page.focus)
  {
    page.focus()
  }
  else if (!page)
  {
    window.location.href = url
  }
}

export {
  addCanvasBackground,
  openExternalWindow
}
