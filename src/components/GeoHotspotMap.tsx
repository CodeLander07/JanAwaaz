// Source: Google Maps Platform Code Assist
import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useMap,
} from '@vis.gl/react-google-maps';
import {
  MapPin,
  Filter,
  Layers,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  Droplets,
  Flame,
  Activity,
  Zap,
  GraduationCap,
  Waves,
  Radio,
  Search,
  CheckCircle2,
  FileSpreadsheet,
  ChevronRight,
  Info,
  Users,
  Compass,
  KeyRound,
  ExternalLink,
  Navigation,
  Crosshair,
  Maximize2,
  Map as MapIcon,
  Satellite,
} from 'lucide-react';
import { HotspotCluster, DistrictIndicator, SectorType } from '../types';

interface GeoHotspotMapProps {
  hotspots: HotspotCluster[];
  districts: DistrictIndicator[];
  selectedHotspot: HotspotCluster | null;
  onSelectHotspot: (hotspot: HotspotCluster) => void;
  onGenerateDprForHotspot: (hotspot: HotspotCluster) => void;
  selectedLanguage: string;
}

// Controller component to pan/zoom Google Map smoothly to selected hotspot
function MapCameraController({ selectedHotspot }: { selectedHotspot: HotspotCluster | null }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !selectedHotspot) return;
    map.panTo({ lat: selectedHotspot.lat, lng: selectedHotspot.lng });
    // Smooth zoom in if currently zoomed far out
    const currentZoom = map.getZoom() || 5;
    if (currentZoom < 7) {
      map.setZoom(7);
    }
  }, [map, selectedHotspot]);

  return null;
}

// Strategic Corridors (PM Gati Shakti / National Transit Grids)
const STRATEGIC_CORRIDORS = [
  {
    name: 'North-South Economic Spine (Delhi - Bundelkhand - Nagpur - Bangalore)',
    color: '#059669',
    path: [
      { lat: 28.6139, lng: 77.209 },
      { lat: 25.293, lng: 79.872 }, // Mahoba
      { lat: 21.1458, lng: 79.0882 }, // Nagpur
      { lat: 17.385, lng: 78.4867 }, // Hyderabad
      { lat: 12.9716, lng: 77.5946 }, // Bangalore
      { lat: 9.363, lng: 78.839 }, // Ramanathapuram
    ],
  },
  {
    name: 'East-West Freight Corridor (Kolkata - Purnia - Assam)',
    color: '#0284c7',
    path: [
      { lat: 22.5726, lng: 88.3639 }, // Kolkata
      { lat: 25.777, lng: 87.475 }, // Purnia
      { lat: 26.1445, lng: 91.7362 }, // Guwahati
      { lat: 27.483, lng: 94.583 }, // Dhemaji
    ],
  },
  {
    name: 'Central Tribal & Mineral Belt Corridor (Bastar - Nuapada - ASR)',
    color: '#d97706',
    path: [
      { lat: 20.184, lng: 80.003 }, // Gadchiroli
      { lat: 19.074, lng: 82.008 }, // Bastar
      { lat: 20.835, lng: 82.529 }, // Nuapada
      { lat: 18.333, lng: 82.883 }, // ASR Tribal
    ],
  },
];

// Helper to render polylines directly inside Google Maps instance
function StrategicCorridorsLayer({ visible }: { visible: boolean }) {
  const map = useMap();
  const linesRef = useRef<google.maps.Polyline[]>([]);

  useEffect(() => {
    if (!map || typeof google === 'undefined' || !google.maps) return;

    // Clear existing
    linesRef.current.forEach((l) => l.setMap(null));
    linesRef.current = [];

    if (!visible) return;

    STRATEGIC_CORRIDORS.forEach((corridor) => {
      const line = new google.maps.Polyline({
        path: corridor.path,
        geodesic: true,
        strokeColor: corridor.color,
        strokeOpacity: 0.8,
        strokeWeight: 3.5,
        map: map,
      });
      linesRef.current.push(line);
    });

    return () => {
      linesRef.current.forEach((l) => l.setMap(null));
      linesRef.current = [];
    };
  }, [map, visible]);

  return null;
}

