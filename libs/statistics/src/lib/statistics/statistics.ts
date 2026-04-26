import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
} from '@angular/core';
import { UiAlertComponent } from '@angular-monorepo-template/core';
import { StatisticsService } from './statistics.service';

interface ChartBar {
  date: string;
  total: number;
  height: number;
  x: number;
  width: number;
}

const CHART_HEIGHT = 160;
const CHART_PADDING = 24;
const BAR_GAP = 8;
const DATE_LABEL = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
});

@Component({
  selector: 'lib-statistics',
  imports: [UiAlertComponent],
  templateUrl: './statistics.html',
  styleUrl: './statistics.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Statistics implements OnInit {
  private service = inject(StatisticsService);

  readonly loading = this.service.loading;
  readonly error = this.service.error;
  readonly totalOrders = this.service.totalOrders;
  readonly totalRevenueDisplay = this.service.totalRevenueDisplay;
  readonly avgOrderValueDisplay = this.service.avgOrderValueDisplay;
  readonly statusBreakdown = this.service.statusBreakdown;

  readonly chartHeight = CHART_HEIGHT;
  readonly chartViewBox = computed(() => {
    const w = this.chartWidth();
    return `0 0 ${w} ${CHART_HEIGHT + 28}`;
  });

  readonly chartWidth = computed(() => {
    const bars = this.service.dailyTotals().length;
    if (bars === 0) return 320;
    return Math.max(320, bars * 56 + CHART_PADDING * 2);
  });

  readonly maxDaily = computed(() =>
    this.service.dailyTotals().reduce((m, d) => Math.max(m, d.total), 0),
  );

  readonly bars = computed<ChartBar[]>(() => {
    const data = this.service.dailyTotals();
    if (data.length === 0) return [];
    const max = this.maxDaily() || 1;
    const usableWidth = this.chartWidth() - CHART_PADDING * 2;
    const barWidth = (usableWidth - BAR_GAP * (data.length - 1)) / data.length;
    return data.map((d, i) => {
      const ratio = d.total / max;
      const height = Math.max(2, Math.round(ratio * (CHART_HEIGHT - 20)));
      return {
        date: d.date,
        total: d.total,
        height,
        width: barWidth,
        x: CHART_PADDING + i * (barWidth + BAR_GAP),
      };
    });
  });

  readonly chartSummary = computed(() => {
    const data = this.service.dailyTotals();
    if (data.length === 0) return 'No order history available.';
    const top = data.reduce((a, b) => (a.total > b.total ? a : b));
    return `${data.length} days of order revenue, peak ${this.formatLabel(top.date)} at $${top.total.toFixed(0)}.`;
  });

  ngOnInit(): void {
    this.service.load().subscribe();
  }

  formatLabel(date: string): string {
    return DATE_LABEL.format(new Date(date));
  }

  barY(bar: ChartBar): number {
    return CHART_HEIGHT - bar.height;
  }
}
