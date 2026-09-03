/**
 * H3 Hexagonal Data Contracts
 * 
 * These interfaces define the data shape for the H3HotspotMap component.
 * They map directly to the backend's H3-aggregated complaint/priority data.
 */

/** Categories of citizen infrastructure complaints */
export type ComplaintCategory = 'Water' | 'Transport' | 'Healthcare' | 'Energy' | 'Sanitation';

/**
 * Represents a single H3 hexagonal cell with aggregated metrics.
 * Each cell corresponds to a resolution-8 H3 index (~0.74 km² area).
 */
export interface H3HexData {
  /** H3 resolution-8 index string, e.g., "8828308281fffff" */
  h3Index: string;
  /** Citizen report volume/urgency score (0.0 – 1.0) */
  demandScore: number;
  /** Socio-economic deficit indicator (0.0 – 1.0) */
  vulnerabilityScore: number;
  /** Infrastructure gap metric (0.0 – 1.0) */
  deficitScore: number;
  /** Final weighted priority score (0.0 – 1.0) */
  compositePriority: number;
  /** Total raw citizen reports aggregated in this cell */
  complaintCount: number;
  /** Dominant complaint category in this cell */
  topCategory: ComplaintCategory;
  /** Whether an active government capex project covers this cell */
  isCoveredByDPI: boolean;
  /** Administrative district name */
  districtName: string;
}

/** Color metric options for the choropleth encoding */
export type ColorMetricKey = 'compositePriority' | 'demandScore' | 'deficitScore';

/**
 * Props for the H3HotspotMap component.
 */
export interface H3HotspotMapProps {
  /** Array of H3 hex cell data to render */
  data: H3HexData[];
  /** Initial map camera position */
  initialViewState?: {
    longitude: number;
    latitude: number;
    zoom: number;
    pitch: number;
    bearing: number;
  };
  /** Callback fired when a hex cell is clicked */
  onSelectHex?: (hex: H3HexData) => void;
  /** Which score metric drives the color encoding */
  colorMetric?: ColorMetricKey;
  /** Multiplier for complaint-count elevation. Default: 50 */
  elevationScale?: number;
  /** Mapbox access token. Falls back to NEXT_PUBLIC_MAPBOX_TOKEN */
  mapboxToken?: string;
}
