import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lib-invoices',
  imports: [],
  templateUrl: './invoices.html',
  styleUrl: './invoices.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Invoices {}
