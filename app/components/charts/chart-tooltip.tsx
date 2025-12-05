/**
 * Chart Tooltip Component
 * Reusable tooltip configuration for recharts to reduce duplication
 */

/**
 * Standard tooltip content style for all charts
 * Uses theme-aware colors for consistent appearance
 */
export const CHART_TOOLTIP_STYLE = {
	backgroundColor: 'hsl(var(--heroui-content1))',
	border: '1px solid hsl(var(--heroui-divider))',
	borderRadius: '8px',
} as const;

/**
 * Standard CartesianGrid configuration for charts
 * Uses theme-aware colors for consistent appearance
 */
export const CHART_GRID_STYLE = {
	strokeDasharray: '3 3',
	stroke: 'hsl(var(--heroui-default-200))',
} as const;

/**
 * Standard axis style configuration
 */
export const CHART_AXIS_STYLE = {
	stroke: 'hsl(var(--heroui-default-500))',
} as const;
