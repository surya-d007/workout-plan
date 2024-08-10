import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { WorkoutListComponent } from './workout-list.component';
import { By } from '@angular/platform-browser';

describe('WorkoutListComponent', () => {
  let component: WorkoutListComponent;
  let fixture: ComponentFixture<WorkoutListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkoutListComponent, FormsModule], // Import FormsModule
    }).compileComponents();

    fixture = TestBed.createComponent(WorkoutListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default state', () => {
    expect(component.workoutList).toEqual([]);
    expect(component.paginatedWorkoutList).toEqual([]);
    expect(component.currentPage).toBe(1);
    expect(component.itemsPerPage).toBe(5);
    expect(component.totalPages).toBe(0);
    expect(component.searchQuery).toBe('');
    expect(component.selectedWorkoutType).toBe('');
    expect(component.workoutTypes).toEqual([]);
    expect(component.maxRows).toBe(5);
    expect(component.recordsPerPageOptions).toEqual([5, 10, 15, 20]);
    expect(component.emptyRowsCount).toBe(0);
  });

  it('should initialize default workouts if none are in localStorage', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    spyOn(localStorage, 'setItem');
    component.initializeDefaultWorkouts();
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'workouts',
      JSON.stringify([
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
      ])
    );
  });

  it('should update workout list and types', () => {
    const testWorkouts = [
      {
        name: 'John Doe',
        workouts: [{ workoutType: 'Running', workoutMinutes: 30 }],
      },
    ];
    spyOn(localStorage, 'getItem').and.returnValue(
      JSON.stringify(testWorkouts)
    );
    component.updateWorkoutList();
    expect(component.workoutList).toEqual(testWorkouts);
    expect(component.workoutTypes).toContain('Running');
  });

  it('should filter and paginate workout list', () => {
    component.workoutList = [
      {
        name: 'John Doe',
        workouts: [{ workoutType: 'Running', workoutMinutes: 30 }],
      },
      {
        name: 'Jane Smith',
        workouts: [{ workoutType: 'Yoga', workoutMinutes: 60 }],
      },
    ];
    component.itemsPerPage = 1;
    component.searchQuery = 'John';
    component.selectedWorkoutType = 'Running';
    component.filterAndPaginate();
    expect(component.paginatedWorkoutList.length).toBe(1);
    expect(component.paginatedWorkoutList[0].name).toBe('John Doe');
    expect(component.totalPages).toBe(2);
  });

  it('should handle search and filter changes', () => {
    spyOn(component, 'filterAndPaginate');
    component.searchQuery = 'Yoga';
    component.onSearchChange();
    expect(component.filterAndPaginate).toHaveBeenCalled();
  });

  it('should correctly get workout types', () => {
    const workouts = [
      { workoutType: 'Running', workoutMinutes: 30 },
      { workoutType: 'Cycling', workoutMinutes: 45 },
    ];
    expect(component.getWorkoutTypes(workouts)).toBe('Running, Cycling');
  });

  it('should correctly get total workout minutes', () => {
    const workouts = [
      { workoutType: 'Running', workoutMinutes: 30 },
      { workoutType: 'Cycling', workoutMinutes: 45 },
    ];
    expect(component.getTotalWorkoutMinutes(workouts)).toBe(75);
  });

  it('should paginate correctly', () => {
    component.workoutList = [
      {
        name: 'John Doe',
        workouts: [{ workoutType: 'Running', workoutMinutes: 30 }],
      },
      {
        name: 'Jane Smith',
        workouts: [{ workoutType: 'Yoga', workoutMinutes: 60 }],
      },
    ];
    component.paginate(1);
    expect(component.paginatedWorkoutList.length).toBe(1);
    expect(component.paginatedWorkoutList[0].name).toBe('John Doe');
  });

  it('should navigate to the previous page', () => {
    component.currentPage = 2;
    component.paginate = jasmine.createSpy('paginate');
    component.previousPage();
    expect(component.paginate).toHaveBeenCalledWith(1);
  });

  it('should navigate to the next page', () => {
    component.currentPage = 1;
    component.totalPages = 2;
    component.paginate = jasmine.createSpy('paginate');
    component.nextPage();
    expect(component.paginate).toHaveBeenCalledWith(2);
  });

  it('should change records per page', () => {
    component.onRecordsPerPageChange(10);
    expect(component.itemsPerPage).toBe(10);
  });

  it('should get height for the list', () => {
    component.itemsPerPage = 5;
    expect(component.getHeight()).toBe('325px'); // Assuming 65px per row
  });

  it('should navigate to the last page', () => {
    spyOn(component, 'updatePagination');
    spyOn(component.navigateToLastPageEvent, 'emit');
    component.totalPages = 3;
    component.navigateToLastPage();
    expect(component.currentPage).toBe(3);
    expect(component.updatePagination).toHaveBeenCalled();
    expect(component.navigateToLastPageEvent.emit).toHaveBeenCalled();
  });

  it('should refresh the list', () => {
    spyOn(component, 'updateWorkoutList');
    component.refreshList();
    expect(component.updateWorkoutList).toHaveBeenCalled();
  });

  it('should update pagination', () => {
    spyOn(component, 'paginate');
    component.updatePagination();
    expect(component.paginate).toHaveBeenCalledWith(1);
  });

  // Test view logic
  it('should display workout list and handle pagination controls', () => {
    component.workoutList = [
      {
        name: 'John Doe',
        workouts: [{ workoutType: 'Running', workoutMinutes: 30 }],
      },
      {
        name: 'Jane Smith',
        workouts: [{ workoutType: 'Yoga', workoutMinutes: 60 }],
      },
    ];
    fixture.detectChanges();
    const nameElements = fixture.debugElement.queryAll(
      By.css('.grid-cols-3 .py-2:first-child')
    );
    expect(nameElements.length).toBe(2);
    expect(nameElements[0].nativeElement.textContent).toContain('John Doe');
    expect(nameElements[1].nativeElement.textContent).toContain('Jane Smith');
  });
});
