import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiAlertComponent } from './ui-alert';

describe('UiAlertComponent', () => {
  let fixture: ComponentFixture<UiAlertComponent>;
  let el: () => HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiAlertComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiAlertComponent);
    el = () => fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should have role="alert" on the host', () => {
    expect(el().getAttribute('role')).toBe('alert');
  });

  it('should apply success class for success type', () => {
    fixture.componentRef.setInput('type', 'success');
    fixture.detectChanges();
    expect(el().querySelector('.ui-alert--success')).not.toBeNull();
  });

  it('should apply error class for error type', () => {
    fixture.componentRef.setInput('type', 'error');
    fixture.detectChanges();
    expect(el().querySelector('.ui-alert--error')).not.toBeNull();
  });

  it('should not render dismiss button when dismissible is false', () => {
    expect(el().querySelector('.ui-alert-dismiss')).toBeNull();
  });

  it('should render dismiss button when dismissible is true', () => {
    fixture.componentRef.setInput('dismissible', true);
    fixture.detectChanges();
    expect(el().querySelector('.ui-alert-dismiss')).not.toBeNull();
  });

  it('should emit dismissed event when dismiss button is clicked', () => {
    fixture.componentRef.setInput('dismissible', true);
    fixture.detectChanges();

    let emitted = false;
    fixture.componentInstance.dismissed.subscribe(() => {
      emitted = true;
    });

    el().querySelector<HTMLButtonElement>('.ui-alert-dismiss')!.click();
    expect(emitted).toBe(true);
  });
});
