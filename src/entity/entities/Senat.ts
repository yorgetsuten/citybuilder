import type { Map } from '../../layout/Map'
import type { Texture } from 'pixi.js'

import { StaticEntity } from '../StaticEntity'

export class Senat extends StaticEntity {
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
      dimensions: { x, y, width: 6, height: 6 },
      pivot: { x: 538, y: 456 }
    })
  }
}
