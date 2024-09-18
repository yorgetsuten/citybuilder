import type { Texture } from 'pixi.js'
import type { BaseEntityParams } from './types'

import { Entity } from './Entity'
import { AnimatedSprite } from 'pixi.js'

export interface AnimatedEntityParams extends BaseEntityParams {
  textures: Texture[]
  animationSpeed: number
}

export class AnimatedEntity extends Entity<AnimatedSprite> {
  protected textures: Texture[]
  protected animationSpeed: number

  constructor({ textures, animationSpeed, ...rest }: AnimatedEntityParams) {
    super({
      ...rest,
      sprite: new AnimatedSprite({ textures })
    })

    this.textures = textures
    this.animationSpeed = animationSpeed

    this.sprite.animationSpeed = this.animationSpeed
    this.sprite.play()
  }
}
