import type { Map } from '../layout/Map';

export interface BaseEntityParams {
  map: Map
  pivot?: { x: number; y: number }
  scale?: number | { x: number; y: number }
  anchor?: number | { x: number; y: number }
  resizeTo: 'width' | 'height'
  dimensions: {
    x: number
    y: number
    width: number
    height: number
  }
}
