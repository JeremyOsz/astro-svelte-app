// Export all tooltip handlers with explicit naming to avoid conflicts
export {
  createNatalTooltip,
  handleNatalMouseOver,
  handleNatalMouseOut,
  handleNatalClick,
  unpinNatalTooltip,
  getNatalPlanetInterpretation,
  getNatalAspectInterpretation,
  getNatalSignInterpretation
} from './natal-tooltip';

export {
  createTransitTooltip,
  handleTransitMouseOver,
  handleTransitMouseOut,
  handleTransitClick,
  unpinTransitTooltip,
  getTransitPlanetInterpretation,
  getTransitAspectInterpretation,
  getNatalPlanetInterpretation as getTransitNatalPlanetInterpretation,
  getNatalAspectInterpretation as getTransitNatalAspectInterpretation,
  getSignInterpretation as getTransitSignInterpretation
} from './transit-tooltip';

export {
  getTooltipPinned,
  setTooltipPinned,
  getPinnedData,
  setPinnedData,
  positionTooltip,
  showTooltip,
  hideTooltip,
  handleTooltipClick,
  unpinTooltip as unpinSharedTooltip,
  createTooltip as createSharedTooltip
} from './shared-tooltip';

// Synastry tooltip exports
export {
  createSynastryTooltip,
  getSynastryAspectSummary,
  getSynastryKeyAspects,
  type SynastryTooltipData
} from './synastry-tooltip';

// Synastry chart tooltip exports - removed as not currently used

// Legacy exports for backward compatibility
export * from './chart-tooltip';
export * from './brief-tooltip'; 