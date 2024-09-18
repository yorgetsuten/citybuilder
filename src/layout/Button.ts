import {
  Container,
  FederatedPointerEvent,
  Sprite,
  Text,
  Texture
} from 'pixi.js'

export interface ButtonParams {
  text: string
  normalTexture: Texture
  clickedTexture: Texture
  onClick: (event: FederatedPointerEvent) => void
  coords: { x: number; y: number }
}

export class Button {
  public container: Container
  private yTextOffset: number

  protected text: Text | null
  protected sprite: Sprite | null
  protected dimensions: { x: number; y: number; width: number; height: number }

  protected normalTexture: Texture
  protected clickedTexture: Texture

  protected setNormalTexture: () => void
  protected setClickedTexture: () => void

  constructor({
    text,
    coords,
    onClick,
    normalTexture,
    clickedTexture
  }: ButtonParams) {
    const dimensions = {
      x: coords.x,
      y: coords.y,
      width: normalTexture.orig.width,
      height: normalTexture.orig.height
    }

    this.normalTexture = normalTexture
    this.dimensions = dimensions
    this.clickedTexture = clickedTexture

    this.yTextOffset = (5 * normalTexture.orig.height) / dimensions.height
    this.text = this.setText(text)
    this.sprite = new Sprite({ texture: normalTexture })

    this.setNormalTexture = () => {
      this.sprite!.texture = this.normalTexture
    }
    this.setClickedTexture = () => {
      this.sprite!.texture = this.clickedTexture
    }

    this.container = new Container({
      ...dimensions,
      scale: 0.9,
      interactive: true,
      onpointerdown: () => {
        this.text!.y += this.yTextOffset
        this.setClickedTexture()

        const release = (event: FederatedPointerEvent) => {
          this.text!.y -= this.yTextOffset
          onClick(event)
          this.setNormalTexture()

          this.container.onpointerup = null
          this.container.onpointerleave = null
        }

        this.container.onpointerup = release
        this.container.onpointerleave = release
      }
    })

    this.container.addChild(this.sprite, this.text)
  }

  protected setText(text: string) {
    if (this.text) {
      this.text.text = text
    } else {
      this.text = new Text({ text, style: { fill: 'black' } })
    }

    const widthDiff = this.dimensions.width - this.text.width
    const heightDiff = this.dimensions.height - this.text.height

    this.text.x = widthDiff / 2
    this.text.y = heightDiff / 2 - this.yTextOffset

    return this.text
  }
}
