import { Application, Assets, Texture, Spritesheet } from 'pixi.js'

import { Map } from './layout/Map'

import SenatAsset from './assets/senat.png'
import BarracksAsset from './assets/barracks_2.png'
import CoalmineAsset from './assets/coalmine_2.png'

import ManSheetAsset from './assets/man2.json?url'
import RoadSheetAsset from './assets/road1.json?url'

import BtnRedAsset from './assets/btn_red_small.png'
import BtnRedClickedAsset from './assets/btn_red_small_active.png'
import BtnBlueAsset from './assets/btn_blue_small.png'
import BtnBlueClickedAsset from './assets/btn_blue_small_active.png'

import './main.css'
import { Hud } from './layout/Hud'
import { Button } from './layout/Button'
import { CancellableButton } from './layout/CancellableButton'
import { Coalmine } from './entity/entities/Coalmine'
import { Barracks } from './entity/entities/Barracks'
import { Senat } from './entity/entities/Senat'
import { Road } from './entity/entities/Road'
import { Man } from './entity/entities/Man'

const app = new Application()

;(async () => {
  await app.init({
    antialias: true,
    resizeTo: window,
    background: '#59A608'
  })

  const ManSheet = await Assets.load<Spritesheet>(ManSheetAsset)
  const RoadSheet = await Assets.load<Spritesheet>(RoadSheetAsset)

  const SenatTexture = await Assets.load<Texture>(SenatAsset)
  const CoalmineTexture = await Assets.load<Texture>(CoalmineAsset)
  const BarracksTexture = await Assets.load<Texture>(BarracksAsset)

  const BtnRedTexture = await Assets.load<Texture>(BtnRedAsset)
  const BtnRedClickedTexture = await Assets.load<Texture>(BtnRedClickedAsset)
  const BtnBlueTexture = await Assets.load<Texture>(BtnBlueAsset)
  const BtnBlueClickedTexture = await Assets.load<Texture>(BtnBlueClickedAsset)

  const ManTextures = await ManSheet.parse()
  const RoadTextures = await RoadSheet.parse()

  document.body.appendChild(app.canvas)

  async function start() {
    const map = new Map({
      app,
      dimensions: {
        tileWidth: 32,
        tileHeight: 32,
        mapWidth: 16,
        mapHeight: 16
      }
    })

    map.renderIsometricGrid()

    const coalmine = new Coalmine({
      map,
      texture: CoalmineTexture,
      coords: {
        x: map.dimensions.mapWidth / 2 - 1,
        y: map.dimensions.mapHeight / 2 - 1
      }
    })

    coalmine.register()
    map.entityContainer.addChild(coalmine.sprite)

    const roadOffsets = []
    const { x: cx, y: cy, width: cw, height: ch } = coalmine.dimensions

    for (let x = cx - 1; x <= cx + cw; x++) {
      roadOffsets.push({ x: x - cx, y: -1 })
      roadOffsets.push({ x: x - cx, y: cw })
    }

    for (let y = cy; y < cy + ch; y++) {
      roadOffsets.push({ x: -1, y: y - cy })
      roadOffsets.push({ x: ch, y: y - cy })
    }

    roadOffsets.forEach(async ({ x, y }) => {
      const road = new Road({
        map: map,
        textures: RoadTextures,
        coords: { x: cx + x, y: cy + y }
      })

      road.register()
      road.connect()

      map.groundContainer.addChild(road.sprite)
    })

    const man = new Man({ map, textures: ManTextures })

    map.entityContainer.addChild(man.sprite)

    const hud = new Hud(app)

    const buildBarracksButton = new CancellableButton({
      text: 'Build Barracks',
      normalTexture: BtnBlueTexture,
      clickedTexture: BtnBlueClickedTexture,
      cancelTexture: BtnRedTexture,
      cancelClickedTexture: BtnRedClickedTexture,
      coords: { x: 12, y: 12 },
      onClick: () => {
        hud.startPlacement(
          new Barracks({
            map,
            coords: { x: 0, y: 0 },
            texture: BarracksTexture,
            manTextures: ManTextures
          })
        )
      },
      onCancel: () => {
        hud.cancelPlacement()
      }
    })

    const buildSenatButton = new CancellableButton({
      text: 'Build Senat',
      normalTexture: BtnBlueTexture,
      clickedTexture: BtnBlueClickedTexture,
      cancelTexture: BtnRedTexture,
      cancelClickedTexture: BtnRedClickedTexture,
      coords: { x: 12, y: 100 },
      onClick: () => {
        hud.startPlacement(
          new Senat({
            map,
            coords: { x: 0, y: 0 },
            texture: SenatTexture
          })
        )
      },
      onCancel: () => {
        hud.cancelPlacement()
      }
    })

    const buildRoadButton = new CancellableButton({
      text: 'Build Road',
      normalTexture: BtnBlueTexture,
      clickedTexture: BtnBlueClickedTexture,
      cancelTexture: BtnRedTexture,
      cancelClickedTexture: BtnRedClickedTexture,
      coords: { x: 12, y: 190 },
      onClick: () => {
        hud.startPlacement(
          new Road({
            map,
            textures: RoadTextures,
            coords: { x: 0, y: 0 }
          })
        )
      },
      onCancel: () => {
        hud.cancelPlacement()
      }
    })

    const resetButton = new Button({
      text: 'Reset',
      normalTexture: BtnRedTexture,
      clickedTexture: BtnRedClickedTexture,
      coords: { x: 12, y: 280 },
      onClick: () => {
        app.stage.removeChildren()
        start()
      }
    })

    hud.container.addChild(
      buildBarracksButton.container,
      buildSenatButton.container,
      buildRoadButton.container,
      resetButton.container
    )

    app.stage.addChild(hud.container)
  }

  start()
})()
