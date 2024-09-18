import type { Texture } from 'pixi.js'

import { Map } from '../../layout/Map'
import { StaticEntity } from '../StaticEntity'

export class Road extends StaticEntity {
  public getTexture: () => Texture

  constructor({
    map,
    textures,
    coords: { x, y }
  }: {
    map: Map
    textures: Record<string, Texture>
    coords: { x: number; y: number }
  }) {
    const dimensions = { x, y, width: 1, height: 1 }

    function getTexture() {
      let textureName = ''

      const around = map.getFromRegistryAround(dimensions)

      if (around.left instanceof Road) textureName += 'left'
      if (around.bottom instanceof Road) textureName += 'bottom'
      if (around.right instanceof Road) textureName += 'right'
      if (around.top instanceof Road) textureName += 'top'
      if (textureName === '') textureName = 'left' + 'bottom' + 'right' + 'top'

      return textures[textureName]
    }

    super({
      map,
      anchor: { x: 1, y: 0.5 },
      texture: getTexture(),
      resizeTo: 'height',
      dimensions
    })

    this.getTexture = getTexture
  }

  public connect() {
    const {
      map,
      dimensions: { x, y }
    } = this

    const around = map.getFromRegistryAround({ x, y })

    Object.entries(around).forEach(([, value]) => {
      if (value instanceof Road) value.sprite!.texture = value.getTexture()
    })
  }
}
