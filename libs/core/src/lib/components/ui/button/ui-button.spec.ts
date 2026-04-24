import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiButtonComponent } from './ui-button';

describe('UiButtonComponent', () => {
  let fixture: ComponentFixture<UiButtonComponent>;
  let button: () => HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiButtonComponent);
    button = () => fixture.nativeElement.querySelector('button');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render a button with default type "button"', () => {
    expect(button().type).toBe('button');
  });

  it('should apply btn--primary class for primary variant', () => {
    fixture.componentRef.setInput('variant', 'primary');
    fixture.detectChanges();
    expect(button().classList).toContain('btn--primary');
  });

  it('should apply btn--danger class for danger variant', () => {
    fixture.componentRef.setInput('variant', 'danger');
    fixture.detectChanges();
    expect(button().classList).toContain('btn--danger');
  });

  it('should disable the button when disabled input is true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    expect(button().disabled).toBe(true);
  });

  it('should disable the button when loading input is true', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    expect(button().disabled).toBe(true);
  });

  it('should apply btn--sm class for sm size', () => {
    fixture.componentRef.setInput('size', 'sm');
    fixture.detectChanges();
    expect(button().classList).toContain('btn--sm');
  });
});
