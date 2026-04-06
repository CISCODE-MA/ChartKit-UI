import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import {
  singleDataset,
  multiDatasets,
  defaultTheme,
  getCanvasData,
  describeCommonChartBehavior,
} from '../../__tests__/chart-test-utils';

vi.mock('react-chartjs-2', () => ({
  Line: (props: { data: unknown; options: unknown }) => (
    <canvas
      data-testid="area-canvas"
      data-options={JSON.stringify(props.options)}
      data-data={JSON.stringify(props.data)}
    />
  ),
}));

vi.mock('chart.js', () => ({
  Chart: { register: vi.fn() },
  CategoryScale: 'CategoryScale',
  LinearScale: 'LinearScale',
  LineElement: 'LineElement',
  PointElement: 'PointElement',
  Filler: 'Filler',
  Tooltip: 'Tooltip',
  Legend: 'Legend',
}));

import { AreaChart } from './AreaChart';

const CANVAS_TEST_ID = 'area-canvas';

describe('AreaChart', () => {
  describeCommonChartBehavior(AreaChart, CANVAS_TEST_ID);

  it('should set fill true on all datasets (area variant)', () => {
    render(<AreaChart data={multiDatasets} theme={defaultTheme} />);
    const { data } = getCanvasData(CANVAS_TEST_ID);
    for (const ds of data.datasets) {
      expect(ds.fill).toBe(true);
    }
  });

  it('should apply 20% opacity (append 33) to backgroundColor', () => {
    render(<AreaChart data={singleDataset} theme={defaultTheme} />);
    const { data } = getCanvasData(CANVAS_TEST_ID);
    expect(data.datasets[0].backgroundColor).toBe('#FF000033');
  });

  it('should use dataset color with 20% opacity when color is provided', () => {
    render(<AreaChart data={multiDatasets} theme={defaultTheme} />);
    const { data } = getCanvasData(CANVAS_TEST_ID);
    expect(data.datasets[1].backgroundColor).toBe('#00FF0033');
  });

  it('should set tension 0.4 on all datasets when smooth is true', () => {
    render(<AreaChart data={multiDatasets} theme={defaultTheme} smooth />);
    const { data } = getCanvasData(CANVAS_TEST_ID);
    for (const ds of data.datasets) {
      expect(ds.tension).toBe(0.4);
    }
  });

  it('should not set tension when smooth is false', () => {
    render(<AreaChart data={singleDataset} theme={defaultTheme} />);
    const { data } = getCanvasData(CANVAS_TEST_ID);
    expect(data.datasets[0].tension).toBeUndefined();
  });

  it('should set scales.y.stacked true when stacked is true', () => {
    render(<AreaChart data={singleDataset} theme={defaultTheme} stacked />);
    const { options } = getCanvasData(CANVAS_TEST_ID);
    expect(options.scales.y.stacked).toBe(true);
  });

  it('should not set stacked when stacked prop is false', () => {
    render(<AreaChart data={singleDataset} theme={defaultTheme} />);
    const { options } = getCanvasData(CANVAS_TEST_ID);
    expect(options.scales.y.stacked).toBeUndefined();
  });

  it('should support stacked and smooth together', () => {
    render(<AreaChart data={multiDatasets} theme={defaultTheme} stacked smooth />);
    const { options, data } = getCanvasData(CANVAS_TEST_ID);
    expect(options.scales.y.stacked).toBe(true);
    for (const ds of data.datasets) {
      expect(ds.tension).toBe(0.4);
      expect(ds.fill).toBe(true);
    }
  });
});
