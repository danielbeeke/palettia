import {Router} from "../_snowpack/pkg/@vaadin/router";
import "./types.js";
import "./palettes-list.js";
import "./palette-edit.js";
const router = new Router(document.body);
router.setRoutes([
  {path: "/", component: "palettes-list"},
  {path: "/palette/:id", component: "palette-edit"},
  {path: "(.*)", component: "palettes-list"}
]);
