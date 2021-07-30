import {define, html} from "../_snowpack/pkg/uce";
import greetings from "./greetings.js";
import {uuid} from "./helpers/uuid.js";
define("palettes-list", {
  render() {
    const palettes = localStorage.palettes ? JSON.parse(localStorage.palettes) : [];
    const greeting = greetings[Math.floor(Math.random() * greetings.length)];
    const newPalette = () => {
      location.replace(`/palette/${uuid()}`);
    };
    this.html`
      <h1>${greeting}</h1>
      <button onclick=${newPalette} class="button">+</button>
      ${palettes.length === 0 ? html`
      <p>Hello, welcome to Palettia! Click on the big + to create your first palette.</p>
      ` : null}
    `;
  }
});
