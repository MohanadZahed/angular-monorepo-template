import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lib-not-found',
  imports: [],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFound {}
