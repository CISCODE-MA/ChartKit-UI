import { describe, it, expect } from 'vitest';
import { buildChartConfig } from './buildChartConfig';
import type { ChartDataset, ChartTheme } from '../types/chart.types';

const sampleData = [
  { label: 'Jan', value: 10 },
  { label: 'Feb', value: 20 },
  { label: 'Mar', value: 30 },
];

const baseTheme: ChartTheme = {
  colors: ['#FF0000', '#00FF00', '#0000FF'],
  fontFamily: 'Arial',
  fontSize: 14,
  grid: { color: '#E0E0E0', display: true },
  tooltip: {
    enabled: true,
    backgroundColor: '#333',
    titleColor: '#FFF',
    bodyColor: '#CCC',
  },
  legend: { display: true, position: 'bottom' },
};

const datasets: ChartDataset[] = [
  { id: 'ds1', label: 'Sales', data: sampleData },
  { id: 'ds2', label: 'Revenue', data: sampleData, color: '#ABCDEF' },
];

describe('buildChartConfig', () => {
  describe('bar variant', () => {
    const config = buildChartConfig(datasets, baseTheme, 'bar');

    it('should set type to bar', () => {
      expect(config.type).toBe('bar');
    });

    it('should extract labels from the first dataset', () => {
      expect(config.data.labels).toEqual(['Jan', 'Feb', 'Mar']);
    });

    it('should map dataset values', () => {
      expect(config.data.datasets[0].data).toEqual([10, 20, 30]);
    });

    it('should fall back to theme.colors when dataset.color is undefined', () => {
      expect(config.data.datasets[0].backgroundColor).toBe('#FF0000');
      expect(config.data.datasets[0].borderColor).toBe('#FF0000');
    });

    it('should use dataset.color when provided', () => {
      expect(config.data.datasets[1].backgroundColor).toBe('#ABCDEF');
      expect(config.data.datasets[1].borderColor).toBe('#ABCDEF');
    });

    it('should not set fill for bar variant', () => {
      expect(config.data.datasets[0].fill).toBeUndefined();
    });
  });

  describe('line variant', () => {
    const config = buildChartConfig(datasets, baseTheme, 'line');

    it('should set type to line', () => {
      expect(config.type).toBe('line');
    });

    it('should not set fill for line variant', () => {
      expect(config.data.datasets[0].fill).toBeUndefined();
    });
  });

  describe('area variant', () => {
    const config = buildChartConfig(datasets, baseTheme, 'area');

    it('should set type to line for area variant', () => {
      expect(config.type).toBe('line');
    });

    it('should set fill true for area datasets', () => {
      expect(config.data.datasets[0].fill).toBe(true);
      expect(config.data.datasets[1].fill).toBe(true);
    });

    it('should append 33 to hex color for 20% opacity background', () => {
      expect(config.data.datasets[0].backgroundColor).toBe('#FF000033');
    });

    it('should append 33 to explicit dataset color for area', () => {
      expect(config.data.datasets[1].backgroundColor).toBe('#ABCDEF33');
    });

    it('should keep borderColor without opacity suffix', () => {
      expect(config.data.datasets[0].borderColor).toBe('#FF0000');
    });
  });

  describe('theme fields reflected in output', () => {
    const config = buildChartConfig(datasets, baseTheme, 'bar');

    it('should reflect tooltip settings', () => {
      expect(config.options.plugins.tooltip.enabled).toBe(true);
      expect(config.options.plugins.tooltip.backgroundColor).toBe('#333');
      expect(config.options.plugins.tooltip.titleColor).toBe('#FFF');
      expect(config.options.plugins.tooltip.bodyColor).toBe('#CCC');
    });

    it('should reflect legend settings', () => {
      expect(config.options.plugins.legend.display).toBe(true);
      expect(config.options.plugins.legend.position).toBe('bottom');
    });

    it('should reflect grid settings on both axes', () => {
      expect(config.options.scales.x.grid.display).toBe(true);
      expect(config.options.scales.x.grid.color).toBe('#E0E0E0');
      expect(config.options.scales.y.grid.display).toBe(true);
      expect(config.options.scales.y.grid.color).toBe('#E0E0E0');
    });

    it('should reflect fontFamily and fontSize in tick fonts', () => {
      expect(config.options.scales.x.ticks).toEqual({ font: { family: 'Arial', size: 14 } });
      expect(config.options.scales.y.ticks).toEqual({ font: { family: 'Arial', size: 14 } });
    });

    it('should set responsive true', () => {
      expect(config.options.responsive).toBe(true);
    });
  });

  describe('color cycling', () => {
    it('should cycle through theme.colors when there are more datasets than colors', () => {
      const threeDs: ChartDataset[] = [
        { id: '1', label: 'A', data: sampleData },
        { id: '2', label: 'B', data: sampleData },
        { id: '3', label: 'C', data: sampleData },
        { id: '4', label: 'D', data: sampleData },
      ];
      const config = buildChartConfig(threeDs, baseTheme, 'bar');
      expect(config.data.datasets[3].backgroundColor).toBe('#FF0000');
    });
  });

  describe('empty datasets', () => {
    it('should produce empty labels for empty datasets array', () => {
      const config = buildChartConfig([], baseTheme, 'bar');
      expect(config.data.labels).toEqual([]);
      expect(config.data.datasets).toEqual([]);
    });
  });

  describe('default theme values', () => {
    const minTheme: ChartTheme = { colors: ['#111'] };
    const config = buildChartConfig(datasets, minTheme, 'line');

    it('should default tooltip.enabled to true', () => {
      expect(config.options.plugins.tooltip.enabled).toBe(true);
    });

    it('should default legend.display to true and position to top', () => {
      expect(config.options.plugins.legend.display).toBe(true);
      expect(config.options.plugins.legend.position).toBe('top');
    });

    it('should default grid.display to true', () => {
      expect(config.options.scales.x.grid.display).toBe(true);
    });
  });
});
