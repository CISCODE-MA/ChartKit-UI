import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import type { ChartDataset, ChartTheme } from '../../types/chart.types';

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

describe('AreaChart', () => {
  it('should render with 1 dataset without errors', () => {
    render(<AreaChart data={singleDataset} theme={theme} />);
    expect(screen.getByTestId('area-canvas')).toBeInTheDocument();
  });

  it('should render with multiple datasets without errors', () => {
    render(<AreaChart data={multiDatasets} theme={theme} />);
    const canvas = screen.getByTestId('area-canvas');
    const data = JSON.parse(canvas.getAttribute('data-data')!);
    expect(data.datasets).toHaveLength(3);
  });

  it('should set fill true on all datasets (area variant)', () => {
    render(<AreaChart data={multiDatasets} theme={theme} />);
    const canvas = screen.getByTestId('area-canvas');
    const data = JSON.parse(canvas.getAttribute('data-data')!);
    for (const ds of data.datasets) {
      expect(ds.fill).toBe(true);
    }
  });

  it('should apply 20% opacity (append 33) to backgroundColor', () => {
    render(<AreaChart data={singleDataset} theme={theme} />);
    const canvas = screen.getByTestId('area-canvas');
    const data = JSON.parse(canvas.getAttribute('data-data')!);
    expect(data.datasets[0].backgroundColor).toBe('#FF000033');
  });

  it('should use dataset color with 20% opacity when color is provided', () => {
    render(<AreaChart data={multiDatasets} theme={theme} />);
    const canvas = screen.getByTestId('area-canvas');
    const data = JSON.parse(canvas.getAttribute('data-data')!);
    expect(data.datasets[1].backgroundColor).toBe('#00FF0033');
  });

  it('should wrap chart in div with width 100% and default height 300', () => {
    const { container } = render(<AreaChart data={singleDataset} theme={theme} />);
    const wrapper = container.firstElementChild as HTMLDivElement;
    expect(wrapper.style.width).toBe('100%');
    expect(wrapper.style.height).toBe('300px');
  });

  it('should apply custom height', () => {
    const { container } = render(<AreaChart data={singleDataset} theme={theme} height={450} />);
    const wrapper = container.firstElementChild as HTMLDivElement;
    expect(wrapper.style.height).toBe('450px');
  });

  it('should set tension 0.4 on all datasets when smooth is true', () => {
    render(<AreaChart data={multiDatasets} theme={theme} smooth />);
    const canvas = screen.getByTestId('area-canvas');
    const data = JSON.parse(canvas.getAttribute('data-data')!);
    for (const ds of data.datasets) {
      expect(ds.tension).toBe(0.4);
    }
  });

  it('should not set tension when smooth is false', () => {
    render(<AreaChart data={singleDataset} theme={theme} />);
    const canvas = screen.getByTestId('area-canvas');
    const data = JSON.parse(canvas.getAttribute('data-data')!);
    expect(data.datasets[0].tension).toBeUndefined();
  });

  it('should set scales.y.stacked true when stacked is true', () => {
    render(<AreaChart data={singleDataset} theme={theme} stacked />);
    const canvas = screen.getByTestId('area-canvas');
    const options = JSON.parse(canvas.getAttribute('data-options')!);
    expect(options.scales.y.stacked).toBe(true);
  });

  it('should not set stacked when stacked prop is false', () => {
    render(<AreaChart data={singleDataset} theme={theme} />);
    const canvas = screen.getByTestId('area-canvas');
    const options = JSON.parse(canvas.getAttribute('data-options')!);
    expect(options.scales.y.stacked).toBeUndefined();
  });

  it('should support stacked and smooth together', () => {
    render(<AreaChart data={multiDatasets} theme={theme} stacked smooth />);
    const canvas = screen.getByTestId('area-canvas');
    const options = JSON.parse(canvas.getAttribute('data-options')!);
    const data = JSON.parse(canvas.getAttribute('data-data')!);
    expect(options.scales.y.stacked).toBe(true);
    for (const ds of data.datasets) {
      expect(ds.tension).toBe(0.4);
      expect(ds.fill).toBe(true);
    }
  });

  it('should reflect theme settings in options', () => {
    render(<AreaChart data={singleDataset} theme={theme} />);
    const canvas = screen.getByTestId('area-canvas');
    const options = JSON.parse(canvas.getAttribute('data-options')!);
    expect(options.plugins.tooltip.enabled).toBe(true);
    expect(options.plugins.legend.position).toBe('bottom');
    expect(options.responsive).toBe(true);
  });
});
