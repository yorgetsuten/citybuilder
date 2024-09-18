import type { Map } from '../layout/Map'
import type { BaseEntityParams } from './types'

import { resize } from '../lib'
import { Graphics, Sprite } from 'pixi.js'

interface EntityParams<T extends Sprite> extends BaseEntityParams {
  sprite: T
}

export class Entity<T extends Sprite> {
  readonly sprite: T
  readonly map: Map

  readonly dimensions: {
    x: number
    y: number
    width: number
    height: number
  }

  constructor({
    map,
    pivot,
    anchor,
    scale,
    sprite,
    resizeTo,
    dimensions
  }: EntityParams<T>) {
    const { tileWidth, tileHeight } = map.isometricDimensions

    const { x, y } = map.mapToScreen(dimensions)
    const { width, height } = resize(
      resizeTo === 'width'
        ? {
            width: dimensions.width * tileWidth,
            orig: {
              width: sprite.texture.orig.width,
              height: sprite.texture.orig.height
            }
          }
        : {
            height: dimensions.height * tileHeight,
            orig: {
              width: sprite.texture.orig.width,
              height: sprite.texture.orig.height
            }
          }
    )

    this.map = map
    this.sprite = sprite
    this.dimensions = dimensions

    sprite.x = x
    sprite.y = y
    sprite.scale = scale ?? 1
    sprite.width = width
    sprite.height = height
    sprite.pivot = pivot ?? 0
    sprite.anchor = anchor ?? 0
    sprite.zIndex = y
  }

  public renderDimensions() {
    const { x, y } = this.map.mapToScreen(this.dimensions)

    this.map.groundContainer.addChild(
      new Graphics({ zIndex: 1000 })
        .rect(
          x -
            (this.dimensions.width * this.map.isometricDimensions.tileWidth) /
              2,
          y -
            (this.dimensions.height * this.map.isometricDimensions.tileHeight) /
              2,
          this.dimensions.width * this.map.isometricDimensions.tileWidth,
          this.dimensions.height * this.map.isometricDimensions.tileHeight
        )
        .stroke({ width: 1, color: 'white' })
    )
  }
}
