import { Component, ViewChild } from '@angular/core';
import { WorkoutFormComponent } from './workout-form/workout-form.component';
import { WorkoutListComponent } from './workout-list/workout-list.component';
import { WorkoutDashboardComponent } from './workout-dashboard/workout-dashboard.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    WorkoutFormComponent,
    WorkoutListComponent,
    WorkoutDashboardComponent,
  ],
})
export class AppComponent {
  title = 'workout-tracker';

  @ViewChild(WorkoutListComponent) workoutListComponent!: WorkoutListComponent;
  @ViewChild(WorkoutDashboardComponent)
  workoutDashboardComponent!: WorkoutDashboardComponent;

  onWorkoutAdded() {
    this.workoutListComponent.refreshList();
    this.workoutDashboardComponent.refreshDashboard();
    if (this.workoutListComponent) {
      this.workoutListComponent.navigateToLastPage();
    }
    console.log('Navigated to last page.');
  }

  navigateToLastPage() {
    if (this.workoutListComponent) {
      this.workoutListComponent.navigateToLastPage();
    }
    console.log('Navigated to last page.');
  }
}
