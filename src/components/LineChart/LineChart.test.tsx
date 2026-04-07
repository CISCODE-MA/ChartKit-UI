import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
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
      data-testid="line-canvas"
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

import { LineChart } from './LineChart';

const CANVAS_TEST_ID = 'line-canvas';

describe('LineChart', () => {
  describeCommonChartBehavior(LineChart, CANVAS_TEST_ID);

  it('should not set tension when smooth is false', () => {
    render(<LineChart data={singleDataset} theme={defaultTheme} />);
    const { data } = getCanvasData(CANVAS_TEST_ID);
    expect(data.datasets[0].tension).toBeUndefined();
  });

  it('should set tension 0.4 on all datasets when smooth is true', () => {
    render(<LineChart data={multiDatasets} theme={defaultTheme} smooth />);
    const { data } = getCanvasData(CANVAS_TEST_ID);
    for (const ds of data.datasets) {
      expect(ds.tension).toBe(0.4);
    }
  });

  it('should not set fill for line variant', () => {
    render(<LineChart data={singleDataset} theme={defaultTheme} />);
    const { data } = getCanvasData(CANVAS_TEST_ID);
    expect(data.datasets[0].fill).toBeUndefined();
  });
});
