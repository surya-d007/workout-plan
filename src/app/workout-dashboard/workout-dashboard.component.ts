import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-workout-dashboard',
  templateUrl: './workout-dashboard.component.html',
  styleUrls: ['./workout-dashboard.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class WorkoutDashboardComponent implements OnInit, AfterViewInit {
  userList: any[] = [];
  selectedUser: any = null;
  private chart: Chart | null = null;

  ngOnInit() {
    this.loadUsers();
  }

  ngAfterViewInit() {
    if (this.selectedUser) {
      this.renderChart(this.selectedUser.workouts);
    }
  }

  loadUsers() {
    const workouts = JSON.parse(localStorage.getItem('workouts') || '[]');
    this.userList = workouts;

    if (this.userList.length > 0) {
      this.selectedUser = this.userList[0];
      setTimeout(() => this.renderChart(this.selectedUser.workouts), 0);
    }
  }

  selectUser(user: any) {
    this.selectedUser = user;
    this.renderChart(user.workouts);
  }

  refreshDashboard() {
    this.loadUsers();
    if (this.selectedUser) {
      this.renderChart(this.selectedUser.workouts);
    }
  }

  renderChart(workouts: any[]) {
    const workoutTypes = workouts.map((w: any) => w.workoutType);
    const workoutMinutes = workouts.map((w: any) => w.workoutMinutes);

    if (this.chart) {
      this.chart.destroy();
    }

    const ctx = (
      document.getElementById('workoutChart') as HTMLCanvasElement
    ).getContext('2d');

    if (ctx) {
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: workoutTypes,
          datasets: [
            {
              label: 'Minutes per Workout',
              data: workoutMinutes,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            x: {
              beginAtZero: true,
            },
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
  }
}
