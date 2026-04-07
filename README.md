# @ciscode/ui-chart-kit

Typed React chart components (Bar, Line, Area) built on Chart.js.  
Pass data and a theme — get a fully configured, responsive chart. No raw Chart.js options required.

## Installation

```bash
npm install @ciscode/ui-chart-kit
```

### Peer dependencies

| Package     | Version |
| ----------- | ------- |
| `react`     | ≥ 18    |
| `react-dom` | ≥ 18    |

`chart.js` and `react-chartjs-2` are bundled — you do **not** need to install them separately.

---

## Data types

### `ChartDataPoint`

```ts
interface ChartDataPoint {
  label: string;
  value: number;
}
```

### `ChartDataset`

```ts
interface ChartDataset {
  id: string;
  label: string;
  data: ChartDataPoint[];
  color?: string; // hex color — falls back to theme.colors when omitted
}
```

### `ChartTheme`

```ts
interface ChartTheme {
  colors: string[]; // palette shared across datasets
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
```

---

## Components

### BarChart

| Prop         | Type             | Default | Description                       |
| ------------ | ---------------- | ------- | --------------------------------- |
| `data`       | `ChartDataset[]` | —       | Datasets to render                |
| `theme`      | `ChartTheme`     | —       | Theme (colors, fonts, grid, etc.) |
| `height`     | `number`         | `300`   | Chart height in pixels            |
| `stacked`    | `boolean`        | `false` | Stack bars on top of each other   |
| `horizontal` | `boolean`        | `false` | Render horizontal bars            |

```tsx
import { BarChart } from '@ciscode/ui-chart-kit';
import type { ChartDataset, ChartTheme } from '@ciscode/ui-chart-kit';

const theme: ChartTheme = {
  colors: ['#4F46E5', '#10B981', '#F59E0B'],
  fontFamily: 'Inter, sans-serif',
  fontSize: 12,
  grid: { color: '#E5E7EB', display: true },
  tooltip: { enabled: true, backgroundColor: '#1F2937' },
  legend: { display: true, position: 'top' },
};

const datasets: ChartDataset[] = [
  {
    id: 'revenue',
    label: 'Revenue',
    data: [
      { label: 'Q1', value: 120 },
      { label: 'Q2', value: 180 },
      { label: 'Q3', value: 150 },
      { label: 'Q4', value: 210 },
    ],
  },
];

function App() {
  return <BarChart data={datasets} theme={theme} height={400} stacked />;
}
```

---

### LineChart

| Prop     | Type             | Default | Description                             |
| -------- | ---------------- | ------- | --------------------------------------- |
| `data`   | `ChartDataset[]` | —       | Datasets to render                      |
| `theme`  | `ChartTheme`     | —       | Theme (colors, fonts, grid, etc.)       |
| `height` | `number`         | `300`   | Chart height in pixels                  |
| `smooth` | `boolean`        | `false` | Curved line interpolation (0.4 tension) |

```tsx
import { LineChart } from '@ciscode/ui-chart-kit';

function App() {
  return <LineChart data={datasets} theme={theme} smooth />;
}
```

---

### AreaChart

| Prop      | Type             | Default | Description                             |
| --------- | ---------------- | ------- | --------------------------------------- |
| `data`    | `ChartDataset[]` | —       | Datasets to render                      |
| `theme`   | `ChartTheme`     | —       | Theme (colors, fonts, grid, etc.)       |
| `height`  | `number`         | `300`   | Chart height in pixels                  |
| `smooth`  | `boolean`        | `false` | Curved line interpolation (0.4 tension) |
| `stacked` | `boolean`        | `false` | Stack areas on top of each other        |

Area fill uses the dataset color at 20 % opacity automatically.

```tsx
import { AreaChart } from '@ciscode/ui-chart-kit';

function App() {
  return <AreaChart data={datasets} theme={theme} stacked smooth />;
}
```

---

## Design decisions

- **No Chart.js passthrough.** Components expose a curated props API only.
  Chart.js configuration is built internally via `buildChartConfig`.
  This keeps the public surface small and prevents breaking changes
  when Chart.js internals evolve.
- **Colors cycle.** When there are more datasets than `theme.colors` entries,
  colors wrap around automatically.
- **Responsive by default.** Every chart renders inside a `div` with
  `width: 100%` and the specified `height`.

## License

MIT
