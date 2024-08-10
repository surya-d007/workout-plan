import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Define interfaces for the data structure
interface WorkoutDetail {
  workoutType: string;
  workoutMinutes: number;
}

interface Workout {
  name: string;
  workouts: WorkoutDetail[];
}

@Component({
  selector: 'app-workout-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './workout-list.component.html',
  styleUrls: ['./workout-list.component.css'],
})
export class WorkoutListComponent implements OnInit {
  workoutList: Workout[] = [];
  paginatedWorkoutList: Workout[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 0;
  searchQuery: string = '';
  selectedWorkoutType: string = '';
  workoutTypes: string[] = []; // List of workout types for dropdown
  maxRows: number = 5;
  recordsPerPageOptions: number[] = [5, 10, 15, 20];
  emptyRowsCount: number = 0;

  @Output() navigateToLastPageEvent = new EventEmitter<void>();

  ngOnInit() {
    this.resetToDefaultState();
  }

  resetToDefaultState() {
    this.workoutList = [];
    this.paginatedWorkoutList = [];
    this.currentPage = 1;
    this.itemsPerPage = 5;
    this.totalPages = 0;
    this.searchQuery = '';
    this.selectedWorkoutType = '';
    this.maxRows = 5;
    this.recordsPerPageOptions = [5, 10, 15, 20];
    this.emptyRowsCount = 0;
    // Initialize default workouts and update workout list
    this.initializeDefaultWorkouts();
    this.updateWorkoutList();
  }

  initializeDefaultWorkouts() {
    const storedWorkouts = localStorage.getItem('workouts');
    if (!storedWorkouts) {
      const defaultWorkouts: Workout[] = [
        {
          name: 'John Doe',
          workouts: [
            { workoutType: 'Running', workoutMinutes: 30 },
            { workoutType: 'Cycling', workoutMinutes: 45 },
          ],
        },
        {
          name: 'Jane Smith',
          workouts: [
            { workoutType: 'Yoga', workoutMinutes: 60 },
            { workoutType: 'Swimming', workoutMinutes: 40 },
          ],
        },
        {
          name: 'Surya',
          workouts: [
            { workoutType: 'Cardio', workoutMinutes: 100 },
            { workoutType: 'Cycling', workoutMinutes: 400 },
          ],
        },
      ];
      localStorage.setItem('workouts', JSON.stringify(defaultWorkouts));
    }
  }

  updateWorkoutList() {
    const storedWorkouts = localStorage.getItem('workouts');
    if (storedWorkouts) {
      this.workoutList = JSON.parse(storedWorkouts) as Workout[];
      this.updateWorkoutTypes(); // Update workout types for dropdown
      this.filterAndPaginate(); // Apply filtering and pagination
    }
    console.log('Updated workout list:', this.workoutList);
  }

  updateWorkoutTypes() {
    const types = new Set<string>();
    this.workoutList.forEach((workout) =>
      workout.workouts.forEach((w: WorkoutDetail) => types.add(w.workoutType))
    );
    this.workoutTypes = Array.from(types);
  }

  filterAndPaginate() {
    const filteredWorkouts = this.workoutList.filter(
      (workout) =>
        workout.name.toLowerCase().includes(this.searchQuery.toLowerCase()) &&
        (this.selectedWorkoutType === '' ||
          this.getWorkoutTypes(workout.workouts)
            .toLowerCase()
            .includes(this.selectedWorkoutType.toLowerCase()))
    );

    this.totalPages = Math.ceil(filteredWorkouts.length / this.itemsPerPage);

    // Adjust current page if it's out of range due to page size change
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1; // Ensure we don't set to zero
    }

    this.paginate(this.currentPage, filteredWorkouts);

    // Debug logs
    console.log('Filtered workouts:', filteredWorkouts);
    console.log('Total pages:', this.totalPages);
    console.log('Current page:', this.currentPage);
    console.log('Paginated workout list:', this.paginatedWorkoutList);
  }

  onSearchChange() {
    this.currentPage = 1;
    this.filterAndPaginate();
    console.log('Search query:', this.searchQuery);
    console.log('Selected workout type:', this.selectedWorkoutType);
  }

  getWorkoutTypes(workouts: WorkoutDetail[]): string {
    return workouts.map((w) => w.workoutType).join(', ');
  }

  getTotalWorkoutMinutes(workouts: WorkoutDetail[]): number {
    return workouts.reduce((total, w) => total + w.workoutMinutes, 0);
  }

  paginate(page: number, list: any[] = this.workoutList) {
    this.currentPage = page;

    // Ensure start and itemsPerPage are numbers
    const itemsPerPage = Number(this.itemsPerPage);
    const start = Number((this.currentPage - 1) * itemsPerPage);
    const end = start + itemsPerPage;

    // Ensure end index does not exceed the length of the list
    const actualEnd = Math.min(end, list.length);

    // Slice the list from start to actualEnd
    this.paginatedWorkoutList = list.slice(start, actualEnd);
    this.emptyRowsCount = Math.max(
      0,
      itemsPerPage - this.paginatedWorkoutList.length
    );

    // Debug logs
    console.log('Paginate function - Page:', page);
    console.log('Start index:', start);
    console.log('End index:', end);
    console.log('Actual end index:', actualEnd);
    console.log('Paginated workout list:', this.paginatedWorkoutList);
    console.log('Empty rows count:', this.emptyRowsCount);
  }
  previousPage() {
    if (this.currentPage > 1) {
      this.paginate(this.currentPage - 1);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.paginate(this.currentPage + 1);
    }
  }

  onRecordsPerPageChange(newItemsPerPage: number) {
    this.itemsPerPage = newItemsPerPage;
    this.filterAndPaginate();
  }

  getHeight(): string {
    const maxHeight = this.itemsPerPage * 65; // Approximate row height in pixels
    return `${maxHeight}px`;
  }

  navigateToLastPage() {
    this.currentPage = this.totalPages;
    this.updatePagination();
    this.navigateToLastPageEvent.emit();
    console.log('Navigated to last page:', this.currentPage);
  }

  refreshList() {
    this.updateWorkoutList();
  }

  updatePagination() {
    this.paginate(this.currentPage);
  }
}
