import type { AnimatedEntityParams } from './AnimatedEntity'

import { AnimatedEntity } from './AnimatedEntity'

export interface MovingEntityParams extends AnimatedEntityParams {
  speed: number
  velocity: { x: number; y: number }
  handleMove?: () => void
}

export class MovingEntity extends AnimatedEntity {
  protected speed: number
  protected offset: { x: number; y: number }
  protected velocity: { x: number; y: number }
  protected handleMove: (() => void) | undefined

  constructor({ speed, velocity, handleMove, ...rest }: MovingEntityParams) {
    super(rest)

    this.speed = speed
    this.offset = { x: 0, y: 0 }
    this.velocity = velocity
    this.handleMove = handleMove

    this.map.app.ticker.add(() => {
      this.move()
    })
  }

  protected move() {
    this.offset.x += this.velocity.x
    this.offset.y += this.velocity.y

    this.handleMove?.apply(this)

    const { x, y } = this.map.mapToScreen({
      x: this.dimensions.x + this.offset.x,
      y: this.dimensions.y + this.offset.y,
      height: this.dimensions.height
    })

    this.sprite.x = x
    this.sprite.y = y
    this.sprite.zIndex = y
  }
}