// Helper to render district deficit heat circles
function DistrictDeficitLayer({
  districts,
  visible,
}: {
  districts: DistrictIndicator[];
  visible: boolean;
}) {
  const map = useMap();
  const circlesRef = useRef<google.maps.Circle[]>([]);

  useEffect(() => {
    if (!map || typeof google === 'undefined' || !google.maps) return;

    // Clear existing
    circlesRef.current.forEach((c) => c.setMap(null));
    circlesRef.current = [];

    if (!visible) return;

    districts.forEach((d) => {
      // Radius inversely proportional to water/road coverage (larger radius = higher deficit)
      const deficitWeight = 100 - (d.jalJeevanCoveragePercent + d.pmgsyRoadConnectivityPercent) / 2;
      const circle = new google.maps.Circle({
        strokeColor: '#ea580c',
        strokeOpacity: 0.6,
        strokeWeight: 1.5,
        fillColor: '#ea580c',
        fillOpacity: 0.15,
        map: map,
        center: { lat: d.lat, lng: d.lng },
        radius: deficitWeight * 1200, // in meters
      });
      circlesRef.current.push(circle);
    });

    return () => {
      circlesRef.current.forEach((c) => c.setMap(null));
      circlesRef.current = [];
    };
  }, [map, districts, visible]);

  return null;
}

