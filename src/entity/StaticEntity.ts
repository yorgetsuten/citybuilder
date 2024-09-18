import type { BaseEntityParams } from './types'

import { Entity } from './Entity'
import { Rectangle, Sprite, Texture } from 'pixi.js'

interface StaticEntityParams extends BaseEntityParams {
  texture: Texture
  onRegister?: () => void
  trim?: {
    x: number
    y: number
    width: number
    height: number
  }
}

export class StaticEntity extends Entity<Sprite> {
  private onRegister: (() => void) | undefined

  constructor({ texture, trim, onRegister, ...rest }: StaticEntityParams) {
    super({
      ...rest,
      sprite: new Sprite({
        texture: new Texture({
          source: texture.source,
          trim: trim
            ? new Rectangle(trim.x, trim.y, trim.width, trim.height)
            : texture.trim,
          frame: texture.frame,
          orig: texture.orig
        })
      })
    })

    this.onRegister = onRegister
  }

  public register() {
    this.map.register({ entity: this, ...this.dimensions })
    this.onRegister?.apply(this)
  }
}
