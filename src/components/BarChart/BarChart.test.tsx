import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import type { ChartDataset, ChartTheme } from '../../types/chart.types';

// Mock react-chartjs-2 to avoid canvas dependency in jsdom
vi.mock('react-chartjs-2', () => ({
  Bar: (props: { data: unknown; options: unknown }) => (
    <canvas
      data-testid="bar-canvas"
      data-options={JSON.stringify(props.options)}
      data-data={JSON.stringify(props.data)}
    />
  ),
}));

// Mock chart.js register to avoid side-effects
vi.mock('chart.js', () => ({
  Chart: { register: vi.fn() },
  CategoryScale: 'CategoryScale',
  LinearScale: 'LinearScale',
  BarElement: 'BarElement',
  Tooltip: 'Tooltip',
  Legend: 'Legend',
}));

import { BarChart } from './BarChart';

const sampleData: ChartDataset[] = [
  {
    id: 'ds1',
    label: 'Sales',
    data: [
      { label: 'Jan', value: 10 },
      { label: 'Feb', value: 20 },
    ],
  },
];

const threeDatasets: ChartDataset[] = [
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

describe('BarChart', () => {
  it('should render with 1 dataset without errors', () => {
    render(<BarChart data={sampleData} theme={theme} />);
    expect(screen.getByTestId('bar-canvas')).toBeInTheDocument();
  });

  it('should render with 3 datasets without errors', () => {
    render(<BarChart data={threeDatasets} theme={theme} />);
    const canvas = screen.getByTestId('bar-canvas');
    const data = JSON.parse(canvas.getAttribute('data-data')!);
    expect(data.datasets).toHaveLength(3);
  });

  it('should wrap chart in div with width 100% and default height 300', () => {
    const { container } = render(<BarChart data={sampleData} theme={theme} />);
    const wrapper = container.firstElementChild as HTMLDivElement;
    expect(wrapper.style.width).toBe('100%');
    expect(wrapper.style.height).toBe('300px');
  });

  it('should apply custom height', () => {
    const { container } = render(<BarChart data={sampleData} theme={theme} height={500} />);
    const wrapper = container.firstElementChild as HTMLDivElement;
    expect(wrapper.style.height).toBe('500px');
  });

  it('should set stacked on both axes when stacked prop is true', () => {
    render(<BarChart data={sampleData} theme={theme} stacked />);
    const canvas = screen.getByTestId('bar-canvas');
    const options = JSON.parse(canvas.getAttribute('data-options')!);
    expect(options.scales.x.stacked).toBe(true);
    expect(options.scales.y.stacked).toBe(true);
  });

  it('should not set stacked when stacked prop is false', () => {
    render(<BarChart data={sampleData} theme={theme} />);
    const canvas = screen.getByTestId('bar-canvas');
    const options = JSON.parse(canvas.getAttribute('data-options')!);
    expect(options.scales.x.stacked).toBeUndefined();
    expect(options.scales.y.stacked).toBeUndefined();
  });

  it('should set indexAxis to y when horizontal is true', () => {
    render(<BarChart data={sampleData} theme={theme} horizontal />);
    const canvas = screen.getByTestId('bar-canvas');
    const options = JSON.parse(canvas.getAttribute('data-options')!);
    expect(options.indexAxis).toBe('y');
  });

  it('should not set indexAxis when horizontal is false', () => {
    render(<BarChart data={sampleData} theme={theme} />);
    const canvas = screen.getByTestId('bar-canvas');
    const options = JSON.parse(canvas.getAttribute('data-options')!);
    expect(options.indexAxis).toBeUndefined();
  });

  it('should pass animation enabled by default (no explicit disable)', () => {
    render(<BarChart data={sampleData} theme={theme} />);
    const canvas = screen.getByTestId('bar-canvas');
    const options = JSON.parse(canvas.getAttribute('data-options')!);
    expect(options.animation).toBeUndefined();
  });

  it('should reflect theme tooltip and legend settings in options', () => {
    render(<BarChart data={sampleData} theme={theme} />);
    const canvas = screen.getByTestId('bar-canvas');
    const options = JSON.parse(canvas.getAttribute('data-options')!);
    expect(options.plugins.tooltip.enabled).toBe(true);
    expect(options.plugins.tooltip.backgroundColor).toBe('#333');
    expect(options.plugins.legend.display).toBe(true);
    expect(options.plugins.legend.position).toBe('bottom');
  });

  it('should support stacked and horizontal together', () => {
    render(<BarChart data={sampleData} theme={theme} stacked horizontal />);
    const canvas = screen.getByTestId('bar-canvas');
    const options = JSON.parse(canvas.getAttribute('data-options')!);
    expect(options.scales.x.stacked).toBe(true);
    expect(options.scales.y.stacked).toBe(true);
    expect(options.indexAxis).toBe('y');
  });
});
