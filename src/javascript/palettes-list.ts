import { define, html } from 'uce'
import greetings from './greetings'
import { uuid } from './helpers/uuid'
import { loadHandle } from './helpers/loadHandle'
import { paletteState } from './types'
import { Router } from '@vaadin/router';
import { PaletteEdit } from './palette-edit'

define('palettes-list', {
  render() {
    const palettes = Object.keys(localStorage)
    .filter(key => key.startsWith('palette-'))
    .map(paletteKey => (JSON.parse(localStorage.getItem(paletteKey)) as paletteState))
    const greeting = greetings[Math.floor(Math.random() * greetings.length)];

    const newPalette = () => {
      location.replace(`/palette/${uuid()}`)
    }

    const preloadAndRedirect = async (palette: paletteState, event) => {
      event.preventDefault()
      await loadHandle(palette.fileName)
      Router.go(`/palette/${palette.id}`)
    }

    this.html`
      <h1>${greeting}</h1>
      <button onclick=${newPalette} class="button">+</button>
      ${palettes.length === 0 ? html`
      <p>Hello, welcome to Palettia! Click on the big + to create your first palette.</p>
      ` : null}
      ${palettes.map(palette => html`
        <a onclick=${(event) => preloadAndRedirect(palette, event)} href="${`/palette/${palette.id}`}">${palette.fileName}</a>
      `)}
    `;
  },
})