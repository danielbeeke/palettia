import { html, render, define } from 'uce'
import { Router } from '@vaadin/router';
import './types'

import './palettes-list'
import './palette-edit'

const router = new Router(document.body)
router.setRoutes([
  { path: '/', component: 'palettes-list' },
  { path: '/palette/:id', component: 'palette-edit' },
  { path: '(.*)', component: 'palettes-list' },
]);