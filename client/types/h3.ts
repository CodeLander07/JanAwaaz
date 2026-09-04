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

/** Color metric options for the choropleth/node encoding */
export type ColorMetricKey = 'compositePriority' | 'demandScore' | 'deficitScore';

/**
 * Represents a spatial graph node derived from an H3 cell.
 */
export interface GraphNode extends H3HexData {
  id: string;
  lat: number;
  lng: number;
  boundary: [number, number][];
  neighborIds: string[];
}

/**
 * Represents a network edge connecting two adjacent or functionally correlated nodes.
 */
export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  sourceCoords: [number, number];
  targetCoords: [number, number];
  weight: number;
  category: ComplaintCategory;
  isSameCategory: boolean;
}

/**
 * Props for the CustomNodeMap component.
 */
export interface CustomNodeMapProps {
  /** Array of H3 hex cell data to render */
  data: H3HexData[];
  /** Initial center coordinates [lat, lng] */
  initialCenter?: [number, number];
  /** Initial zoom level */
  initialZoom?: number;
  /** Callback fired when a node or hex cell is clicked */
  onSelectHex?: (hex: H3HexData) => void;
  /** Currently selected hex cell */
  selectedHex?: H3HexData | null;
  /** Which score metric drives the color encoding */
  colorMetric?: ColorMetricKey;
}

/** Legacy alias for backward compatibility */
export type H3HotspotMapProps = CustomNodeMapProps;
