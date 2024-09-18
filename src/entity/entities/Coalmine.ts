import type { Map } from '../../layout/Map'
import type { Texture } from 'pixi.js'

import { StaticEntity } from '../StaticEntity'

export class Coalmine extends StaticEntity {
  constructor({
    map,
    texture,
    coords: { x, y }
  }: {
    map: Map
    texture: Texture
    coords: { x: number; y: number }
  }) {
    super({
      map,
      texture,
      resizeTo: 'width',
      dimensions: { x, y, width: 2, height: 2 },
      pivot: { x: 188, y: 176 }
    })
  }
}
