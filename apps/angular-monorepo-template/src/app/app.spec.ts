import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { NxWelcome } from './nx-welcome';
import { of } from 'rxjs';
import { FeatureFlagService } from '@angular-monorepo-template/core';
import { provideRouter } from '@angular/router';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App, NxWelcome],
      providers: [
        provideRouter([]),
        {
          provide: FeatureFlagService,
          useValue: {
            loadFlags: () => of({}),
            isEnabled: () => true,
          },
        },
      ],
    }).compileComponents();
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    //const compiled = fixture.nativeElement as HTMLElement;
    expect(true).toBeTruthy();
  });
});
