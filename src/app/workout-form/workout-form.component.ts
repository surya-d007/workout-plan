import {
  AfterViewInit,
  Component,
  EventEmitter,
  Output,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { WorkoutListComponent } from '../workout-list/workout-list.component';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-workout-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './workout-form.component.html',
  styleUrls: ['./workout-form.component.css'],
})
export class WorkoutFormComponent implements AfterViewInit, OnDestroy {
  workoutData = {
    name: '',
    workouts: [
      {
        workoutType: '',
        workoutMinutes: 0,
      },
    ],
  };

  showErrors = {
    name: false,
    workoutType: false,
    workoutMinutes: false,
  };

  showSuccessMessage = false;
  private successMessageSubscription: Subscription | undefined;

  @Output() workoutAdded = new EventEmitter<void>();
  @ViewChild(WorkoutListComponent) paginationComponent!: WorkoutListComponent;

  ngAfterViewInit() {
    // Ensure the pagination component is available after view initialization
    console.log(
      'Pagination Component after view init:',
      this.paginationComponent
    );
  }

  ngOnDestroy() {
    // Clean up subscription if it exists
    if (this.successMessageSubscription) {
      this.successMessageSubscription.unsubscribe();
    }
  }

  validateName() {
    const namePattern = /^[A-Za-z\s.]+$/;

    this.showErrors.name = !namePattern.test(this.workoutData.name);
  }

  validateWorkoutType() {
    this.showErrors.workoutType = !this.workoutData.workouts[0].workoutType;
  }
  enforceMaxLength(event: any) {
    const maxLength = 4;
    if (event.target.value.length > maxLength) {
      event.target.value = event.target.value.slice(0, maxLength);
    }
  }

  validateWorkoutMinutes() {
    this.showErrors.workoutMinutes =
      this.workoutData.workouts[0].workoutMinutes <= 0;
  }

  onSubmit() {
    this.validateName();
    this.validateWorkoutType();
    this.validateWorkoutMinutes();

    if (
      this.showErrors.name ||
      this.showErrors.workoutType ||
      this.showErrors.workoutMinutes
    ) {
      return;
    }

    let workouts = JSON.parse(localStorage.getItem('workouts') || '[]');

    const existingWorkoutIndex = workouts.findIndex(
      (workout: any) => workout.name === this.workoutData.name
    );

    if (existingWorkoutIndex !== -1) {
      workouts[existingWorkoutIndex].workouts.push({
        workoutType: this.workoutData.workouts[0].workoutType,
        workoutMinutes: this.workoutData.workouts[0].workoutMinutes,
      });
    } else {
      workouts.push({
        name: this.workoutData.name,
        workouts: [...this.workoutData.workouts],
      });
    }

    localStorage.setItem('workouts', JSON.stringify(workouts));

    this.workoutData = {
      name: '',
      workouts: [
        {
          workoutType: '',
          workoutMinutes: 0,
        },
      ],
    };

    this.showSuccessMessage = true;

    // Hide success message after 4 seconds
    this.successMessageSubscription = timer(6000).subscribe(() => {
      this.showSuccessMessage = false;

      // Navigate to the last page in the workout list
      if (this.paginationComponent) {
        this.paginationComponent.navigateToLastPage();
      } else {
        console.error('Pagination Component is not available!');
      }
    });

    this.workoutAdded.emit();
  }
}
