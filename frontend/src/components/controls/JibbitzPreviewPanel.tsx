import React from 'react';
import { JibbitzDiscoveryDrawer } from '../discovery/JibbitzDiscoveryDrawer.js';

/**
 * Backwards-compatible wrapper delegating to the Milestone 5 JibbitzDiscoveryDrawer.
 */
export const JibbitzPreviewPanel: React.FC = () => {
  return <JibbitzDiscoveryDrawer />;
};

export default JibbitzPreviewPanel;
