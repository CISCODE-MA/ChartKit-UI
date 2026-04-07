import type {
  ChartConfig,
  ChartConfigDataset,
  ChartDataset,
  ChartTheme,
  ChartVariant,
} from '../types/chart.types';

function resolveColor(dataset: ChartDataset, index: number, theme: ChartTheme): string {
  return dataset.color ?? theme.colors[index % theme.colors.length];
}

function applyAreaOpacity(hex: string): string {
  return `${hex}33`;
}

function buildDataset(
  dataset: ChartDataset,
  index: number,
  theme: ChartTheme,
  variant: ChartVariant,
): ChartConfigDataset {
  const color = resolveColor(dataset, index, theme);

  const base: ChartConfigDataset = {
    label: dataset.label,
    data: dataset.data.map((point) => point.value),
    backgroundColor: variant === 'area' ? applyAreaOpacity(color) : color,
    borderColor: color,
  };

  if (variant === 'area') {
    base.fill = true;
  }

  return base;
}

export function buildChartConfig(
  datasets: ChartDataset[],
  theme: ChartTheme,
  variant: ChartVariant,
): ChartConfig {
  const labels = datasets.length > 0 ? datasets[0].data.map((point) => point.label) : [];

  const tickFont: Record<string, unknown> = {};
  if (theme.fontFamily) tickFont.family = theme.fontFamily;
  if (theme.fontSize) tickFont.size = theme.fontSize;

  return {
    type: variant === 'area' ? 'line' : variant,
    data: {
      labels,
      datasets: datasets.map((ds, i) => buildDataset(ds, i, theme, variant)),
    },
    options: {
      responsive: true,
      plugins: {
        tooltip: {
          enabled: theme.tooltip?.enabled ?? true,
          backgroundColor: theme.tooltip?.backgroundColor,
          titleColor: theme.tooltip?.titleColor,
          bodyColor: theme.tooltip?.bodyColor,
        },
        legend: {
          display: theme.legend?.display ?? true,
          position: theme.legend?.position ?? 'top',
        },
      },
      scales: {
        x: {
          grid: {
            display: theme.grid?.display ?? true,
            color: theme.grid?.color,
          },
          ticks: { font: tickFont },
        },
        y: {
          grid: {
            display: theme.grid?.display ?? true,
            color: theme.grid?.color,
          },
          ticks: { font: tickFont },
        },
      },
    },
  };
}
