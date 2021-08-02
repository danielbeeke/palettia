import { define, html } from 'uce'
import { useState } from './helpers/useState'
import { loadHandle } from './helpers/loadHandle'
import { HandleStore } from './HandleStore'
import { Router } from '@vaadin/router'
import { findPosition } from './helpers/findPosition'
import { PaletteEdit } from './types'
import { rgbToHex } from './helpers/rgbToHex'
import { hexToRgb } from './helpers/hexToRgb'

const paletteEdit: PaletteEdit = {
  async render() {

    const temporaryState = useState('palette-' + this.location.params.id + '-url', {
      url: null,
      activeDot: null,
      isDragging: false,
      isDotEditing: false,
      canvas: null,
      dotDragStartY: null,
      dotDragStartTransform: ''
    })

    const state = useState('palette-' + this.location.params.id, {
      fileName: null,
      id: this.location.params.id,
      dots: []
    })

    const addPhoto = async () => {
      const [ fileHandle ] = await window.showOpenFilePicker({
        types: [{
          description: 'Images',
          accept: { 'image/*': ['.png', '.gif', '.jpeg', '.jpg'] }
        }],
        excludeAcceptAllOption: true,
        multiple: false
      })

      const file = await fileHandle.getFile()
      state.fileName = file.name
      await HandleStore.storeHandle(fileHandle)
      state.save()
      const fileData = await fileHandle.getFile()
      temporaryState.url = URL.createObjectURL(fileData)
      this.render()
    }

    const initiateCanvas = (canvasElement) => {
      temporaryState.canvas = canvasElement
      if (temporaryState.canvas.initiated) return
      const context = temporaryState.canvas.getContext('2d')
      temporaryState.image = document.createElement('img')

      temporaryState.image.addEventListener('load', () => {
        temporaryState.canvas.width = temporaryState.image.width
        temporaryState.canvas.height = temporaryState.image.height
        drawCanvas()
      })
      temporaryState.image.addEventListener('error', async (error) => Router.go('/'))
      temporaryState.image.src = temporaryState.url

      temporaryState.canvas.addEventListener('touchstart', (event) => {
        const position = findPosition(this)
        const x = event.touches[0].pageX - position.x;
        const y = event.touches[0].pageY - position.y;
        const [r, g, b, a] = context.getImageData(x, y, 1, 1).data
        const dot = { x, y, r, g, b, a, s: 1 }
        state.dots.push(dot)
        temporaryState.activeDot = dot
        temporaryState.isDragging = true
      })

      temporaryState.canvas.addEventListener('touchmove', (event) => {
        if (temporaryState.isDragging && temporaryState.activeDot) {
          const position = findPosition(this)
          const newX = event.touches[0].pageX - position.x;
          const newY = event.touches[0].pageY - position.y;
          
          const { x, y } = temporaryState.activeDot

          const diffX = x - newX
          const diffY = y - newY
          const s = Math.max(Math.abs(diffX), Math.abs(diffY))
          temporaryState.activeDot.s = s
          drawCanvas()
          this.render()
        }
      })

      temporaryState.canvas.addEventListener('touchend', () => {
        temporaryState.activeDot = null
        temporaryState.isDragging = false
        state.save()
        this.render()
      })

      temporaryState.canvas.initiated = true
    }

    const drawCanvas = () => {
      if (!temporaryState.image || !temporaryState.canvas) return
      const context = temporaryState.canvas.getContext('2d')
      context.drawImage(temporaryState.image, 0, 0)

      for (const dot of state.dots) {
        const { x, y, r, g, b, a, s } = dot

        context.beginPath()
        context.fillStyle = `rgba(${[r, g, b, a].join(',')})`
        context.arc(x, y, s, 0, 2 * Math.PI)
        context.fill()
      }
    }

    if (state.fileName && !temporaryState.url) {
      try {
        temporaryState.url = await loadHandle(state.fileName)
        this.render()  
      }
      catch (error) {
        Router.go('/')
      }
    }

    const colorChange = (event, dot) => {
      const color = hexToRgb(event.target.value)
      Object.assign(dot, color)
      state.save()
      drawCanvas()
      this.render()
    }

    const indexes = [...state.dots].sort(({s: sa}, {s: sb}) => sb - sa)
    
    const dotTouchStart = (event) => {
      temporaryState.dotDragStartY = event.changedTouches[0].screenY
      temporaryState.dotDragStartTransform = event.target.closest('.dot').style.transform
    }

    const dotTouchMove = (event) => {
      const delta = temporaryState.dotDragStartY - event.changedTouches[0].screenY
      const dotElement = event.target.closest('.dot')
      dotElement.style.transition = 'none'
      dotElement.style.transform = `${temporaryState.dotDragStartTransform} translateY(-${delta}px)`
    }

    const dotTouchEnd = (event, dot) => {
      const dotElement = event.target.closest('.dot')
     delete dotElement.style.transition
     dotElement.style.transform = temporaryState.dotDragStartTransform

      if (event.changedTouches[0].screenY < window.innerHeight / 3 * 2) {
        const index = state.dots.indexOf(dot)
        state.dots.splice(index, 1)
        state.save()
        drawCanvas()
        this.render()  
      }
    }

    this.html`
      ${!temporaryState.url ? html`
      <div class="toolbar">
        <button onclick=${addPhoto}>
          <img src="/images/add_photo.svg" />
        </button>
      </div>
      ` : null}

      ${state.dots.length ? html`
      <div class="palette-dots">
        ${state.dots
          .map((dot) => {
            const {r, g, b, a} = dot
            const index = indexes.indexOf(dot)
            return html`
            <div class="dot" style=${`--index: ${index};`} ontouchstart=${dotTouchStart} ontouchmove=${dotTouchMove} ontouchend=${(event) => dotTouchEnd(event, dot)}>
              <input oninput=${(event) => colorChange(event, dot)} type="color" value=${rgbToHex(r, g, b)} />
            </div>
            `
          })}
      </div>
      ` : null}

      ${temporaryState.url ? html`
        <canvas class="photo" ref=${initiateCanvas} />
      ` : null}
    `;
  },
}

define('palette-edit', paletteEdit)