import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lib-statistics',
  imports: [],
  templateUrl: './statistics.html',
  styleUrl: './statistics.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Statistics {}
