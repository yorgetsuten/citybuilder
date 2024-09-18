import type { FederatedPointerEvent, Texture } from 'pixi.js'

import { Button, ButtonParams } from './Button'

interface CancellableButtonParams extends ButtonParams {
  cancelTexture: Texture
  cancelClickedTexture: Texture
  onCancel: (event: FederatedPointerEvent) => void
}

export class CancellableButton extends Button {
  private cancelTexture: Texture
  private cancelClickedTexture: Texture

  constructor({
    text,
    coords,
    onClick,
    onCancel,
    normalTexture,
    cancelTexture,
    clickedTexture,
    cancelClickedTexture
  }: CancellableButtonParams) {
    super({
      text,
      coords,
      normalTexture,
      clickedTexture,
      onClick: (event) => {
        if (this.sprite!.texture === this.clickedTexture) {
          onClick(event)
          this.setText('Cancel')
          this.setNormalTexture = () => {
            this.sprite!.texture = this.cancelTexture
            console.log('normal')
          }
          this.setClickedTexture = () => {
            this.sprite!.texture = this.cancelClickedTexture
          }
        } else {
          onCancel(event)
          this.setText(text)
          this.setNormalTexture = () => {
            this.sprite!.texture = this.normalTexture
          }
          this.setClickedTexture = () => {
            this.sprite!.texture = this.clickedTexture
          }
        }
      }
    })

    this.cancelTexture = cancelTexture
    this.cancelClickedTexture = cancelClickedTexture
  }
}
