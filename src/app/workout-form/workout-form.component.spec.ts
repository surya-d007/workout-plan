import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { WorkoutFormComponent } from './workout-form.component';
import { By } from '@angular/platform-browser';

describe('WorkoutFormComponent', () => {
  let component: WorkoutFormComponent;
  let fixture: ComponentFixture<WorkoutFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule], // Import FormsModule for ngModel
      declarations: [WorkoutFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkoutFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate name field', () => {
    component.workoutData.name = 'Test123';
    component.validateName();
    expect(component.showErrors.name).toBeTrue();

    component.workoutData.name = 'TestName';
    component.validateName();
    expect(component.showErrors.name).toBeFalse();
  });

  it('should validate workout type field', () => {
    component.workoutData.workouts[0].workoutType = '';
    component.validateWorkoutType();
    expect(component.showErrors.workoutType).toBeTrue();

    component.workoutData.workouts[0].workoutType = 'Cardio';
    component.validateWorkoutType();
    expect(component.showErrors.workoutType).toBeFalse();
  });

  it('should enforce max length for workout minutes field', () => {
    const inputEl = fixture.debugElement.query(
      By.css('#workoutMinutes')
    ).nativeElement;
    inputEl.value = '12345';
    inputEl.dispatchEvent(new Event('input'));

    component.enforceMaxLength({ target: inputEl });
    fixture.detectChanges();

    expect(inputEl.value).toBe('1234');
  });

  it('should validate workout minutes field', () => {
    component.workoutData.workouts[0].workoutMinutes = -5;
    component.validateWorkoutMinutes();
    expect(component.showErrors.workoutMinutes).toBeTrue();

    component.workoutData.workouts[0].workoutMinutes = 30;
    component.validateWorkoutMinutes();
    expect(component.showErrors.workoutMinutes).toBeFalse();
  });

  it('should submit form and show success message', () => {
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify([]));
    spyOn(localStorage, 'setItem');

    component.workoutData.name = 'Test Workout';
    component.workoutData.workouts[0].workoutType = 'Cardio';
    component.workoutData.workouts[0].workoutMinutes = 30;

    component.onSubmit();

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'workouts',
      jasmine.any(String)
    );
    expect(component.showSuccessMessage).toBeTrue();
  });

  it('should hide success message after 6 seconds', (done) => {
    component.showSuccessMessage = true;
    fixture.detectChanges();

    setTimeout(() => {
      fixture.detectChanges();
      expect(component.showSuccessMessage).toBeFalse();
      done();
    }, 6000);
  });
});
