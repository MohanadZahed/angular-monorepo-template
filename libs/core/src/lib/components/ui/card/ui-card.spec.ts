import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { UiCardComponent } from './ui-card';

@Component({
  imports: [UiCardComponent],
  template: `<ui-card [title]="title" [subtitle]="subtitle"
    ><p>Content</p></ui-card
  >`,
})
class TestHost {
  title: string | undefined;
  subtitle: string | undefined;
}

describe('UiCardComponent', () => {
  let fixture: ComponentFixture<TestHost>;
  let el: () => HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    el = () => fixture.nativeElement;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render projected content', () => {
    fixture.detectChanges();
    expect(el().querySelector('p')?.textContent).toBe('Content');
  });

  it('should not render header when no title is provided', () => {
    fixture.detectChanges();
    expect(el().querySelector('.ui-card-header')).toBeNull();
  });

  it('should render title when provided', () => {
    fixture.componentInstance.title = 'My Card';
    fixture.detectChanges();
    expect(el().querySelector('.ui-card-title')?.textContent).toBe('My Card');
  });

  it('should render subtitle when both title and subtitle are provided', () => {
    fixture.componentInstance.title = 'Title';
    fixture.componentInstance.subtitle = 'Sub';
    fixture.detectChanges();
    expect(el().querySelector('.ui-card-subtitle')?.textContent).toBe('Sub');
  });
});
