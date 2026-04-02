import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import type { ChartDataset, ChartTheme } from '../../types/chart.types';

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

const singleDataset: ChartDataset[] = [
  {
    id: 'ds1',
    label: 'Sales',
    data: [
      { label: 'Jan', value: 10 },
      { label: 'Feb', value: 20 },
    ],
  },
];

const multiDatasets: ChartDataset[] = [
  {
    id: 'ds1',
    label: 'Sales',
    data: [
      { label: 'Jan', value: 10 },
      { label: 'Feb', value: 20 },
    ],
  },
  {
    id: 'ds2',
    label: 'Revenue',
    data: [
      { label: 'Jan', value: 30 },
      { label: 'Feb', value: 40 },
    ],
    color: '#00FF00',
  },
  {
    id: 'ds3',
    label: 'Costs',
    data: [
      { label: 'Jan', value: 5 },
      { label: 'Feb', value: 15 },
    ],
  },
];

const theme: ChartTheme = {
  colors: ['#FF0000', '#00FF00', '#0000FF'],
  fontFamily: 'Arial',
  fontSize: 14,
  grid: { color: '#ccc', display: true },
  tooltip: { enabled: true, backgroundColor: '#333' },
  legend: { display: true, position: 'bottom' },
};

describe('LineChart', () => {
  it('should render with 1 dataset without errors', () => {
    render(<LineChart data={singleDataset} theme={theme} />);
    expect(screen.getByTestId('line-canvas')).toBeInTheDocument();
  });

  it('should render with multiple datasets without errors', () => {
    render(<LineChart data={multiDatasets} theme={theme} />);
    const canvas = screen.getByTestId('line-canvas');
    const data = JSON.parse(canvas.getAttribute('data-data')!);
    expect(data.datasets).toHaveLength(3);
  });

  it('should wrap chart in div with width 100% and default height 300', () => {
    const { container } = render(<LineChart data={singleDataset} theme={theme} />);
    const wrapper = container.firstElementChild as HTMLDivElement;
    expect(wrapper.style.width).toBe('100%');
    expect(wrapper.style.height).toBe('300px');
  });

  it('should apply custom height', () => {
    const { container } = render(<LineChart data={singleDataset} theme={theme} height={500} />);
    const wrapper = container.firstElementChild as HTMLDivElement;
    expect(wrapper.style.height).toBe('500px');
  });

  it('should not set tension when smooth is false', () => {
    render(<LineChart data={singleDataset} theme={theme} />);
    const canvas = screen.getByTestId('line-canvas');
    const data = JSON.parse(canvas.getAttribute('data-data')!);
    expect(data.datasets[0].tension).toBeUndefined();
  });

  it('should set tension 0.4 on all datasets when smooth is true', () => {
    render(<LineChart data={multiDatasets} theme={theme} smooth />);
    const canvas = screen.getByTestId('line-canvas');
    const data = JSON.parse(canvas.getAttribute('data-data')!);
    for (const ds of data.datasets) {
      expect(ds.tension).toBe(0.4);
    }
  });

  it('should not set fill for line variant', () => {
    render(<LineChart data={singleDataset} theme={theme} />);
    const canvas = screen.getByTestId('line-canvas');
    const data = JSON.parse(canvas.getAttribute('data-data')!);
    expect(data.datasets[0].fill).toBeUndefined();
  });

  it('should reflect theme settings in options', () => {
    render(<LineChart data={singleDataset} theme={theme} />);
    const canvas = screen.getByTestId('line-canvas');
    const options = JSON.parse(canvas.getAttribute('data-options')!);
    expect(options.plugins.tooltip.enabled).toBe(true);
    expect(options.plugins.legend.position).toBe('bottom');
    expect(options.responsive).toBe(true);
  });
});
