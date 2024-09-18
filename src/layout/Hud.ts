import type { Application, Renderer } from 'pixi.js'

import { clamp, throttle } from '../lib'
import { Container, Graphics, Rectangle } from 'pixi.js'
import { StaticEntity } from '../entity/StaticEntity'
import { Map } from './Map'

export class Hud {
  public entity: StaticEntity | null = null
  public graphics: Graphics | null = null
  public container: Container

  constructor(app: Application<Renderer>) {
    this.container = new Container({
      zIndex: 1000,
      x: 0,
      y: 0,
      interactive: true,
      hitArea: new Rectangle(0, 0, app.screen.width, app.screen.height)
    })
  }

  public cancelPlacement() {
    if (this.entity) {
      this.graphics!.destroy()
      this.entity.sprite.destroy()
      this.entity.sprite.onpointerup = null
      this.entity.sprite.onpointermove = null
      this.container.onmousemove = null
    }
  }

  public startPlacement(entity: StaticEntity) {
    const { map, sprite, dimensions } = entity

    const { x, y } = map.mapToScreen(dimensions)

    this.entity = entity

    sprite.x = map.entityContainer.x + x
    sprite.y = map.entityContainer.y + y

    this.graphics = this.drawPlacementBox(map, entity)

    sprite.interactive = true
    sprite.hitArea = this.container.hitArea
    sprite.onpointerdown = (downEvent) => {
      const offset = { x: 0, y: 0 }
      const startPoint = { x: downEvent.clientX, y: downEvent.clientY }

      sprite.onpointermove = throttle((moveEvent) => {
        offset.x = startPoint.x - moveEvent.clientX
        offset.y = startPoint.y - moveEvent.clientY

        if (Math.abs(offset.x) > map.isometricDimensions.tileWidth) {
          offset.x = clamp(
            -map.isometricDimensions.tileWidth,
            offset.x,
            map.isometricDimensions.tileWidth
          )

          const newX = offset.x / map.isometricDimensions.tileWidth
          const newY = offset.x / map.isometricDimensions.tileWidth

          entity.dimensions.x += newX
          entity.dimensions.y -= newY
          sprite.x -= offset.x

          startPoint.x = moveEvent.clientX
          startPoint.y = moveEvent.clientY

          this.graphics!.destroy()
          this.graphics = this.drawPlacementBox(map, entity)
          this.container.addChild(this.graphics)
        }

        if (Math.abs(offset.y) > map.isometricDimensions.tileHeight) {
          offset.y = clamp(
            -map.isometricDimensions.tileHeight,
            offset.y,
            map.isometricDimensions.tileHeight
          )

          entity.dimensions.x -= offset.y / map.dimensions.tileHeight
          entity.dimensions.y -= offset.y / map.dimensions.tileHeight
          sprite.y -= offset.y

          startPoint.x = moveEvent.clientX
          startPoint.y = moveEvent.clientY

          this.graphics!.destroy()
          this.graphics = this.drawPlacementBox(map, entity)
          this.container.addChild(this.graphics)
        }
      }, 30)

      onpointerup = () => {
        entity.register()

        this.graphics!.destroy()
        entity.sprite.onpointerup = null
        entity.sprite.onpointermove = null
        this.container.onmousemove = null
      }
    }

    this.container.addChild(sprite, this.graphics)
  }

  private checkPlacement(entity: StaticEntity) {
    const { map, dimensions } = entity

    for (let x = dimensions.x; x < dimensions.x + dimensions.width; x++) {
      for (let y = dimensions.y; y < dimensions.y + dimensions.height; y++) {
        if (map.getFromRegistry({ x, y })) {
          return false
        }
      }
    }

    return true
  }

  private drawPlacementBox(map: Map, entity: StaticEntity) {
    const { sprite, dimensions } = entity

    let currentX = sprite.x
    let currentY = sprite.y

    const graphics = new Graphics({ zIndex: 1000 })

    currentY += (map.isometricDimensions.tileHeight * dimensions.height) / 2
    graphics.moveTo(currentX, currentY)
    currentX += (map.isometricDimensions.tileWidth * dimensions.width) / 2
    currentY -= (map.isometricDimensions.tileHeight * dimensions.height) / 2
    graphics.lineTo(currentX, currentY)
    currentX -= (map.isometricDimensions.tileWidth * dimensions.width) / 2
    currentY -= (map.isometricDimensions.tileHeight * dimensions.height) / 2
    graphics.lineTo(currentX, currentY)
    currentX -= (map.isometricDimensions.tileWidth * dimensions.width) / 2
    currentY += (map.isometricDimensions.tileHeight * dimensions.height) / 2
    graphics.lineTo(currentX, currentY)
    currentX += (map.isometricDimensions.tileWidth * dimensions.width) / 2
    currentY += (map.isometricDimensions.tileHeight * dimensions.height) / 2
    graphics.lineTo(currentX, currentY)

    let color = this.checkPlacement(entity) ? '0x00FF00' : '0xFF0000'

    return graphics.stroke({ width: 1, color: color })
  }
}
