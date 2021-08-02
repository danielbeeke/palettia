import { html, render, define } from 'uce'
import { Router } from '@vaadin/router';
import './App'

import './palettes-list'
import './palette-edit'

export const router = new Router(document.body)
router.setRoutes([
  { path: '/', component: 'palettes-list' },
  { path: '/palette/:id', component: 'palette-edit' },
  { path: '(.*)', component: 'palettes-list' },
]);