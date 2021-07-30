import {define, html} from "../_snowpack/pkg/uce";
import {useState} from "./helpers/useState.js";
import {HandleStore} from "./HandleStore.js";
let url;
define("palette-edit", {
  async render() {
    const state = useState("palette-" + this.location.params.id, {
      url: null,
      fileName: null
    });
    const addPhoto = async () => {
      const [fileHandle] = await window.showOpenFilePicker({
        types: [{
          description: "Images",
          accept: {"image/*": [".png", ".gif", ".jpeg", ".jpg"]}
        }],
        startIn: "pictures",
        excludeAcceptAllOption: true,
        multiple: false
      });
      const file = await fileHandle.getFile();
      state.fileName = file.name;
      await HandleStore.storeHandle(fileHandle);
      state.save();
      const fileData = await fileHandle.getFile();
      url = URL.createObjectURL(fileData);
      this.render();
    };
    const loadHandle = async () => {
      if (state.fileName) {
        const fileHandle = await HandleStore.getByName(state.fileName);
        await fileHandle.requestPermission();
        const fileData = await fileHandle.getFile();
        url = URL.createObjectURL(fileData);
        this.render();
      }
    };
    const drawImage = (canvas) => {
      const context = canvas.getContext("2d");
      const image = document.createElement("img");
      image.addEventListener("load", () => {
        console.log(image);
        context.drawImage(image, 0, 0, window.innerWidth, window.innerHeight, 0, 0, canvas.width, canvas.height);
      });
      image.src = url;
    };
    this.html`
     

      <div class="toolbar">
        ${state.fileName && !url ? html`
        <button onclick=${loadHandle}>
          <img src="/images/load.svg" />
        </button>
        ` : null}

        <button onclick=${addPhoto}>
          <img src="/images/add_photo.svg" />
        </button>
      </div>

      ${url ? html`<canvas class="photo" ref=${drawImage} />` : null}
    `;
  }
});
