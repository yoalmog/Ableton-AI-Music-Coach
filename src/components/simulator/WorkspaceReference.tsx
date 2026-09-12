import React, { useState, useRef, useEffect } from 'react';
import {
  ReferenceImageItem,
  ReferenceHotspot,
  WorkspaceType,
} from '../../types/workspaceReference';
import { NormalizedRect } from '../../types/abletonSimulator';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  RotateCcw,
  ExternalLink,
  Info,
  Layers,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  HelpCircle,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface WorkspaceReferenceProps {
  reference: ReferenceImageItem;
  activeHotspotId?: string;
  highlightedRect?: NormalizedRect;
  onSelectHotspot?: (hotspot: ReferenceHotspot) => void;
  onNavigatePrev?: () => void;
  onNavigateNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
  lang?: string;
  isRTL?: boolean;
  onSwitchToSimulator?: () => void;
}

export const WorkspaceReference: React.FC<WorkspaceReferenceProps> = ({
  reference,
  activeHotspotId,
  highlightedRect,
  onSelectHotspot,
  onNavigatePrev,
  onNavigateNext,
  hasPrev = false,
  hasNext = false,
  lang = 'he',
  isRTL = false,
  onSwitchToSimulator,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [selectedHotspot, setSelectedHotspot] = useState<ReferenceHotspot | null>(null);
  const [showAllHotspots, setShowAllHotspots] = useState<boolean>(true);

  const containerRef = useRef<HTMLDivElement>(null);

  // Sync active hotspot when changed from parent lesson step
  useEffect(() => {
    if (activeHotspotId) {
      const found = reference.hotspots.find((h) => h.id === activeHotspotId);
      if (found) {
        setSelectedHotspot(found);
      }
    }
  }, [activeHotspotId, reference]);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(3.5, prev + 0.3));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(0.8, prev - 0.3));
  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    }
  };

  const handleMouseUp = () => setIsPanning(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const isHe = lang === 'he';

  return (
    <div
      ref={containerRef}
      dir={isRTL ? 'rtl' : 'ltr'}
      className="relative w-full h-full flex flex-col bg-[#141414] border border-[#2B2B2B] rounded-lg overflow-hidden select-none font-sans text-gray-200 shadow-xl"
    >
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & OFFICIAL ABLETON ATTRIBUTION BAR                          */}
      {/* ========================================================================= */}
      <div className="h-10 px-3 bg-[#1C1C1C] border-b border-[#282828] flex items-center justify-between gap-2 shrink-0 z-20">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-2 h-2 rounded-full bg-[#00E5FF] shrink-0 animate-pulse" />
          <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-wider shrink-0">
            {isHe ? 'תמונת ייחוס רשמית' : 'WORKSPACE REFERENCE'}
          </span>
          <span className="text-gray-500 font-mono text-xs">|</span>
          <h3 className="text-xs font-semibold text-gray-200 truncate">
            {reference.title[lang] || reference.title.he || reference.title.en}
          </h3>
        </div>

        {/* Source attribution link */}
        <div className="flex items-center gap-1.5 shrink-0">
          <a
            href={reference.source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[10px] font-mono text-gray-400 hover:text-cyan-300 bg-[#252525] hover:bg-[#303030] px-2 py-1 rounded transition-colors"
            title="Open official Ableton documentation in new tab"
          >
            <span>Reference: Ableton</span>
            <ExternalLink className="w-3 h-3 text-cyan-400" />
          </a>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. IMAGE CANVAS WITH ZOOM, PAN, & HOTSPOT OVERLAYS                       */}
      {/* ========================================================================= */}
      <div
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`relative flex-1 w-full min-h-0 bg-[#0C0C0C] overflow-hidden flex items-center justify-center ${
          zoomLevel > 1 ? (isPanning ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'
        }`}
      >
        <div
          style={{
            transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${
              panOffset.y / zoomLevel
            }px)`,
            transformOrigin: 'center center',
            transition: isPanning ? 'none' : 'transform 0.15s ease-out',
          }}
          className="relative w-full h-full max-w-full max-h-full flex items-center justify-center p-2"
        >
            {/* Real Ableton Vector Blueprint or Graphic Render */}
            <div className="relative w-full h-full max-h-[560px] aspect-[16/10] bg-[#1E1E1E] rounded border border-[#333] shadow-2xl overflow-hidden flex flex-col">
              {(reference.imageSource || reference.imageUrl) ? (
                <div className="relative w-full h-full">
                  <img
                    src={reference.imageSource || reference.imageUrl}
                    alt={reference.title[lang] || reference.title.en}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover select-none pointer-events-none"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 pointer-events-none">
                    {renderWorkspaceVector(reference.workspace)}
                  </div>
                </div>
              ) : (
                renderWorkspaceVector(reference.workspace)
              )}

            {/* Hotspot bounding overlays */}
            {showAllHotspots &&
              reference.hotspots.map((hotspot, idx) => {
                const isSelected =
                  selectedHotspot?.id === hotspot.id || activeHotspotId === hotspot.id;
                const rect = hotspot.rect;

                return (
                  <div
                    key={hotspot.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedHotspot(hotspot);
                      onSelectHotspot?.(hotspot);
                    }}
                    style={{
                      left: `${rect.x * 100}%`,
                      top: `${rect.y * 100}%`,
                      width: `${rect.width * 100}%`,
                      height: `${rect.height * 100}%`,
                    }}
                    className={`absolute rounded transition-all cursor-pointer z-10 ${
                      isSelected
                        ? 'border-2 border-[#FFE853] bg-[#FFE853]/20 shadow-[0_0_16px_rgba(255,232,83,0.4)] animate-pulse'
                        : 'border border-cyan-400/60 bg-cyan-500/10 hover:bg-cyan-500/25 hover:border-cyan-300'
                    }`}
                  >
                    {/* Hotspot Number Badge */}
                    <div
                      className={`absolute -top-2.5 -left-2.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold shadow-md ${
                        isSelected
                          ? 'bg-[#FFE853] text-black ring-2 ring-yellow-400'
                          : 'bg-cyan-500 text-black'
                      }`}
                    >
                      {idx + 1}
                    </div>
                  </div>
                );
              })}

            {/* Highlighted region from step */}
            {highlightedRect && (
              <div
                style={{
                  left: `${highlightedRect.x * 100}%`,
                  top: `${highlightedRect.y * 100}%`,
                  width: `${highlightedRect.width * 100}%`,
                  height: `${highlightedRect.height * 100}%`,
                }}
                className="absolute border-2 border-[#90FF00] bg-[#90FF00]/15 rounded shadow-[0_0_20px_rgba(144,255,0,0.5)] pointer-events-none z-20 animate-pulse"
              />
            )}
          </div>
        </div>

        {/* Floating Tool Controls: Zoom / Pan / Hotspots Toggle */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-[#1A1A1A]/90 backdrop-blur-md p-1 rounded-lg border border-[#333] shadow-lg z-30">
          <button
            onClick={handleZoomIn}
            className="p-1.5 rounded hover:bg-[#2E2E2E] text-gray-300 hover:text-white cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-1.5 rounded hover:bg-[#2E2E2E] text-gray-300 hover:text-white cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleResetZoom}
            className="p-1.5 rounded hover:bg-[#2E2E2E] text-gray-300 hover:text-white cursor-pointer"
            title="Reset Zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <div className="w-px h-4 bg-[#333]" />
          <button
            onClick={() => setShowAllHotspots((p) => !p)}
            className={`p-1.5 rounded cursor-pointer ${
              showAllHotspots
                ? 'bg-cyan-500/20 text-cyan-400'
                : 'hover:bg-[#2E2E2E] text-gray-400'
            }`}
            title="Toggle Teaching Hotspots"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded hover:bg-[#2E2E2E] text-gray-300 hover:text-white cursor-pointer"
            title="Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Selected Hotspot Explanation Popover (Bottom Left) */}
        <AnimatePresence>
          {selectedHotspot && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-3 left-3 max-w-sm w-full bg-[#181818]/95 backdrop-blur-md border border-cyan-500/40 rounded-lg p-3 shadow-2xl z-30 font-sans"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <h4 className="text-xs font-bold text-cyan-300">
                    {selectedHotspot.title[lang] ||
                      selectedHotspot.title.he ||
                      selectedHotspot.title.en}
                  </h4>
                </div>
                <button
                  onClick={() => setSelectedHotspot(null)}
                  className="text-gray-400 hover:text-white text-xs p-0.5 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <p className="text-[11px] text-gray-300 mt-1 leading-relaxed">
                {selectedHotspot.description[lang] ||
                  selectedHotspot.description.he ||
                  selectedHotspot.description.en}
              </p>

              {onSwitchToSimulator && selectedHotspot.mappedSimulatorTarget && (
                <div className="mt-2.5 pt-2 border-t border-[#2A2A2A] flex items-center justify-between">
                  <span className="text-[10px] text-gray-400 font-mono">
                    {isHe ? 'יעד בסימולטור מוכן לתרגול' : 'Mapped to Simulator Target'}
                  </span>
                  <button
                    onClick={onSwitchToSimulator}
                    className="px-2 py-0.5 rounded bg-[#FFE853] hover:bg-[#FFF080] text-black font-bold text-[10px] font-mono flex items-center gap-1 cursor-pointer"
                  >
                    <span>{isHe ? 'תרגל בסימולטור' : 'Try in Simulator'}</span>
                    <Sparkles className="w-3 h-3" />
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ========================================================================= */}
      {/* 3. BOTTOM FOOTER: HOTSPOTS QUICK-SELECT & WORKSPACE EXPLANATION          */}
      {/* ========================================================================= */}
      <div className="p-2.5 bg-[#181818] border-t border-[#282828] flex flex-col gap-2 shrink-0 z-20">
        <div className="flex items-center justify-between gap-2 text-xs">
          <p className="text-[11px] text-gray-300 leading-snug">
            {reference.description[lang] ||
              reference.description.he ||
              reference.description.en}
          </p>

          {/* Previous / Next Reference Image Navigation */}
          <div className="flex items-center gap-1 shrink-0">
            {hasPrev && (
              <button
                onClick={onNavigatePrev}
                className="p-1 rounded bg-[#242424] hover:bg-[#333] text-gray-300 hover:text-white cursor-pointer"
                title="Previous Reference"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            )}
            {hasNext && (
              <button
                onClick={onNavigateNext}
                className="p-1 rounded bg-[#242424] hover:bg-[#333] text-gray-300 hover:text-white cursor-pointer"
                title="Next Reference"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Hotspots clickable pills row */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
          <span className="text-[10px] font-mono text-gray-400 uppercase shrink-0">
            {isHe ? 'נקודות עניין:' : 'Hotspots:'}
          </span>
          {reference.hotspots.map((h, i) => (
            <button
              key={h.id}
              onClick={() => {
                setSelectedHotspot(h);
                onSelectHotspot?.(h);
              }}
              className={`px-2 py-0.5 rounded text-[10px] font-mono whitespace-nowrap transition-all cursor-pointer ${
                selectedHotspot?.id === h.id || activeHotspotId === h.id
                  ? 'bg-[#FFE853] text-black font-bold shadow-sm'
                  : 'bg-[#242424] hover:bg-[#303030] text-gray-300 border border-[#333]'
              }`}
            >
              {i + 1}. {h.title[lang] || h.title.he || h.title.en}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * High-definition authentic vector blueprints of Ableton Live 12 Workspaces
 */
function renderWorkspaceVector(workspace: WorkspaceType) {
  switch (workspace) {
    case 'SESSION_VIEW':
      return (
        <div className="w-full h-full flex flex-col bg-[#1D1D1D] text-xs font-mono select-none">
          {/* Top Session Control Bar */}
          <div className="h-7 bg-[#2A2A2A] border-b border-[#141414] px-2 flex items-center justify-between text-[10px] text-gray-300">
            <div className="flex items-center gap-2 font-bold">
              <span className="text-[#FFE853]">LINK</span>
              <span>142.00 BPM</span>
              <span>4/4</span>
              <span className="w-2 h-2 rounded-full bg-yellow-400" />
            </div>
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 rounded bg-black/40 text-cyan-300">Session View [Tab]</span>
            </div>
          </div>

          {/* Session Tracks Grid */}
          <div className="flex-1 flex overflow-hidden">
            {/* Sidebar Browser */}
            <div className="w-36 bg-[#161616] border-r border-[#262626] p-1.5 text-[9px] text-gray-400 flex flex-col gap-1 hidden sm:flex">
              <div className="font-bold text-gray-200 uppercase text-[8px] pb-1 border-b border-[#2A2A2A]">Collections</div>
              <div className="text-red-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Favorites</div>
              <div className="text-yellow-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-yellow-500" /> Psytrance Tools</div>
              <div className="text-green-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Drums & Bass</div>
              <div className="font-bold text-gray-200 uppercase text-[8px] pt-1.5 border-t border-[#2A2A2A]">Categories</div>
              <div className="text-gray-300">Sounds</div>
              <div className="text-gray-300">Drums</div>
              <div className="text-cyan-400 font-bold">Instruments (Drift)</div>
              <div className="text-gray-300">Audio Effects</div>
            </div>

            {/* Session Matrix Columns */}
            <div className="flex-1 flex bg-[#1E1E1E]">
              {/* Track 1: Kick */}
              <div className="flex-1 border-r border-[#282828] flex flex-col">
                <div className="h-6 bg-[#00E5FF]/20 border-b border-[#00E5FF]/40 text-[#00E5FF] font-bold text-[9px] px-1.5 flex items-center justify-between">
                  <span>1 Kick</span>
                  <span className="text-[8px]">Audio</span>
                </div>
                <div className="flex-1 p-1 flex flex-col gap-1">
                  <div className="h-7 bg-[#00E5FF]/30 border border-[#00E5FF] rounded flex items-center justify-between px-1.5 text-[8px] text-cyan-200">
                    <span>Kick Punch</span>
                    <span className="text-yellow-400 font-bold">▶</span>
                  </div>
                  <div className="h-7 bg-[#282828] rounded border border-dashed border-[#444] flex items-center justify-center text-[8px] text-gray-500">
                    Slot 2
                  </div>
                  <div className="h-7 bg-[#282828] rounded border border-dashed border-[#444] flex items-center justify-center text-[8px] text-gray-500">
                    Slot 3
                  </div>
                </div>
                {/* Mixer strip bottom */}
                <div className="h-20 bg-[#161616] border-t border-[#262626] p-1 flex flex-col items-center justify-between text-[8px]">
                  <div className="w-2.5 h-10 bg-gray-700 rounded-sm relative"><div className="absolute bottom-0 w-full h-3/4 bg-cyan-400 rounded-sm" /></div>
                  <div className="flex gap-1"><span className="px-1 bg-[#2A2A2A] rounded text-[8px]">1</span><span className="px-1 bg-yellow-400 text-black font-bold rounded text-[8px]">S</span></div>
                </div>
              </div>

              {/* Track 2: Bass */}
              <div className="flex-1 border-r border-[#282828] flex flex-col bg-[#90FF00]/5">
                <div className="h-6 bg-[#90FF00]/20 border-b border-[#90FF00]/40 text-[#90FF00] font-bold text-[9px] px-1.5 flex items-center justify-between">
                  <span>2 Bass</span>
                  <span className="text-[8px]">MIDI</span>
                </div>
                <div className="flex-1 p-1 flex flex-col gap-1">
                  <div className="h-7 bg-[#90FF00]/30 border border-[#90FF00] rounded flex items-center justify-between px-1.5 text-[8px] text-emerald-200">
                    <span>16th Rolling</span>
                    <span className="text-yellow-400 font-bold">▶</span>
                  </div>
                  <div className="h-7 bg-[#90FF00]/20 border border-[#90FF00]/50 rounded flex items-center justify-between px-1.5 text-[8px] text-emerald-200">
                    <span>Octave Jump</span>
                    <span className="text-gray-400">▶</span>
                  </div>
                  <div className="h-7 bg-[#282828] rounded border border-dashed border-[#444] flex items-center justify-center text-[8px] text-gray-500">
                    Slot 3
                  </div>
                </div>
                {/* Mixer strip bottom */}
                <div className="h-20 bg-[#161616] border-t border-[#262626] p-1 flex flex-col items-center justify-between text-[8px]">
                  <div className="w-2.5 h-10 bg-gray-700 rounded-sm relative"><div className="absolute bottom-0 w-full h-4/5 bg-[#90FF00] rounded-sm" /></div>
                  <div className="flex gap-1"><span className="px-1 bg-[#2A2A2A] rounded text-[8px]">2</span><span className="px-1 bg-red-500 text-white font-bold rounded text-[8px]">●</span></div>
                </div>
              </div>

              {/* Track 3: Lead */}
              <div className="flex-1 border-r border-[#282828] flex flex-col">
                <div className="h-6 bg-[#FFB800]/20 border-b border-[#FFB800]/40 text-[#FFB800] font-bold text-[9px] px-1.5 flex items-center justify-between">
                  <span>3 Lead</span>
                  <span className="text-[8px]">MIDI</span>
                </div>
                <div className="flex-1 p-1 flex flex-col gap-1">
                  <div className="h-7 bg-[#FFB800]/30 border border-[#FFB800] rounded flex items-center justify-between px-1.5 text-[8px] text-amber-200">
                    <span>FM Arp F#</span>
                    <span className="text-yellow-400 font-bold">▶</span>
                  </div>
                  <div className="h-7 bg-[#282828] rounded border border-dashed border-[#444] flex items-center justify-center text-[8px] text-gray-500">
                    Slot 2
                  </div>
                </div>
                {/* Mixer strip bottom */}
                <div className="h-20 bg-[#161616] border-t border-[#262626] p-1 flex flex-col items-center justify-between text-[8px]">
                  <div className="w-2.5 h-10 bg-gray-700 rounded-sm relative"><div className="absolute bottom-0 w-full h-1/2 bg-amber-400 rounded-sm" /></div>
                  <div className="flex gap-1"><span className="px-1 bg-[#2A2A2A] rounded text-[8px]">3</span><span className="px-1 bg-yellow-400 text-black font-bold rounded text-[8px]">S</span></div>
                </div>
              </div>

              {/* Master Column with Scene Launch Buttons */}
              <div className="w-24 bg-[#141414] border-l border-[#282828] flex flex-col">
                <div className="h-6 bg-[#FFE853]/20 border-b border-[#FFE853]/40 text-[#FFE853] font-bold text-[9px] px-1.5 flex items-center justify-between">
                  <span>Master</span>
                </div>
                <div className="flex-1 p-1 flex flex-col gap-1">
                  <div className="h-7 bg-[#2A2A2A] hover:bg-[#3A3A3A] border border-[#FFE853]/50 rounded flex items-center justify-between px-1.5 text-[8px] text-yellow-300 font-bold cursor-pointer">
                    <span>1 Intro</span>
                    <span className="text-yellow-400">▶</span>
                  </div>
                  <div className="h-7 bg-[#2A2A2A] hover:bg-[#3A3A3A] border border-[#444] rounded flex items-center justify-between px-1.5 text-[8px] text-gray-300 cursor-pointer">
                    <span>2 Drop</span>
                    <span className="text-gray-400">▶</span>
                  </div>
                  <div className="h-7 bg-[#2A2A2A] hover:bg-[#3A3A3A] border border-[#444] rounded flex items-center justify-between px-1.5 text-[8px] text-gray-300 cursor-pointer">
                    <span>3 Breakdown</span>
                    <span className="text-gray-400">▶</span>
                  </div>
                </div>
                <div className="h-20 bg-[#121212] border-t border-[#262626] p-1 flex flex-col items-center justify-between text-[8px]">
                  <div className="px-2 py-0.5 rounded bg-rose-900/60 border border-rose-600 text-rose-200 text-[8px] font-bold">Stop All</div>
                  <div className="w-3 h-10 bg-gray-700 rounded-sm relative"><div className="absolute bottom-0 w-full h-5/6 bg-[#FFE853] rounded-sm" /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case 'ARRANGEMENT_VIEW':
      return (
        <div className="w-full h-full flex flex-col bg-[#1D1D1D] text-xs font-mono select-none">
          {/* Top Ruler */}
          <div className="h-6 bg-[#262626] border-b border-[#141414] px-2 flex items-center text-[9px] text-gray-400 gap-8">
            <span className="text-yellow-400 font-bold">1.1</span>
            <span>5.1</span>
            <span>9.1 (Drop)</span>
            <span>13.1</span>
            <span>17.1 (Climax)</span>
            <span>21.1</span>
            <span>25.1</span>
          </div>

          {/* Timeline Tracks */}
          <div className="flex-1 flex flex-col bg-[#161616]">
            {/* Lane 1: Kick */}
            <div className="h-14 border-b border-[#242424] flex items-center relative">
              <div className="flex-1 h-full relative p-1">
                <div className="absolute left-0 top-1 bottom-1 w-[48%] bg-[#00E5FF]/25 border border-[#00E5FF] rounded px-1.5 flex items-center justify-between text-[8px] text-cyan-200">
                  <span>Kick 4x4 Steady</span>
                </div>
                <div className="absolute left-[50%] top-1 bottom-1 w-[48%] bg-[#00E5FF]/25 border border-[#00E5FF] rounded px-1.5 flex items-center justify-between text-[8px] text-cyan-200">
                  <span>Kick Driving Pattern</span>
                </div>
              </div>
              <div className="w-24 h-full bg-[#202020] border-l border-[#2C2C2C] p-1 flex flex-col justify-between text-[8px]">
                <span className="font-bold text-cyan-300">1 Kick</span>
                <div className="flex gap-1"><span className="px-1 bg-yellow-400 text-black font-bold rounded">S</span><span className="px-1 bg-[#333] text-gray-200 rounded">M</span></div>
              </div>
            </div>

            {/* Lane 2: Bass */}
            <div className="h-14 border-b border-[#242424] flex items-center relative bg-[#90FF00]/5">
              <div className="flex-1 h-full relative p-1">
                <div className="absolute left-[12%] top-1 bottom-1 w-[40%] bg-[#90FF00]/30 border border-[#90FF00] rounded px-1.5 flex items-center justify-between text-[8px] text-emerald-200">
                  <span>16th Rolling Bass (F#)</span>
                </div>
                <div className="absolute left-[54%] top-1 bottom-1 w-[44%] bg-[#90FF00]/30 border border-[#90FF00] rounded px-1.5 flex items-center justify-between text-[8px] text-emerald-200">
                  <span>Rolling Bass with Filter Open</span>
                </div>
              </div>
              <div className="w-24 h-full bg-[#202020] border-l border-[#2C2C2C] p-1 flex flex-col justify-between text-[8px]">
                <span className="font-bold text-[#90FF00]">2 Bass</span>
                <div className="flex gap-1"><span className="px-1 bg-red-500 text-white font-bold rounded">●</span><span className="px-1 bg-yellow-400 text-black font-bold rounded">S</span></div>
              </div>
            </div>

            {/* Lane 3: Lead */}
            <div className="h-14 border-b border-[#242424] flex items-center relative">
              <div className="flex-1 h-full relative p-1">
                <div className="absolute left-[30%] top-1 bottom-1 w-[68%] bg-[#FFB800]/25 border border-[#FFB800] rounded px-1.5 flex items-center justify-between text-[8px] text-amber-200">
                  <span>FM Synth Hook</span>
                </div>
              </div>
              <div className="w-24 h-full bg-[#202020] border-l border-[#2C2C2C] p-1 flex flex-col justify-between text-[8px]">
                <span className="font-bold text-amber-300">3 Lead</span>
                <div className="flex gap-1"><span className="px-1 bg-yellow-400 text-black font-bold rounded">S</span><span className="px-1 bg-[#333] text-gray-200 rounded">M</span></div>
              </div>
            </div>
          </div>
        </div>
      );

    case 'MIDI_EDITOR':
      return (
        <div className="w-full h-full flex flex-col bg-[#151515] text-xs font-mono select-none">
          <div className="h-6 bg-[#252525] border-b border-[#141414] px-2 flex items-center justify-between text-[9px] text-gray-300">
            <span className="text-[#90FF00] font-bold">MIDI Piano Roll - F# Minor (16th Grid)</span>
            <span className="text-gray-400">Fold: ON | Quantize: 1/16</span>
          </div>
          <div className="flex-1 flex overflow-hidden">
            {/* Keyboard Strip */}
            <div className="w-12 bg-[#202020] border-r border-[#303030] flex flex-col justify-between py-1 text-[8px] text-gray-300 font-bold">
              <div className="px-1 text-white bg-gray-800">G1</div>
              <div className="px-1 text-yellow-400 bg-yellow-900/30">F#1</div>
              <div className="px-1 text-gray-400">F1</div>
              <div className="px-1 text-white bg-gray-800">E1</div>
              <div className="px-1 text-gray-400">D#1</div>
              <div className="px-1 text-white bg-gray-800">D1</div>
            </div>
            {/* Note Grid */}
            <div className="flex-1 bg-[#181818] p-2 relative grid grid-cols-16 grid-rows-6 gap-0.5">
              {/* 16th rolling notes pattern */}
              <div className="col-start-2 col-span-1 row-start-2 bg-[#90FF00] rounded-sm text-[7px] text-black font-bold flex items-center justify-center shadow">F#1</div>
              <div className="col-start-3 col-span-1 row-start-2 bg-[#90FF00] rounded-sm text-[7px] text-black font-bold flex items-center justify-center shadow">F#1</div>
              <div className="col-start-4 col-span-1 row-start-2 bg-[#90FF00] rounded-sm text-[7px] text-black font-bold flex items-center justify-center shadow">F#1</div>

              <div className="col-start-6 col-span-1 row-start-2 bg-[#90FF00] rounded-sm text-[7px] text-black font-bold flex items-center justify-center shadow">F#1</div>
              <div className="col-start-7 col-span-1 row-start-2 bg-[#90FF00] rounded-sm text-[7px] text-black font-bold flex items-center justify-center shadow">F#1</div>
              <div className="col-start-8 col-span-1 row-start-2 bg-[#90FF00] rounded-sm text-[7px] text-black font-bold flex items-center justify-center shadow">F#1</div>
            </div>
          </div>
          {/* Velocity */}
          <div className="h-10 bg-[#1B1B1B] border-t border-[#2A2A2A] px-2 flex items-center gap-2 text-[8px] text-gray-400">
            <span>Velocity:</span>
            <div className="flex-1 flex items-end gap-1 h-6">
              <div className="w-2 h-4 bg-[#90FF00] rounded-t-sm" />
              <div className="w-2 h-5 bg-[#90FF00] rounded-t-sm" />
              <div className="w-2 h-5 bg-[#90FF00] rounded-t-sm" />
              <div className="w-2 h-4 bg-[#90FF00] rounded-t-sm" />
            </div>
          </div>
        </div>
      );

    case 'DEVICE_VIEW':
      return (
        <div className="w-full h-full flex flex-col bg-[#1A1A1A] text-xs font-mono select-none p-2">
          <div className="h-6 bg-[#2B2B2B] rounded-t px-2 flex items-center justify-between text-[9px] text-gray-300">
            <span className="text-[#FFE853] font-bold">Drift Synthesizer + Audio Effect Chain</span>
            <span className="text-cyan-400 font-bold">Track 2: Bass</span>
          </div>
          <div className="flex-1 bg-[#222] border border-[#333] rounded-b p-3 flex gap-3 overflow-x-auto">
            {/* Drift Synth */}
            <div className="w-64 bg-[#1E1E1E] border border-cyan-500/40 rounded p-2 flex flex-col justify-between text-[9px]">
              <div className="flex items-center justify-between font-bold text-cyan-300">
                <span>● Drift</span>
                <span className="text-gray-400">Subtractive</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-gray-300">
                <div className="bg-[#141414] p-1.5 rounded">Osc 1: <span className="text-yellow-400 font-bold">Saw</span></div>
                <div className="bg-[#141414] p-1.5 rounded">Osc 2: <span className="text-yellow-400 font-bold">Pulse</span></div>
                <div className="bg-[#141414] p-1.5 rounded">Cutoff: <span className="text-cyan-300 font-bold">840 Hz</span></div>
                <div className="bg-[#141414] p-1.5 rounded">Resonance: <span className="text-cyan-300 font-bold">45%</span></div>
              </div>
            </div>

            {/* Compressor */}
            <div className="w-64 bg-[#1E1E1E] border border-emerald-500/40 rounded p-2 flex flex-col justify-between text-[9px]">
              <div className="flex items-center justify-between font-bold text-emerald-300">
                <span>● Compressor</span>
                <span className="text-[#90FF00] font-bold">Sidechain ON</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-gray-300">
                <div className="bg-[#141414] p-1.5 rounded">Source: <span className="text-cyan-300 font-bold">1 Kick</span></div>
                <div className="bg-[#141414] p-1.5 rounded">Ratio: <span className="text-yellow-400 font-bold">4.0:1</span></div>
                <div className="bg-[#141414] p-1.5 rounded">Attack: <span className="text-yellow-400 font-bold">2.0 ms</span></div>
                <div className="bg-[#141414] p-1.5 rounded">Release: <span className="text-yellow-400 font-bold">50 ms</span></div>
              </div>
            </div>
          </div>
        </div>
      );

    case 'MIXER':
      return (
        <div className="w-full h-full flex flex-col bg-[#1D1D1D] text-xs font-mono select-none p-2">
          <div className="h-6 bg-[#2B2B2B] rounded-t px-2 flex items-center justify-between text-[9px] text-gray-300">
            <span className="text-[#00E5FF] font-bold">Ableton Live 12 Mixing Console</span>
            <span className="text-[#90FF00] font-bold">Peak / RMS Metering Active</span>
          </div>
          <div className="flex-1 bg-[#181818] border border-[#333] rounded-b p-2 flex gap-2 overflow-x-auto">
            {['1 Kick', '2 Bass', '3 Lead', '4 Perc', 'A Reverb', 'Master'].map((tName, i) => (
              <div key={tName} className="flex-1 min-w-[54px] bg-[#222] border border-[#333] rounded flex flex-col justify-between p-1.5 text-[9px]">
                <div className="text-center font-bold text-gray-200 truncate">{tName}</div>
                <div className="flex-1 flex justify-center items-end py-2">
                  <div className="w-3 h-28 bg-[#111] rounded-sm relative overflow-hidden flex flex-col justify-end p-0.5">
                    <div style={{ height: `${65 - (i * 8)}%` }} className="w-full bg-gradient-to-t from-[#90FF00] via-yellow-400 to-red-500 rounded-xs" />
                  </div>
                </div>
                <div className="text-center text-[8px] text-gray-400">0.0 dB</div>
                <div className="w-full h-1 bg-yellow-400 rounded-full mt-1" />
              </div>
            ))}
          </div>
        </div>
      );

    case 'BROWSER':
      return (
        <div className="w-full h-full flex bg-[#1A1A1A] text-xs font-mono select-none p-2 gap-2">
          <div className="w-1/3 bg-[#202020] border border-[#333] rounded p-2 flex flex-col gap-2">
            <div className="text-[10px] font-bold text-cyan-300">Categories</div>
            <div className="text-[9px] text-gray-300 space-y-1">
              <div className="bg-[#2A2A2A] px-1.5 py-0.5 rounded text-white">● Sounds</div>
              <div className="px-1.5 py-0.5 text-gray-400">● Drums</div>
              <div className="px-1.5 py-0.5 text-yellow-400 font-bold">● Instruments</div>
              <div className="px-1.5 py-0.5 text-gray-400">● Audio Effects</div>
            </div>
          </div>
          <div className="flex-1 bg-[#202020] border border-[#333] rounded p-2 flex flex-col gap-2">
            <div className="text-[10px] font-bold text-white flex justify-between">
              <span>Instrument Presets</span>
              <span className="text-xs text-gray-400">Search: Cmd+F</span>
            </div>
            <div className="text-[9px] space-y-1 text-gray-300">
              <div className="bg-[#2A2A2A] p-1.5 rounded flex justify-between">
                <span>Drift - Analog Bass</span>
                <span className="text-[#90FF00]">Ableton 12</span>
              </div>
              <div className="p-1.5 rounded flex justify-between text-gray-400">
                <span>Operator - FM Psy Rolling Bass</span>
                <span>Preset</span>
              </div>
              <div className="p-1.5 rounded flex justify-between text-gray-400">
                <span>Wavetable - Acid Morph Lead</span>
                <span>Preset</span>
              </div>
            </div>
          </div>
        </div>
      );

    case 'CLIP_VIEW':
    case 'AUDIO_EDITOR':
      return (
        <div className="w-full h-full flex flex-col bg-[#1A1A1A] text-xs font-mono select-none p-2">
          <div className="h-6 bg-[#2B2B2B] rounded-t px-2 flex items-center justify-between text-[9px] text-gray-300">
            <span className="text-[#FFE853] font-bold">Clip View: Psytrance_Bass_F#_142.wav</span>
            <span className="text-[#90FF00] font-bold">Warp Mode: Beats</span>
          </div>
          <div className="flex-1 bg-[#141414] border border-[#333] rounded-b p-3 flex flex-col justify-between">
            <div className="flex items-center gap-4 text-[9px] text-gray-400 pb-2 border-b border-[#252525]">
              <span>Transpose: <strong className="text-white">0 st</strong></span>
              <span>Gain: <strong className="text-white">+0.0 dB</strong></span>
              <span>Warp: <strong className="text-[#90FF00]">ON</strong></span>
              <span>Loop: <strong className="text-yellow-400">ON (1.1 - 2.1)</strong></span>
            </div>
            <div className="h-28 bg-[#1B1B1B] rounded border border-[#282828] relative flex items-center justify-center overflow-hidden">
              <svg className="w-full h-full text-cyan-400" viewBox="0 0 400 100" preserveAspectRatio="none">
                <path d="M 0 50 Q 25 10 50 50 T 100 50 T 150 50 T 200 50 T 250 50 T 300 50 T 350 50 T 400 50" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M 0 50 Q 25 80 50 50 T 100 50 T 150 50 T 200 50 T 250 50 T 300 50 T 350 50 T 400 50" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
              </svg>
            </div>
          </div>
        </div>
      );

    case 'AUTOMATION':
      return (
        <div className="w-full h-full flex flex-col bg-[#1A1A1A] text-xs font-mono select-none p-2">
          <div className="h-6 bg-[#2B2B2B] rounded-t px-2 flex items-center justify-between text-[9px] text-gray-300">
            <span className="text-[#EF4444] font-bold">Track 2: Auto Filter - Frequency Automation</span>
            <span className="text-cyan-400 font-bold">Lanes Active</span>
          </div>
          <div className="flex-1 bg-[#141414] border border-[#333] rounded-b p-3 relative flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
              <line x1="0" y1="80" x2="100" y2="80" stroke="#EF4444" strokeWidth="2" />
              <line x1="100" y1="80" x2="250" y2="20" stroke="#EF4444" strokeWidth="2.5" />
              <line x1="250" y1="20" x2="400" y2="20" stroke="#EF4444" strokeWidth="2" />
              <circle cx="100" cy="80" r="4" fill="#FFE853" />
              <circle cx="250" cy="20" r="4" fill="#FFE853" />
            </svg>
            <div className="absolute top-2 right-3 text-[9px] text-gray-400 bg-[#222]/80 px-2 py-1 rounded">
              Alt + Drag to curve breakpoint
            </div>
          </div>
        </div>
      );

    case 'TRANSPORT':
    case 'CONTROL_BAR':
      return (
        <div className="w-full h-full flex flex-col justify-center items-center bg-[#1D1D1D] text-xs font-mono select-none p-4">
          <div className="w-full max-w-xl bg-[#282828] border border-[#444] rounded-lg p-3 flex items-center justify-between shadow-xl">
            <div className="flex items-center gap-3">
              <span className="px-2 py-1 rounded bg-[#FFE853] text-black font-bold text-xs">LINK</span>
              <span className="font-bold text-white text-sm">142.00 BPM</span>
              <span className="text-gray-400 text-xs">4/4</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded bg-[#1A1A1A] border border-[#444] flex items-center justify-center text-yellow-400 text-xs">
                ●
              </div>
              <div className="w-7 h-7 rounded bg-[#90FF00] flex items-center justify-center text-black font-bold text-xs">
                ▶
              </div>
              <div className="w-7 h-7 rounded bg-[#333] flex items-center justify-center text-white text-xs">
                ■
              </div>
              <div className="w-7 h-7 rounded bg-[#FF3333] flex items-center justify-center text-white font-bold text-xs">
                ●
              </div>
            </div>
          </div>
        </div>
      );

    case 'PREFERENCES':
    case 'WORKFLOW':
      return (
        <div className="w-full h-full flex flex-col bg-[#1A1A1A] text-xs font-mono select-none p-2">
          <div className="h-6 bg-[#2B2B2B] rounded-t px-2 flex items-center justify-between text-[9px] text-gray-300">
            <span className="text-cyan-400 font-bold">Preferences & Audio Setup</span>
            <span className="text-[#90FF00] font-bold">Audio Engine ON</span>
          </div>
          <div className="flex-1 bg-[#141414] border border-[#333] rounded-b p-3 space-y-2">
            <div className="flex justify-between p-2 bg-[#1E1E1E] rounded">
              <span className="text-gray-300">Driver Type:</span>
              <span className="text-white font-bold">CoreAudio / ASIO</span>
            </div>
            <div className="flex justify-between p-2 bg-[#1E1E1E] rounded">
              <span className="text-gray-300">Sample Rate:</span>
              <span className="text-[#90FF00] font-bold">48000 Hz</span>
            </div>
            <div className="flex justify-between p-2 bg-[#1E1E1E] rounded">
              <span className="text-gray-300">Buffer Size:</span>
              <span className="text-yellow-400 font-bold">128 Samples (Low Latency)</span>
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div className="w-full h-full flex items-center justify-center bg-[#151515] text-gray-400 font-mono text-xs p-4 text-center">
          <div>
            <div className="text-cyan-400 font-bold text-sm mb-1">Ableton Live 12 Interface Blueprint</div>
            <div className="text-gray-500 text-[11px]">Official educational vector reference</div>
          </div>
        </div>
      );
  }
}
