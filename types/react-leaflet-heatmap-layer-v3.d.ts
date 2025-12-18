// types/react-leaflet-heatmap-layer-v3.d.ts

declare module "react-leaflet-heatmap-layer-v3" {
  import type { FC } from "react"

  export interface HeatmapLayerProps {
    points: any[]
    longitudeExtractor: (p: any) => number
    latitudeExtractor: (p: any) => number
    intensityExtractor: (p: any) => number
    max?: number
    radius?: number
    blur?: number
    maxZoom?: number
  }

  export const HeatmapLayer: FC<HeatmapLayerProps>
}