export const GeoHotspotMap: React.FC<GeoHotspotMapProps> = ({
  hotspots,
  districts,
  selectedHotspot,
  onSelectHotspot,
  onGenerateDprForHotspot,
  selectedLanguage,
}) => {
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [aspirationalOnly, setAspirationalOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mapLayer, setMapLayer] = useState<'hotspots' | 'deficit' | 'gatishakti'>('hotspots');
  const [hoveredHotspot, setHoveredHotspot] = useState<HotspotCluster | null>(null);
  const [infoWindowHotspot, setInfoWindowHotspot] = useState<HotspotCluster | null>(null);
  const [customApiKey, setCustomApiKey] = useState<string>(() => {
    return localStorage.getItem('civicpulse_gmaps_key') || '';
  });
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);
  const [keyInput, setKeyInput] = useState<string>('');

  // Resolved API key
  const activeApiKey = useMemo(() => {
    return (
      customApiKey.trim() ||
      ((import.meta as unknown as { env?: Record<string, string> })?.env?.VITE_GOOGLE_MAPS_API_KEY as string) ||
      ''
    );
  }, [customApiKey]);

  // Sync selected hotspot to info window
  useEffect(() => {
    if (selectedHotspot) {
      setInfoWindowHotspot(selectedHotspot);
    }
  }, [selectedHotspot]);

  // Sector list with icons & colors
  const sectors: { name: string; icon: any; color: string }[] = [
    { name: 'All', icon: Layers, color: 'text-slate-400' },
    { name: 'Water & Sanitation', icon: Droplets, color: 'text-blue-500' },
    { name: 'Rural Roads & Bridges', icon: Compass, color: 'text-amber-500' },
    { name: 'Primary Healthcare', icon: Activity, color: 'text-emerald-500' },
    { name: 'Rural Electrification & Solar', icon: Zap, color: 'text-yellow-500' },
    { name: 'Education & Anganwadi', icon: GraduationCap, color: 'text-indigo-500' },
    { name: 'Irrigation & Flood Mitigation', icon: Waves, color: 'text-cyan-500' },
    { name: 'Digital & Telecom', icon: Radio, color: 'text-purple-500' },
  ];

  // Filtered hotspots
  const filteredHotspots = useMemo(() => {
    return hotspots.filter((h) => {
      const matchSector = selectedSector === 'All' || h.sector === selectedSector;
      const matchPriority =
        selectedPriority === 'All' || h.priorityRank.includes(selectedPriority);
      const matchSearch =
        searchQuery === '' ||
        h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.state.toLowerCase().includes(searchQuery.toLowerCase());

      if (aspirationalOnly) {
        const districtInfo = districts.find(
          (d) =>
            d.district.toLowerCase() === h.district.toLowerCase() ||
            d.state.toLowerCase() === h.state.toLowerCase()
        );
        if (!districtInfo?.isAspirational) return false;
      }

      return matchSector && matchPriority && matchSearch;
    });
  }, [hotspots, selectedSector, selectedPriority, searchQuery, aspirationalOnly, districts]);

  // Total affected population in filtered view
  const totalBeneficiaries = useMemo(() => {
    return filteredHotspots.reduce((acc, h) => acc + h.affectedPopulation, 0);
  }, [filteredHotspots]);

  // Color mapping per sector
  const getSectorStyle = (sector: SectorType) => {
    switch (sector) {
      case 'Water & Sanitation':
        return { bg: '#2563eb', border: '#1d4ed8', text: 'text-blue-600', badge: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'Rural Roads & Bridges':
        return { bg: '#ea580c', border: '#c2410c', text: 'text-orange-600', badge: 'bg-orange-50 text-orange-700 border-orange-200' };
      case 'Primary Healthcare':
        return { bg: '#059669', border: '#047857', text: 'text-emerald-600', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'Rural Electrification & Solar':
        return { bg: '#eab308', border: '#ca8a04', text: 'text-yellow-600', badge: 'bg-yellow-50 text-yellow-700 border-yellow-200' };
      case 'Education & Anganwadi':
        return { bg: '#4f46e5', border: '#4338ca', text: 'text-indigo-600', badge: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      case 'Irrigation & Flood Mitigation':
        return { bg: '#0284c7', border: '#0369a1', text: 'text-cyan-600', badge: 'bg-cyan-50 text-cyan-700 border-cyan-200' };
      case 'Digital & Telecom':
        return { bg: '#9333ea', border: '#7e22ce', text: 'text-purple-600', badge: 'bg-purple-50 text-purple-700 border-purple-200' };
      default:
        return { bg: '#475569', border: '#334155', text: 'text-slate-600', badge: 'bg-slate-50 text-slate-700 border-slate-200' };
    }
  };

  const handleSaveCustomKey = () => {
    if (keyInput.trim()) {
      localStorage.setItem('civicpulse_gmaps_key', keyInput.trim());
      setCustomApiKey(keyInput.trim());
      setShowKeyModal(false);
    }
  };

  return (
    <div id="spatial-hotspot-view" className="space-y-6">
      {/* Filter & Control Bar */}
      <div className="bg-white border border-slate-200 rounded-sm p-4 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search & Main Filter Controls */}
          <div className="flex flex-wrap items-center gap-2.5 flex-1">
            <div className="relative min-w-[220px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                id="search-hotspots-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search District, State, or Grievance..."
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-sm pl-9 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 font-medium"
              />
            </div>

            {/* Sector Selector */}
            <select
              id="sector-filter-dropdown"
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold rounded-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-600 cursor-pointer"
            >
              {sectors.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>

            {/* Priority Selector */}
            <select
              id="priority-filter-dropdown"
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold rounded-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-600 cursor-pointer"
            >
              <option value="All">All Priority Tiers</option>
              <option value="CRITICAL">Critical Priority (Index &gt; 85)</option>
              <option value="HIGH">High Priority (Index 75 - 85)</option>
              <option value="MEDIUM">Medium Priority (Index &lt; 75)</option>
            </select>

            {/* Aspirational Only Toggle */}
            <button
              id="toggle-aspirational-districts"
              onClick={() => setAspirationalOnly(!aspirationalOnly)}
              className={`px-3 py-2 rounded-sm text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-1.5 cursor-pointer ${
                aspirationalOnly
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Aspirational Districts Only</span>
            </button>
          </div>

          {/* Map Layer Selector & Google Maps Status */}
          <div className="flex items-center space-x-3 text-xs">
            <div className="bg-slate-100 p-1 rounded-sm flex items-center space-x-1 border border-slate-200">
              <button
                onClick={() => setMapLayer('hotspots')}
                className={`px-3 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  mapLayer === 'hotspots'
                    ? 'bg-indigo-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Hotspots
              </button>
              <button
                onClick={() => setMapLayer('deficit')}
                className={`px-3 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  mapLayer === 'deficit'
                    ? 'bg-indigo-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Deficit Circles
              </button>
              <button
                onClick={() => setMapLayer('gatishakti')}
                className={`px-3 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  mapLayer === 'gatishakti'
                    ? 'bg-indigo-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Corridors Layer
              </button>
            </div>

            <button
              onClick={() => setShowKeyModal(true)}
              className="flex items-center space-x-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2.5 py-1.5 rounded-sm text-[11px] font-semibold text-slate-700 transition-colors cursor-pointer"
              title="Configure Google Maps API Key or Demo Key"
            >
              <KeyRound className="w-3.5 h-3.5 text-indigo-600" />
              <span>Map Key</span>
            </button>

            <div className="hidden xl:flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-sm">
              <Users className="w-4 h-4 text-indigo-600" />
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                Reach:
              </span>
              <span className="font-mono font-bold text-slate-900 text-xs">
                {(totalBeneficiaries / 1000).toFixed(0)}k
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Google Map Container (Left 7 cols) + Detail Panel (Right 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Google Map Container */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-sm p-4 shadow-xs flex flex-col justify-between relative overflow-hidden min-h-[660px]">
          {/* Map Sub-Header & Controls */}
          <div className="flex items-center justify-between z-10 mb-3">
            <div>
              <h2 className="text-xs font-bold text-indigo-900 uppercase tracking-widest flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-orange-500" />
                <span>Google Maps Spatial Hotspot &amp; Deficit Intelligence</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Interactive Google Map plotting verified citizen infrastructure grievances, deficit heat halos, and national logistics corridors
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold uppercase tracking-widest bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-sm flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Google Maps API Live</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest bg-indigo-50 text-indigo-900 border border-indigo-200 px-2.5 py-1 rounded-sm">
                {filteredHotspots.length} Hotspots
              </span>
            </div>
          </div>

          {/* Interactive Google Maps Viewport */}
          <div
            id="google-maps-viewport"
            className="relative w-full flex-1 border border-slate-200 rounded-sm overflow-hidden min-h-[520px] h-[520px]"
          >
            <APIProvider apiKey={activeApiKey}>
              <Map
                mapId="DEMO_MAP_ID"
                defaultCenter={{ lat: 21.8, lng: 80.5 }}
                defaultZoom={5}
                gestureHandling="greedy"
                disableDefaultUI={false}
                zoomControl={true}
                mapTypeControl={true}
                streetViewControl={false}
                fullscreenControl={true}
                internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                className="w-full h-full"
                style={{ width: '100%', height: '100%' }}
              >
                {/* Camera Controller to pan when hotspot is picked */}
                <MapCameraController selectedHotspot={selectedHotspot} />

                {/* Gati Shakti Strategic Corridors */}
                <StrategicCorridorsLayer visible={mapLayer === 'gatishakti' || mapLayer === 'hotspots'} />

                {/* District Deficit Buffers */}
                <DistrictDeficitLayer districts={districts} visible={mapLayer === 'deficit'} />

                {/* Hotspot Advanced Markers */}
                {filteredHotspots.map((hotspot) => {
                  const isSelected = selectedHotspot?.id === hotspot.id;
                  const isCritical = hotspot.priorityRank.includes('CRITICAL');
                  const sectorStyle = getSectorStyle(hotspot.sector);

                  return (
                    <AdvancedMarker
                      key={hotspot.id}
                      position={{ lat: hotspot.lat, lng: hotspot.lng }}
                      title={`${hotspot.title} (${hotspot.district}, ${hotspot.state})`}
                      onClick={() => {
                        onSelectHotspot(hotspot);
                        setInfoWindowHotspot(hotspot);
                      }}
                    >
                      <div
                        className="relative group cursor-pointer transition-transform duration-200 hover:scale-125"
                        onMouseEnter={() => setHoveredHotspot(hotspot)}
                        onMouseLeave={() => setHoveredHotspot(null)}
                      >
                        {/* Outer Glow Halo for Critical Urgency */}
                        {isCritical && (
                          <span className="absolute -inset-2 rounded-full bg-orange-500/30 animate-ping" />
                        )}

                        {/* Custom Rich Marker Pill */}
                        <div
                          className={`flex items-center space-x-1.5 px-2 py-1 rounded-full shadow-lg border text-white transition-all ${
                            isSelected
                              ? 'ring-3 ring-orange-500 scale-110 bg-indigo-950 border-white'
                              : isCritical
                              ? 'bg-orange-600 border-orange-400'
                              : 'bg-indigo-900 border-indigo-700'
                          }`}
                        >
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: sectorStyle.bg }}
                          />
                          <span className="text-[11px] font-bold tracking-tight">
                            {hotspot.district}
                          </span>
                          <span className="text-[9px] font-mono font-bold bg-white/20 px-1 rounded">
                            {hotspot.requestCount}
                          </span>
                        </div>

                        {/* Pin Point Pointer */}
                        <div
                          className={`w-2 h-2 mx-auto rotate-45 -mt-1 ${
                            isSelected
                              ? 'bg-indigo-950'
                              : isCritical
                              ? 'bg-orange-600'
                              : 'bg-indigo-900'
                          }`}
                        />
                      </div>
                    </AdvancedMarker>
                  );
                })}

                {/* District Reference Pins */}
                {districts.map((d) => (
                  <AdvancedMarker
                    key={`dist-${d.district}`}
                    position={{ lat: d.lat, lng: d.lng }}
                    title={`${d.district}, ${d.state} (NITI Rank #${d.nitiDeltaRank})`}
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-500/80 border border-white shadow-xs pointer-events-none" />
                  </AdvancedMarker>
                ))}

                {/* InfoWindow on Selected or Clicked Hotspot */}
                {infoWindowHotspot && (
                  <InfoWindow
                    position={{ lat: infoWindowHotspot.lat, lng: infoWindowHotspot.lng }}
                    onCloseClick={() => setInfoWindowHotspot(null)}
                    maxWidth={320}
                  >
                    <div className="p-2 space-y-2 text-slate-900 text-xs">
                      <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-1.5">
                        <span
                          className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                            infoWindowHotspot.priorityRank.includes('CRITICAL')
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-indigo-100 text-indigo-800'
                          }`}
                        >
                          {infoWindowHotspot.priorityRank}
                        </span>
                        <span className="text-[10px] font-bold font-mono text-orange-600">
                          Disparity Gap: {infoWindowHotspot.disparityGapIndex.toFixed(1)}/100
                        </span>
                      </div>

                      <div>
                        <h4 className="font-bold text-xs text-indigo-950 leading-snug">
                          {infoWindowHotspot.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                          {infoWindowHotspot.district}, {infoWindowHotspot.state} ({infoWindowHotspot.blockTehsil})
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-1.5 bg-slate-50 p-1.5 rounded border border-slate-100 text-[10px]">
                        <div>
                          <span className="text-slate-500 block">Citizen Claims:</span>
                          <span className="font-bold text-slate-900 font-mono">
                            {infoWindowHotspot.requestCount} verified
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Affected Pop:</span>
                          <span className="font-bold text-slate-900 font-mono">
                            {(infoWindowHotspot.affectedPopulation / 1000).toFixed(0)}k persons
                          </span>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-700 line-clamp-2 italic">
                        "{infoWindowHotspot.primaryDeficit}"
                      </p>

                      <div className="pt-1 flex items-center space-x-2">
                        <button
                          onClick={() => onGenerateDprForHotspot(infoWindowHotspot)}
                          className="flex-1 bg-indigo-900 hover:bg-indigo-800 text-white font-bold text-[10px] uppercase tracking-wider py-1.5 px-2 rounded transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3 text-orange-300" />
                          <span>Generate DPR</span>
                        </button>
                        <button
                          onClick={() => onSelectHotspot(infoWindowHotspot)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-[10px] py-1.5 px-2 rounded transition-colors cursor-pointer"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  </InfoWindow>
                )}
              </Map>
            </APIProvider>
          </div>

          {/* Map Footer & Legends */}
          <div className="bg-slate-50 border border-slate-200 rounded-sm p-3 z-10 flex flex-wrap items-center justify-between text-[11px] gap-2 mt-3">
            <div className="flex items-center space-x-4">
              <span className="flex items-center text-slate-700 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-600 mr-1.5 animate-pulse" />
                Critical Hotspot (&gt; 85 Disparity)
              </span>
              <span className="flex items-center text-slate-700 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-900 mr-1.5" />
                High Priority Hotspot (75-85)
              </span>
            </div>
            <div className="flex items-center space-x-4 text-slate-500 font-medium">
              <span className="flex items-center">
                <span className="w-4 h-0.5 bg-emerald-600 mr-1" />
                PM Gati Shakti Corridors
              </span>
              <span className="flex items-center">
                <span className="w-2.5 h-2.5 rounded-full border border-orange-500 bg-orange-500/20 mr-1" />
                Deficit Buffer Zone
              </span>
            </div>
          </div>
        </div>

        {/* Deep Dive Hotspot Detail & Action Panel (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-4">
          {selectedHotspot ? (
            <div
              id="hotspot-detail-card"
              className="bg-white border border-slate-200 border-l-4 border-l-orange-500 rounded-sm p-6 shadow-xs space-y-5"
            >
              {/* Title & Priority Badge */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-0.5 rounded-sm text-[10px] font-bold tracking-wider uppercase ${
                        selectedHotspot.priorityRank.includes('CRITICAL')
                          ? 'bg-orange-100 text-orange-700 border border-orange-200'
                          : 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                      }`}
                    >
                      {selectedHotspot.priorityRank}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                      {selectedHotspot.state}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1.5 leading-snug">
                    {selectedHotspot.title}
                  </h3>
                  <p className="text-xs text-indigo-900 font-semibold flex items-center mt-1">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-orange-500" />
                    {selectedHotspot.district}, {selectedHotspot.blockTehsil}
                    <span className="ml-2 font-mono text-[10px] text-slate-400">
                      ({selectedHotspot.lat.toFixed(3)}°N, {selectedHotspot.lng.toFixed(3)}°E)
                    </span>
                  </p>
                </div>

                {/* Disparity Score Dial */}
                <div className="bg-slate-50 border border-slate-200 rounded-sm p-3 text-center min-w-[80px]">
                  <span className="text-[10px] text-slate-500 block font-bold uppercase tracking-widest">
                    Disparity
                  </span>
                  <span className="text-2xl font-mono font-bold text-orange-600">
                    {selectedHotspot.disparityGapIndex.toFixed(1)}
                  </span>
                  <span className="text-[9px] text-slate-400 block font-mono">/ 100</span>
                </div>
              </div>

              {/* Key Indicators Grid */}
              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-sm">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block">
                    Citizen Voice
                  </span>
                  <span className="text-base font-mono font-bold text-slate-900">
                    {selectedHotspot.requestCount}
                  </span>
                  <span className="text-[9px] text-emerald-600 font-semibold block uppercase">
                    Claims
                  </span>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-sm">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block">
                    Infra Deficit
                  </span>
                  <span className="text-base font-mono font-bold text-orange-600">
                    {selectedHotspot.infrastructureDeficitScore}%
                  </span>
                  <span className="text-[9px] text-slate-500 font-semibold block uppercase">
                    NITI Index
                  </span>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-sm">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block">
                    Impact
                  </span>
                  <span className="text-base font-mono font-bold text-indigo-900">
                    {(selectedHotspot.affectedPopulation / 1000).toFixed(0)}k
                  </span>
                  <span className="text-[9px] text-slate-500 font-semibold block uppercase">
                    Persons
                  </span>
                </div>
              </div>

              {/* Primary Infrastructure Deficit Ground Truth */}
              <div className="bg-slate-50 border border-slate-200 border-l-4 border-l-indigo-600 rounded-sm p-3.5 space-y-1">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-indigo-900 uppercase tracking-wider">
                  <AlertTriangle className="w-3.5 h-3.5 text-orange-500" />
                  <span>Ground Reality &amp; Infrastructure Deficit</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed pt-1">
                  {selectedHotspot.primaryDeficit}
                </p>
              </div>

              {/* Citizen Voice Quotes (Vernacular + English Translation) */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold text-indigo-900 uppercase tracking-widest flex items-center space-x-1.5">
                  <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                  <span>Sample Ground Citizen Transcripts</span>
                </span>
                {selectedHotspot.topCitizenQuotes.map((q, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-50 border border-slate-200 rounded-sm p-3 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      <span className="text-indigo-900">{q.lang} Voice Ingestion</span>
                      <span>Verified Audio</span>
                    </div>
                    <p className="text-slate-800 font-medium italic text-xs leading-relaxed">
                      "{q.vernacular}"
                    </p>
                    <p className="text-slate-600 text-[11px] border-t border-slate-200 pt-1">
                      <strong className="text-slate-800">English Translation:</strong> "{q.english}"
                    </p>
                  </div>
                ))}
              </div>

              {/* Recommended National Mission Linkage */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-sm p-3.5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-widest block">
                    Recommended Policy Linkage
                  </span>
                  <span className="text-xs font-bold text-emerald-950">
                    {selectedHotspot.recommendedMission}
                  </span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              </div>

              {/* Action Button: Synthesize DPR */}
              <button
                id="generate-dpr-for-hotspot-btn"
                onClick={() => onGenerateDprForHotspot(selectedHotspot)}
                className="w-full py-3.5 bg-indigo-900 hover:bg-indigo-800 text-white font-bold uppercase tracking-widest text-xs transition-colors rounded-sm shadow-xs flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-orange-300" />
                <span>Synthesize National DPR with AI</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-sm p-8 text-center space-y-5 shadow-xs">
              <div className="w-12 h-12 rounded bg-indigo-50 border border-indigo-200 flex items-center justify-center mx-auto text-indigo-900">
                <Compass className="w-6 h-6 animate-spin-slow" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-widest">
                  Select Any Spatial Hotspot on Google Maps
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
                  Click on any interactive marker or corridor on the Google Map to inspect verified vernacular voice transcripts, NITI disparity indices, and formulate bankable infrastructure projects.
                </p>
              </div>
              <div className="border-t border-slate-200 pt-4 text-left space-y-2">
                <span className="text-xs font-bold text-indigo-900 uppercase tracking-widest block">
                  Priority Demand Nodes:
                </span>
                {hotspots.slice(0, 4).map((h) => (
                  <button
                    key={h.id}
                    onClick={() => {
                      onSelectHotspot(h);
                      setInfoWindowHotspot(h);
                    }}
                    className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-sm p-3 text-left flex items-center justify-between text-xs transition-colors cursor-pointer"
                  >
                    <div>
                      <span className="font-bold text-slate-900 block">{h.title}</span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {h.district}, {h.state} • {h.sector}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Stats: National Demand Breakdown */}
          <div className="bg-white border border-slate-200 rounded-sm p-5 space-y-4 shadow-xs">
            <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-widest flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              <span>National Demand Aggregation by Sector</span>
            </h4>
            <div className="space-y-3 text-xs">
              {[
                { sector: 'Water & Sanitation (JJM)', percent: 34, color: 'bg-blue-600' },
                { sector: 'Rural Roads & Bridges (PMGSY)', percent: 28, color: 'bg-orange-500' },
                { sector: 'Primary Healthcare (PM-ABHIM)', percent: 18, color: 'bg-emerald-600' },
                { sector: 'Irrigation & Flood Mitigation', percent: 12, color: 'bg-cyan-600' },
                { sector: 'Rural Power & Solar Feeder', percent: 8, color: 'bg-amber-500' },
              ].map((item) => (
                <div key={item.sector} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-700 font-medium">{item.sector}</span>
                    <span className="font-mono font-bold text-slate-900">{item.percent}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full`}
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Google Maps API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-sm max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-900">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Google Maps Platform Key</h3>
                  <p className="text-xs text-slate-500">Configure or test with a Google Maps API Key</p>
                </div>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <p>
                CivicPulse AI uses the <strong>Google Maps JavaScript API</strong> and <strong>Advanced Markers</strong> to plot high-resolution geospatial citizen demand hotspots.
              </p>

              <div className="bg-amber-50 border border-amber-200 rounded p-3 text-amber-900 space-y-2">
                <div className="font-bold flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Free Prototyping: Google Maps Demo Key</span>
                </div>
                <p className="text-[11px]">
                  For zero-cost prototyping without setting up Cloud billing, you can generate a free Maps Demo Key:
                </p>
                <a
                  href="https://mapsplatform.google.com/maps-demo-key?utm_campaign=gmp_mcp_codeassist_v1_aistudio"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1.5 text-indigo-700 hover:text-indigo-900 font-bold underline text-[11px]"
                >
                  <span>Open Maps Demo Key Generator</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="space-y-1.5 pt-1">
                <label className="font-bold text-slate-800 block text-xs">
                  Enter Google Maps API Key or Demo Key:
                </label>
                <input
                  type="text"
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs font-mono focus:ring-1 focus:ring-indigo-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowKeyModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCustomKey}
                className="px-4 py-2 text-xs font-bold text-white bg-indigo-900 hover:bg-indigo-800 rounded shadow-xs cursor-pointer"
              >
                Save &amp; Reload Map
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
