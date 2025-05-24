import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../../app/appState';
import { selectUser } from '../../store/user.selector';
import { setUserName } from '../../store/user.actions';

@Component({
  selector: 'course-list',
  imports: [ReactiveFormsModule],
  templateUrl: './course-list.html',
  styleUrl: 'course-list.css',
})
export class CourseList {
  http = inject(HttpClient);
  courses: any = [];
  userName$: Observable<string>;
  userName = new FormControl('');
  showUserNameInput = !sessionStorage.getItem('userName');

  constructor(private store: Store<AppState>) {
    this.userName$ = this.store.select(selectUser);
  }

  ngOnInit() {
    this.http
      .get('https://angular-master-chef.onrender.com' + '/menu/courses')
      .subscribe((response) => {
        this.courses = response;
      });
  }

  setUserName(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.userName.value) {
      this.store.dispatch(setUserName({ userName: this.userName.value }));
      sessionStorage.setItem('userName', this.userName.value);
      this.showUserNameInput = false;
    }
  }
}
