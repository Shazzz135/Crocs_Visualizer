import { describe, it, expect } from 'vitest';
import { EXPORT_WATERMARK_LINES, LEGAL_DISCLAIMER_NOTICES } from '../src/constants/disclaimers.js';

describe('Legal & Retail Disclaimers Specification', () => {
  it('defines valid non-commercial watermark lines for canvas export', () => {
    expect(EXPORT_WATERMARK_LINES).toHaveLength(3);

    // Must mention non-commercial fan visualizer or prototype
    expect(EXPORT_WATERMARK_LINES[0]).toMatch(/non-commercial/i);
    expect(EXPORT_WATERMARK_LINES[0]).toMatch(/not affiliated with crocs/i);

    // Must specify trademark attribution
    expect(EXPORT_WATERMARK_LINES[1]).toMatch(/registered trademarks of crocs/i);
    expect(EXPORT_WATERMARK_LINES[1]).toMatch(/jibbitz/i);

    // Must note retail inventory and availability
    expect(EXPORT_WATERMARK_LINES[2]).toMatch(/retail inventory/i);
    expect(EXPORT_WATERMARK_LINES[2]).toMatch(/availability/i);
  });

  it('defines comprehensive disclaimer copy for legal modal', () => {
    expect(LEGAL_DISCLAIMER_NOTICES.nonAffiliation).toContain('independent fan-made');
    expect(LEGAL_DISCLAIMER_NOTICES.trademarkNotice).toContain('CROCS®');
    expect(LEGAL_DISCLAIMER_NOTICES.retailAvailability).toContain('In-store retail inventory');
    expect(LEGAL_DISCLAIMER_NOTICES.zeroAccountPrivacy).toContain('Zero-account privacy');
  });
});
