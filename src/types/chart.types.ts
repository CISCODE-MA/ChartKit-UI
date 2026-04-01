export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface ChartDataset {
  id: string;
  label: string;
  data: ChartDataPoint[];
  color?: string;
}

export interface ChartTheme {
  colors: string[];
  fontFamily?: string;
  fontSize?: number;
  grid?: {
    color?: string;
    display?: boolean;
  };
  tooltip?: {
    enabled?: boolean;
    backgroundColor?: string;
    titleColor?: string;
    bodyColor?: string;
  };
  legend?: {
    display?: boolean;
    position?: 'top' | 'bottom' | 'left' | 'right';
  };
}

export type ChartVariant = 'bar' | 'line' | 'area';

export interface ChartConfig {
  type: 'bar' | 'line';
  data: {
    labels: string[];
    datasets: ChartConfigDataset[];
  };
  options: {
    responsive: boolean;
    indexAxis?: 'x' | 'y';
    plugins: {
      tooltip: ChartTheme['tooltip'] & Record<string, unknown>;
      legend: ChartTheme['legend'] & Record<string, unknown>;
    };
    scales: {
      x: {
        grid: ChartTheme['grid'] & Record<string, unknown>;
        ticks: Record<string, unknown>;
        stacked?: boolean;
      };
      y: {
        grid: ChartTheme['grid'] & Record<string, unknown>;
        ticks: Record<string, unknown>;
        stacked?: boolean;
      };
    };
  };
}

export interface ChartConfigDataset {
  label: string;
  data: number[];
  backgroundColor: string | string[];
  borderColor: string;
  fill?: boolean;
}
