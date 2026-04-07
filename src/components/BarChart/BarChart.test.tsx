import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import {
  singleDataset,
  defaultTheme,
  getCanvasData,
  describeCommonChartBehavior,
} from '../../__tests__/chart-test-utils';

vi.mock('react-chartjs-2', () => ({
  Bar: (props: { data: unknown; options: unknown }) => (
    <canvas
      data-testid="bar-canvas"
      data-options={JSON.stringify(props.options)}
      data-data={JSON.stringify(props.data)}
    />
  ),
}));

vi.mock('chart.js', () => ({
  Chart: { register: vi.fn() },
  CategoryScale: 'CategoryScale',
  LinearScale: 'LinearScale',
  BarElement: 'BarElement',
  Tooltip: 'Tooltip',
  Legend: 'Legend',
}));

import { BarChart } from './BarChart';

const CANVAS_TEST_ID = 'bar-canvas';

describe('BarChart', () => {
  describeCommonChartBehavior(BarChart, CANVAS_TEST_ID);

  it('should set stacked on both axes when stacked prop is true', () => {
    render(<BarChart data={singleDataset} theme={defaultTheme} stacked />);
    const { options } = getCanvasData(CANVAS_TEST_ID);
    expect(options.scales.x.stacked).toBe(true);
    expect(options.scales.y.stacked).toBe(true);
  });

  it('should not set stacked when stacked prop is false', () => {
    render(<BarChart data={singleDataset} theme={defaultTheme} />);
    const { options } = getCanvasData(CANVAS_TEST_ID);
    expect(options.scales.x.stacked).toBeUndefined();
    expect(options.scales.y.stacked).toBeUndefined();
  });

  it('should set indexAxis to y when horizontal is true', () => {
    render(<BarChart data={singleDataset} theme={defaultTheme} horizontal />);
    const { options } = getCanvasData(CANVAS_TEST_ID);
    expect(options.indexAxis).toBe('y');
  });

  it('should not set indexAxis when horizontal is false', () => {
    render(<BarChart data={singleDataset} theme={defaultTheme} />);
    const { options } = getCanvasData(CANVAS_TEST_ID);
    expect(options.indexAxis).toBeUndefined();
  });

  it('should pass animation enabled by default (no explicit disable)', () => {
    render(<BarChart data={singleDataset} theme={defaultTheme} />);
    const { options } = getCanvasData(CANVAS_TEST_ID);
    expect(options.animation).toBeUndefined();
  });

  it('should reflect theme tooltip and legend settings in options', () => {
    render(<BarChart data={singleDataset} theme={defaultTheme} />);
    const { options } = getCanvasData(CANVAS_TEST_ID);
    expect(options.plugins.tooltip.enabled).toBe(true);
    expect(options.plugins.tooltip.backgroundColor).toBe('#333');
    expect(options.plugins.legend.display).toBe(true);
    expect(options.plugins.legend.position).toBe('bottom');
  });

  it('should support stacked and horizontal together', () => {
    render(<BarChart data={singleDataset} theme={defaultTheme} stacked horizontal />);
    const { options } = getCanvasData(CANVAS_TEST_ID);
    expect(options.scales.x.stacked).toBe(true);
    expect(options.scales.y.stacked).toBe(true);
    expect(options.indexAxis).toBe('y');
  });

  it('should handle empty data array without crash', () => {
    render(<BarChart data={[]} theme={defaultTheme} />);
    const { data } = getCanvasData(CANVAS_TEST_ID);
    expect(data.labels).toEqual([]);
    expect(data.datasets).toEqual([]);
  });
});
