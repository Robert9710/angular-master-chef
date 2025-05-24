import { HttpClient } from '@angular/common/http';
import { Component, inject, Input } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../../app/appState';
import { selectUser } from '../../store/user.selector';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, AsyncPipe],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  // @Input() newUserName: any;
  http = inject(HttpClient);
  private readonly route = inject(ActivatedRoute);
  userName: Observable<string>;
  // userName$: Observable<string>;
  courses: any = null;

  constructor(private store: Store<AppState>) {
    this.userName = this.store.select(selectUser);
  }

  ngOnInit() {
    this.http
      .get('http://localhost:3000/menu/courses')
      .subscribe((response) => {
        this.courses = response;
      });
    // console.log(this.route.snapshot.routeConfig?.title);
  }
}
