import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import React from 'react';
import type { ChartDataset, ChartTheme } from '../types/chart.types';

export const singleDataset: ChartDataset[] = [
  {
    id: 'ds1',
    label: 'Sales',
    data: [
      { label: 'Jan', value: 10 },
      { label: 'Feb', value: 20 },
    ],
  },
];

export const multiDatasets: ChartDataset[] = [
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

export const defaultTheme: ChartTheme = {
  colors: ['#FF0000', '#00FF00', '#0000FF'],
  fontFamily: 'Arial',
  fontSize: 14,
  grid: { color: '#ccc', display: true },
  tooltip: { enabled: true, backgroundColor: '#333' },
  legend: { display: true, position: 'bottom' },
};

export function getCanvasData(testId: string) {
  const canvas = screen.getByTestId(testId);
  return {
    canvas,
    data: JSON.parse(canvas.getAttribute('data-data')!),
    options: JSON.parse(canvas.getAttribute('data-options')!),
  };
}

export function describeCommonChartBehavior(
  ChartComponent: React.ComponentType<{ data: ChartDataset[]; theme: ChartTheme; height?: number }>,
  canvasTestId: string,
) {
  it('should render with 1 dataset without errors', () => {
    render(React.createElement(ChartComponent, { data: singleDataset, theme: defaultTheme }));
    expect(screen.getByTestId(canvasTestId)).toBeInTheDocument();
  });

  it('should render with multiple datasets without errors', () => {
    render(React.createElement(ChartComponent, { data: multiDatasets, theme: defaultTheme }));
    const { data } = getCanvasData(canvasTestId);
    expect(data.datasets).toHaveLength(3);
  });

  it('should wrap chart in div with width 100% and default height 300', () => {
    const { container } = render(
      React.createElement(ChartComponent, { data: singleDataset, theme: defaultTheme }),
    );
    const wrapper = container.firstElementChild as HTMLDivElement;
    expect(wrapper.style.width).toBe('100%');
    expect(wrapper.style.height).toBe('300px');
  });

  it('should apply custom height', () => {
    const { container } = render(
      React.createElement(ChartComponent, {
        data: singleDataset,
        theme: defaultTheme,
        height: 500,
      }),
    );
    const wrapper = container.firstElementChild as HTMLDivElement;
    expect(wrapper.style.height).toBe('500px');
  });

  it('should reflect theme settings in options', () => {
    render(React.createElement(ChartComponent, { data: singleDataset, theme: defaultTheme }));
    const { options } = getCanvasData(canvasTestId);
    expect(options.plugins.tooltip.enabled).toBe(true);
    expect(options.plugins.legend.position).toBe('bottom');
    expect(options.responsive).toBe(true);
  });

  it('should handle empty data array without crash', () => {
    render(React.createElement(ChartComponent, { data: [], theme: defaultTheme }));
    const { data } = getCanvasData(canvasTestId);
    expect(data.labels).toEqual([]);
    expect(data.datasets).toEqual([]);
  });
}
