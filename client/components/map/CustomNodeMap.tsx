'use client';

/**
 * CustomNodeMap — High-Performance Geospatial Graph Visualization
 *
 * Replaces proprietary Mapbox API with an open-source, non-vulnerable
 * mapping engine powered by Leaflet and CartoDB Dark Matter tiles.
 *
 * Plots all spatial graph points (nodes), interconnecting network edges,
 * animated hotspot radar halos, and optional H3 hexagonal choropleth meshes.
 */

import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import type L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin,
  AlertTriangle,
  Shield,
  X,
  Search,
  Crosshair,
  TrendingUp,
} from 'lucide-react';
import type {
  H3HexData,
  ColorMetricKey,
  ComplaintCategory,
  GraphNode,
  CustomNodeMapProps,
} from '@/types/h3';
import {
  computeGraphNodes,
  computeGraphEdges,
  getColorStringForValue,
  getCategoryColor,
  getCategoryIcon,
  formatScore,
  formatCount,
} from '@/lib/map-utils';
import MapControls, { ViewMode } from './MapControls';
import MapTooltip from './MapTooltip';

export default function CustomNodeMap({
  data,
  initialCenter = [28.6139, 77.209],
  initialZoom = 11,
  onSelectHex,
  selectedHex: controlledSelectedHex,
  colorMetric = 'compositePriority',
}: CustomNodeMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const leafletLibRef = useRef<typeof L | null>(null);

  // Layers refs for dynamic updates without re-instantiating the map
  const edgesLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const hexagonsLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const nodesLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const highlightLayerGroupRef = useRef<L.LayerGroup | null>(null);

  // Component UI State
  const [internalSelectedHex, setInternalSelectedHex] = useState<H3HexData | null>(null);
  const selectedHex = controlledSelectedHex ?? internalSelectedHex;

  const [hoveredHex, setHoveredHex] = useState<H3HexData | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const [activeMetric, setActiveMetric] = useState<ColorMetricKey>(colorMetric);
  const [viewMode, setViewMode] = useState<ViewMode>('hybrid');
  const [showEdges, setShowEdges] = useState<boolean>(true);
  const [showPulseHalos, setShowPulseHalos] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<ComplaintCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // ─── Compute Graph Structures ──────────────────────────────────────────────

  const allNodes = useMemo(() => computeGraphNodes(data), [data]);
  const allEdges = useMemo(() => computeGraphEdges(allNodes), [allNodes]);

  // Filtered nodes based on category and search query
  const filteredNodes = useMemo(() => {
    return allNodes.filter((node) => {
      const matchCat = activeCategory === 'All' || node.topCategory === activeCategory;
      const matchSearch =
        !searchQuery.trim() ||
        node.districtName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.h3Index.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [allNodes, activeCategory, searchQuery]);

  const criticalHotspotCount = useMemo(() => {
    return allNodes.filter((n) => n.compositePriority >= 0.7).length;
  }, [allNodes]);

  // ─── Initialize Leaflet Map ───────────────────────────────────────────────

  useEffect(() => {
    let isCancelled = false;

    async function initMap() {
      if (typeof window === 'undefined' || !mapContainerRef.current || mapInstanceRef.current) {
        return;
      }

      // Dynamic import to guarantee client-side execution
      const L = (await import('leaflet')).default;
      if (isCancelled || !mapContainerRef.current) return;
      leafletLibRef.current = L;

      // Create map instance
      const map = L.map(mapContainerRef.current, {
        center: initialCenter,
        zoom: initialZoom,
        zoomControl: false,
        attributionControl: true,
        maxBoundsViscosity: 0.8,
      });

      // Add Zoom control at bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Open-source, non-vulnerable CARTO Dark Matter tiles (zero API key needed)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
        minZoom: 5,
      }).addTo(map);

      // Create separate LayerGroups for order of display
      const edgesGroup = L.layerGroup().addTo(map);
      const hexGroup = L.layerGroup().addTo(map);
      const nodesGroup = L.layerGroup().addTo(map);
      const highlightGroup = L.layerGroup().addTo(map);

      edgesLayerGroupRef.current = edgesGroup;
      hexagonsLayerGroupRef.current = hexGroup;
      nodesLayerGroupRef.current = nodesGroup;
      highlightLayerGroupRef.current = highlightGroup;

      mapInstanceRef.current = map;

      // Force container resize calculation after mount
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    }

    initMap();

    return () => {
      isCancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [initialCenter, initialZoom]);

  // ─── Render Graph Points, Hexagons, and Edges ─────────────────────────────

  useEffect(() => {
    const L = leafletLibRef.current;
    const map = mapInstanceRef.current;
    if (!L || !map) return;

    const edgesGroup = edgesLayerGroupRef.current;
    const hexGroup = hexagonsLayerGroupRef.current;
    const nodesGroup = nodesLayerGroupRef.current;
    const highlightGroup = highlightLayerGroupRef.current;

    if (!edgesGroup || !hexGroup || !nodesGroup || !highlightGroup) return;

    // Clear previous elements
    edgesGroup.clearLayers();
    hexGroup.clearLayers();
    nodesGroup.clearLayers();
    highlightGroup.clearLayers();

    const nodeLookup = new Map<string, GraphNode>(filteredNodes.map((n) => [n.id, n]));
    const isSelected = (id: string) => selectedHex?.h3Index === id;

    // 1. Render Hexagon Mesh (when mode is 'hexagons' or 'hybrid')
    if (viewMode === 'hexagons' || viewMode === 'hybrid') {
      filteredNodes.forEach((node) => {
        if (node.boundary.length === 0) return;

        const metricVal = node[activeMetric];
        const fillColor = getColorStringForValue(metricVal, node.isCoveredByDPI, 0.45);
        const strokeColor = getColorStringForValue(metricVal, node.isCoveredByDPI, 0.85);

        const polygon = L.polygon(node.boundary, {
          fillColor,
          fillOpacity: isSelected(node.id) ? 0.75 : 0.4,
          color: isSelected(node.id) ? '#38bdf8' : strokeColor,
          weight: isSelected(node.id) ? 2.5 : 1,
          dashArray: node.isCoveredByDPI ? undefined : '2, 3',
        });

        polygon.on('mouseover', (e) => {
          setHoveredHex(node);
          setMousePos({ x: e.originalEvent.clientX, y: e.originalEvent.clientY });
        });
        polygon.on('mousemove', (e) => {
          setMousePos({ x: e.originalEvent.clientX, y: e.originalEvent.clientY });
        });
        polygon.on('mouseout', () => {
          setHoveredHex(null);
        });
        polygon.on('click', () => {
          setInternalSelectedHex(node);
          onSelectHex?.(node);
        });

        polygon.addTo(hexGroup);
      });
    }

    // 2. Render Graph Network Edges (Connections)
    if (showEdges && (viewMode === 'graph' || viewMode === 'hybrid')) {
      allEdges.forEach((edge) => {
        const sourceNode = nodeLookup.get(edge.source);
        const targetNode = nodeLookup.get(edge.target);

        // Only draw if at least one endpoint is in the filtered set
        if (!sourceNode || !targetNode) return;

        const isIncidentToSelected =
          selectedHex && (selectedHex.h3Index === edge.source || selectedHex.h3Index === edge.target);

        const edgeColor = edge.isSameCategory
          ? getCategoryColor(edge.category)
          : 'rgba(148, 163, 184, 0.4)';

        const polyline = L.polyline([edge.sourceCoords, edge.targetCoords], {
          color: isIncidentToSelected ? '#38bdf8' : edgeColor,
          weight: isIncidentToSelected ? 2.8 : 1.2,
          opacity: isIncidentToSelected ? 0.95 : 0.35,
          dashArray: edge.isSameCategory ? undefined : '3, 4',
        });

        if (isIncidentToSelected) {
          polyline.addTo(highlightGroup);
        } else {
          polyline.addTo(edgesGroup);
        }
      });
    }

    // 3. Render All Graph Points (Nodes)
    if (viewMode === 'graph' || viewMode === 'hybrid') {
      filteredNodes.forEach((node) => {
        const metricVal = node[activeMetric];
        const categoryColor = getCategoryColor(node.topCategory);
        const priorityColor = getColorStringForValue(metricVal, node.isCoveredByDPI, 1);
        const isSelectedNode = isSelected(node.id);
        const isCritical = node.compositePriority >= 0.7;

        // Dynamic node radius proportional to complaint volume
        const radius = Math.min(22, Math.max(8, Math.round(node.complaintCount / 100) + 7));
        const totalSize = radius * 2 + 16;

        // Custom HTML for the node with glowing aura and optional radar ping
        const iconHtml = `
          <div class="relative flex items-center justify-center" style="width: ${totalSize}px; height: ${totalSize}px;">
            ${
              showPulseHalos && isCritical
                ? `<div class="absolute inset-0 rounded-full node-pulse-halo" style="background-color: ${priorityColor}; opacity: 0.4;"></div>`
                : ''
            }
            ${
              isSelectedNode
                ? `<div class="absolute -inset-1 rounded-full animate-ping" style="background-color: #38bdf8; opacity: 0.6;"></div>`
                : ''
            }
            <div 
              class="relative rounded-full transition-transform hover:scale-125 cursor-pointer shadow-lg flex items-center justify-center"
              style="
                width: ${radius * 2}px; 
                height: ${radius * 2}px; 
                background: radial-gradient(circle at 35% 35%, #ffffff, ${categoryColor} 45%, ${priorityColor} 100%);
                border: ${isSelectedNode ? '2.5px solid #ffffff' : '1.5px solid rgba(255,255,255,0.7)'};
                box-shadow: 0 0 ${isSelectedNode ? '16px #38bdf8' : '8px ' + categoryColor};
              "
            >
              ${
                node.isCoveredByDPI
                  ? `<div class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 border border-black rounded-full" title="DPI Active"></div>`
                  : ''
              }
            </div>
          </div>
        `;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: 'custom-graph-node-marker',
          iconSize: [totalSize, totalSize],
          iconAnchor: [totalSize / 2, totalSize / 2],
        });

        const marker = L.marker([node.lat, node.lng], {
          icon: customIcon,
          zIndexOffset: isSelectedNode ? 1000 : isCritical ? 500 : 100,
        });

        marker.on('mouseover', (e) => {
          setHoveredHex(node);
          setMousePos({ x: e.originalEvent.clientX, y: e.originalEvent.clientY });
        });
        marker.on('mousemove', (e) => {
          setMousePos({ x: e.originalEvent.clientX, y: e.originalEvent.clientY });
        });
        marker.on('mouseout', () => {
          setHoveredHex(null);
        });
        marker.on('click', () => {
          setInternalSelectedHex(node);
          onSelectHex?.(node);
        });

        marker.addTo(nodesGroup);
      });
    }
  }, [
    filteredNodes,
    allEdges,
    activeMetric,
    viewMode,
    showEdges,
    showPulseHalos,
    selectedHex,
    onSelectHex,
  ]);

  // ─── Reset Center Handler ──────────────────────────────────────────────────

  const handleResetCenter = useCallback(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(initialCenter, initialZoom, {
        duration: 1.2,
      });
    }
  }, [initialCenter, initialZoom]);

  // ─── Select and Fly to Node ────────────────────────────────────────────────

  const handleFocusNode = useCallback((node: GraphNode) => {
    setInternalSelectedHex(node);
    onSelectHex?.(node);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([node.lat, node.lng], 13.5, {
        duration: 1.0,
      });
    }
  }, [onSelectHex]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#07090e]">
      {/* Map Container */}
      <div
        id="custom-node-map-canvas"
        ref={mapContainerRef}
        className="h-full w-full select-none"
        style={{ height: '100%', width: '100%' }}
      />

      {/* Top Bar: Search & Quick Reset */}
      <div className="absolute left-20 top-4 z-40 flex items-center gap-2 max-w-md w-full px-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            id="node-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search district, sector, or H3 index…"
            className="w-full rounded-xl border border-white/15 bg-neutral-950/80 pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-neutral-500 backdrop-blur-xl focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 transition-all shadow-xl"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <button
          type="button"
          id="reset-center-btn"
          onClick={handleResetCenter}
          title="Reset Map Center"
          className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-neutral-950/80 px-3 py-2 text-xs font-mono text-neutral-300 hover:text-white hover:border-neutral-500 backdrop-blur-xl transition-all shadow-xl"
        >
          <Crosshair className="h-4 w-4 text-sky-400" />
          <span className="hidden sm:inline">Center</span>
        </button>
      </div>

      {/* Map Controls HUD */}
      <MapControls
        activeMetric={activeMetric}
        onMetricChange={setActiveMetric}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showEdges={showEdges}
        onToggleEdges={() => setShowEdges(!showEdges)}
        showPulseHalos={showPulseHalos}
        onTogglePulseHalos={() => setShowPulseHalos(!showPulseHalos)}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        nodeCount={filteredNodes.length}
        edgeCount={allEdges.length}
        criticalCount={criticalHotspotCount}
      />

      {/* Floating Hover Tooltip */}
      {hoveredHex && <MapTooltip hex={hoveredHex} x={mousePos.x} y={mousePos.y} />}

      {/* Bottom Selected Node Inspector Drawer */}
      {selectedHex && (
        <SelectedNodeInspector
          hex={selectedHex}
          onClose={() => setInternalSelectedHex(null)}
          onFocus={() => {
            const found = allNodes.find((n) => n.h3Index === selectedHex.h3Index);
            if (found) handleFocusNode(found);
          }}
        />
      )}
    </div>
  );
}

// ─── Selected Node Inspector Drawer ──────────────────────────────────────────

function SelectedNodeInspector({
  hex,
  onClose,
  onFocus,
}: {
  hex: H3HexData;
  onClose: () => void;
  onFocus: () => void;
}) {
  return (
    <section
      id="selected-node-inspector"
      aria-label="Selected Node Details"
      className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-4 pointer-events-auto"
    >
      <div className="rounded-2xl border border-white/20 bg-neutral-950/90 p-4 shadow-2xl backdrop-blur-2xl transition-all">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl text-lg font-bold shadow-inner"
              style={{
                backgroundColor: `${getCategoryColor(hex.topCategory)}20`,
                color: getCategoryColor(hex.topCategory),
                border: `1px solid ${getCategoryColor(hex.topCategory)}40`,
              }}
            >
              {getCategoryIcon(hex.topCategory)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  {hex.districtName}
                </h3>
                <span
                  className="rounded-full px-2 py-0.5 text-[11px] font-medium"
                  style={{
                    backgroundColor: `${getCategoryColor(hex.topCategory)}22`,
                    color: getCategoryColor(hex.topCategory),
                  }}
                >
                  {hex.topCategory}
                </span>
                {hex.isCoveredByDPI ? (
                  <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                    <Shield className="h-3 w-3" /> DPI Active
                  </span>
                ) : (
                  <span className="flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[10px] font-medium text-amber-300">
                    <AlertTriangle className="h-3 w-3" /> Unfunded Gap
                  </span>
                )}
              </div>
              <p className="font-mono text-xs text-neutral-400 mt-0.5">
                Node ID: <span className="text-neutral-300">{hex.h3Index}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onFocus}
              className="rounded-lg border border-neutral-800 bg-neutral-900 px-2.5 py-1.5 text-xs text-neutral-300 hover:text-white hover:border-neutral-700 transition-colors flex items-center gap-1"
              title="Focus Camera on Node"
            >
              <Crosshair className="h-3.5 w-3.5 text-sky-400" />
              <span className="hidden sm:inline">Focus</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-neutral-400 hover:bg-white/10 hover:text-white transition-colors"
              title="Close Details"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
          <MetricCard
            label="Composite Priority"
            value={hex.compositePriority}
            icon={<TrendingUp className="h-3.5 w-3.5 text-rose-400" />}
            colorClass="text-rose-400"
          />
          <MetricCard
            label="Citizen Demand"
            value={hex.demandScore}
            icon={<AlertTriangle className="h-3.5 w-3.5 text-amber-400" />}
            colorClass="text-amber-400"
          />
          <MetricCard
            label="Vulnerability"
            value={hex.vulnerabilityScore}
            icon={<MapPin className="h-3.5 w-3.5 text-purple-400" />}
            colorClass="text-purple-400"
          />
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-2.5">
            <span className="text-[11px] text-neutral-400">Complaint Count</span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-lg font-bold font-mono text-sky-400">
                {formatCount(hex.complaintCount)}
              </span>
              <span className="text-[10px] text-neutral-500">reports</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MetricCard({
  label,
  value,
  icon,
  colorClass,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  colorClass: string;
}) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-2.5">
      <div className="flex items-center justify-between text-[11px] text-neutral-400">
        <span>{label}</span>
        {icon}
      </div>
      <div className="mt-1 flex items-baseline justify-between">
        <span className={`text-lg font-bold font-mono ${colorClass}`}>
          {formatScore(value)}
        </span>
        <div className="h-1.5 w-14 rounded-full bg-neutral-800 overflow-hidden ml-2">
          <div
            className="h-full rounded-full bg-current"
            style={{ width: `${(value * 100).toFixed(0)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
