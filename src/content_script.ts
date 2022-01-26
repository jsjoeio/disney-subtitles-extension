const CLIPBOARD_ID = "copy-clipboard-btn"
const disneyClipboardHTML = `<button id="${CLIPBOARD_ID}"type="button" aria-label="Copy to clipboard" class="control-icon-btn" role="button" tabindex="0"><div class="focus-hack-div" tabindex="-1"><svg class="w-6 h-6" fill="white" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg></div></button>`

async function copyToClipboard(
  _window: Window,
  _document: Document,
  _navigator: Navigator
) {
  console.log("calling copy to clipboard")
  const subtitles = getSubtitles(_document)
  await _navigator.clipboard.writeText(subtitles)
}

function registerCopyToClipboardEventListener(
  _window: Window,
  _document: Document,
  _navigator: Navigator,
  element: HTMLElement
) {
  console.log("registering copy to clipboard")
  element.addEventListener("click", () => {
    copyToClipboard(_window, _document, _navigator)
  })
}

/**
 * Adds clipboard SVG HTML to DOM in controls center
 */
export function insertClipboardSVGIntoDOM(_document: Document) {
  const controlCenter = _document.querySelector(".controls__center")

  if (controlCenter) {
    controlCenter.insertAdjacentHTML("beforeend", disneyClipboardHTML)
    return
  }

  console.warn("[joe] didn't find center controls")
}

export async function init() {
  console.log("running init")
  insertClipboardSVGIntoDOM(document)

  const clipboardElement: HTMLDivElement | null = document.querySelector(
    `#${CLIPBOARD_ID}`
  )

  if (clipboardElement) {
    registerCopyToClipboardEventListener(
      window,
      document,
      navigator,
      clipboardElement
    )
  } else {
    console.warn("couldn't find clipboard element")
  }
}

export function getSubtitles(_dom: Document): string {
  if (_dom) {
    const elements = _dom.querySelectorAll<HTMLSpanElement>(
      ".dss-subtitle-renderer-line"
    )

    const lines = Array.from(elements).map(
      (el: HTMLSpanElement) => el.textContent
    )

    return lines.join(" ")
  }

  return ""
}

;(async function () {
  // We need to do this because controlCenter doesn't load right away
  // https://stackoverflow.com/a/48602881/3015595
  // don't run until control center is ready maybe?
  while (!document.querySelector(".controls__center")) {
    console.log("waiting for element to be available")
    await new Promise((r) => setTimeout(r, 1000))
  }
  console.log(
    "This means it should be there",
    document.querySelector(".controls__center")
  )
  await init()
})()
