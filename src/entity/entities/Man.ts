import { Map } from '../../layout/Map'
import { Road } from './Road'
import { Texture } from 'pixi.js'
import { MovingEntity } from '../MovingEntity'
import { clamp, random } from '../../lib'

export class Man extends MovingEntity {
  private walkUpTextures: Texture[]
  private walkDownTextures: Texture[]

  constructor({
    map,
    textures
  }: {
    map: Map
    textures: Record<string, Texture>
  }) {
    let roads: Road[] = []

    for (let x = 0; x < map.dimensions.mapWidth; x++) {
      for (let y = 0; y < map.dimensions.mapHeight; y++) {
        const entity = map.getFromRegistry({ x, y })
        if (entity instanceof Road) {
          roads = [...roads, entity]
        }
      }
    }

    const road = roads[random(0, roads.length-1)]

    const walkTextures = Object.entries(textures)
      .filter(([key]) => {
        return key.startsWith('man2/walk')
      })
      .sort(([key1], [key2]) => {
        return (
          parseInt(key1.split('_').at(-1)!) - parseInt(key2.split('_').at(-1)!)
        )
      })

    const walkUpTextures = walkTextures
      .filter(([key]) => {
        return key.startsWith('man2/walk_up')
      })
      .map(([, value]) => value)

    const walkDownTextures = walkTextures
      .filter(([key]) => {
        return key.startsWith('man2/walk_down')
      })
      .map(([, value]) => value)

    super({
      map,
      textures: walkUpTextures,
      resizeTo: 'height',
      speed: 0.008,
      scale: { x: -1, y: 1 },
      anchor: { x: 0.5, y: 0.9 },
      velocity: { x: 0, y: 0 },
      dimensions: {
        x: road.dimensions.x,
        y: road.dimensions.y,
        width: 1,
        height: 1
      },
      animationSpeed: 0.3,
      handleMove: () => {
        if (Math.abs(this.offset.x) > 1 || Math.abs(this.offset.y) > 1) {
          this.dimensions.x += clamp(-1, Math.round(this.offset.x), 1)
          this.dimensions.y += clamp(-1, Math.round(this.offset.y), 1)
          this.offset = { x: 0, y: 0 }

          const velocity = this.getNewVelocity()

          if (
            this.velocity.x !== velocity.x ||
            this.velocity.y !== velocity.y
          ) {
            this.velocity = velocity

            const newTextures = this.getNewTextures()

            if (newTextures !== this.sprite.textures) {
              this.sprite.textures = newTextures
              this.sprite.play()
            }

            this.getNewScale()
          }
        }
      }
    })

    this.walkUpTextures = walkUpTextures
    this.walkDownTextures = walkDownTextures

    this.velocity = this.getNewVelocity()
    this.sprite.textures = this.getNewTextures()
    this.sprite.scale.x = this.getNewScale()
    this.sprite.play()
  }

  private getNewTextures() {
    if (this.velocity.x > 0 || this.velocity.y > 0) {
      return this.walkDownTextures
    } else {
      return this.walkUpTextures
    }
  }

  private getNewScale() {
    if ((this.velocity.x > 0 || this.velocity.x < 0) && this.sprite.scale.x > 0) {
      return this.sprite.scale.x *= -1
    } else if ((this.velocity.y > 0 || this.velocity.y < 0) && this.sprite.scale.x < 0) {
      return this.sprite.scale.x *= -1
    } else {
      return this.sprite.scale.x
    }
  }

  private getNewVelocity() {
    const around = this.map.getFromRegistryAround(this.dimensions)

    const filtered = Object.entries(around).filter(([, value]) => {
      if (value instanceof Road) {
        const xDiff = this.dimensions.x - value.dimensions.x
        const yDiff = this.dimensions.y - value.dimensions.y

        const movingTowardsX =
          (xDiff > 0 && this.velocity.x > 0) ||
          (xDiff < 0 && this.velocity.x < 0)
        const movingTowardsY =
          (yDiff > 0 && this.velocity.y > 0) ||
          (yDiff < 0 && this.velocity.y < 0)

        return !(movingTowardsX || movingTowardsY)
      }
    })

    let newX = this.velocity.x
    let newY = this.velocity.y

    if (filtered.length !== 0) {
      const roadToMove = filtered[random(0, filtered.length - 1)][1]!

      const xDiff = this.dimensions.x - roadToMove.dimensions.x
      const yDiff = this.dimensions.y - roadToMove.dimensions.y

      if (xDiff > 0) {
        newX = -this.speed
      } else if (xDiff < 0) {
        newX = this.speed
      } else {
        newX = 0
      }

      if (yDiff > 0) {
        newY = -this.speed
      } else if (yDiff < 0) {
        newY = this.speed
      } else {
        newY = 0
      }
    }

    return { x: newX, y: newY }
  }
}
