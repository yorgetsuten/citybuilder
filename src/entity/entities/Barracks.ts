import type { Map } from '../../layout/Map'
import type { Texture } from 'pixi.js'

import { StaticEntity } from '../StaticEntity'
import { Man } from './Man'

export class Barracks extends StaticEntity {
  constructor({
    map,
    coords,
    texture,
    manTextures
  }: {
    map: Map
    coords: { x: number; y: number }
    texture: Texture
    manTextures: Record<string, Texture>
  }) {
    super({
      map,
      texture,
      resizeTo: 'width',
      pivot: { x: 427, y: 442 },
      dimensions: { ...coords, width: 3, height: 3 },
      onRegister: () => new Man({ map, textures: manTextures })
    })
  }
}
