import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../../app/app.state';
import { selectUsername } from '../../store/user.selector';
import { setUserName } from '../../store/user.actions';
import { getApiDomain } from '../../app/helper';

@Component({
  selector: 'course-list',
  imports: [ReactiveFormsModule],
  templateUrl: './course-list.html',
  styleUrl: 'course-list.css',
})
export class CourseList {
  http = inject(HttpClient);
  courses: any = [];
  username: Observable<string>;
  apiDomain = getApiDomain();
  newUsername = new FormControl('');
  showUserNameInput = !sessionStorage.getItem('userName');

  constructor(private store: Store<AppState>) {
    this.username = this.store.select(selectUsername);
  }

  ngOnInit() {
    this.http.get(this.apiDomain + '/menu/courses').subscribe((response) => {
      this.courses = response;
    });
  }

  setUserName(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.newUsername.value) {
      this.store.dispatch(setUserName({ userName: this.newUsername.value }));
      sessionStorage.setItem('userName', this.newUsername.value);
      this.showUserNameInput = false;
    }
  }
}
