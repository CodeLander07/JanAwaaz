'use client';

/**
 * H3HotspotMap — Geospatial Custom Node & Hexagon Map
 *
 * Provides full backward compatibility while delegating rendering to
 * CustomNodeMap (using open-source Leaflet and CartoDB Dark Matter tiles,
 * completely free from proprietary Mapbox API and tokens).
 */

import CustomNodeMap from './CustomNodeMap';
import type { CustomNodeMapProps } from '@/types/h3';

export default function H3HotspotMap(props: CustomNodeMapProps) {
  return <CustomNodeMap {...props} />;
}

export { default as CustomNodeMap } from './CustomNodeMap';
