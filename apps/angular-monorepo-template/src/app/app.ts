import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppHeader } from '@angular-monorepo-template/core';

@Component({
  imports: [RouterModule, AppHeader],
  selector: 'ng-mf-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
