import { Application, Container, Renderer, Graphics, Sprite } from 'pixi.js'

import { Entity } from '../entity/Entity'

export class Map {
  readonly app: Application<Renderer>
  readonly registry: (Entity<Sprite> | null)[][] = [[]]

  readonly groundContainer
  readonly entityContainer

  readonly isometricDimensions: {
    startPoint: number
    tileWidth: number
    tileHeight: number
  }

  readonly dimensions: {
    tileWidth: number
    tileHeight: number
    mapWidth: number
    mapHeight: number
  }

  constructor({
    app,
    dimensions: { tileWidth, tileHeight, mapWidth, mapHeight }
  }: {
    app: Application<Renderer>
    dimensions: {
      tileWidth: number
      tileHeight: number
      mapWidth: number
      mapHeight: number
    }
  }) {
    this.app = app

    const containerDimensions = {
      x: app.screen.width / 2 - (tileWidth * mapWidth) / 2,
      y: app.screen.height / 2 - (tileHeight * mapHeight) / 2,
      width: tileWidth * mapWidth,
      height: tileHeight * mapHeight
    }

    this.entityContainer = new Container({
      ...containerDimensions,
      interactiveChildren: false
    })
    this.groundContainer = new Container({
      ...containerDimensions,
      isRenderGroup: true,
      interactiveChildren: false
    })

    app.stage.addChild(this.groundContainer, this.entityContainer)

    for (let x = 0; x < mapWidth; x++) {
      this.registry[x] = []
      for (let y = 0; y < mapHeight; y++) {
        this.registry[x][y] = null
      }
    }

    this.isometricDimensions = {
      startPoint: (mapWidth * tileWidth) / 2,
      tileWidth: tileWidth * 2,
      tileHeight: tileHeight
    }

    this.dimensions = {
      tileWidth,
      tileHeight,
      mapWidth,
      mapHeight
    }
  }

  public getFromRegistry({ x, y }: { x: number; y: number }) {
    if (
      x > 0 &&
      x < this.dimensions.mapWidth &&
      y > 0 &&
      y < this.dimensions.mapHeight
    ) {
      return this.registry[x][y]
    } else {
      return null
    }
  }

  public getFromRegistryAround({ x, y }: { x: number; y: number }) {
    return {
      top: y - 1 > 0 ? this.registry[x][y - 1] : null,
      left: x - 1 > 0 ? this.registry[x - 1][y] : null,
      right: x + 1 < this.dimensions.mapWidth ? this.registry[x + 1][y] : null,
      bottom: y + 1 < this.dimensions.mapHeight ? this.registry[x][y + 1] : null
    }
  }

  public mapToScreen({
    x,
    y,
    height
  }: {
    x: number
    y: number
    height: number
  }) {
    const { startPoint, tileWidth, tileHeight } = this.isometricDimensions

    const offsetx = ((x - y) * tileWidth) / 2
    const offsety = ((x + y) * tileHeight) / 2 + (height * tileHeight) / 2

    return {
      x: startPoint + offsetx,
      y: 0 + offsety
    }
  }

  public register({
    entity,
    x,
    y,
    width,
    height
  }: {
    entity: Entity<Sprite>
    x: number
    y: number
    width: number
    height: number
  }) {
    if (
      x + width > this.dimensions.mapWidth ||
      y + height > this.dimensions.mapHeight
    ) {
      throw new Error(entity.constructor.name + ' is out of bounds')
    }

    for (let xx = x; xx < x + width; xx++) {
      for (let yy = y; yy < y + height; yy++) {
        this.registry[xx][yy] = entity
      }
    }
  }

  public renderGrid() {
    const { tileWidth, tileHeight, mapWidth, mapHeight } = this.dimensions

    for (let x = 0; x < mapWidth; x++) {
      for (let y = 0; y < mapHeight; y++) {
        this.groundContainer.addChild(
          new Graphics()
            .rect(x * tileWidth, y * tileHeight, tileWidth, tileHeight)
            .stroke({ width: 1, color: 'white' })
        )
      }
    }
  }

  public renderIsometricGrid() {
    const { tileWidth, tileHeight, mapWidth, mapHeight } = this.dimensions
    for (let x = 0; x < mapWidth; x++) {
      for (let y = 0; y < mapHeight; y++) {
        const start = (mapWidth * tileWidth) / 2

        const offset = {
          x: (x - y) * 32,
          y: (x + y) * (32 / 2)
        }

        this.groundContainer.addChild(
          new Graphics()
            .moveTo(start + offset.x, offset.y + 0)
            .lineTo(start + offset.x + tileWidth, offset.y + tileHeight / 2)
            .lineTo(start + offset.x + 0, offset.y + tileHeight)
            .lineTo(start + offset.x + -tileWidth, offset.y + tileHeight / 2)
            .lineTo(start + offset.x + 0, offset.y + 0)
            .stroke({ width: 1, color: 'white' })
        )
      }
    }
  }
}
