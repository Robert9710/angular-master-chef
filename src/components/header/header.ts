import { HttpClient } from '@angular/common/http';
import { Component, inject, Input } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../../app/app.state';
import { selectUsername } from '../../store/user.selector';
import { AsyncPipe } from '@angular/common';
import { getApiDomain } from '../../app/helper';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, AsyncPipe],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  http = inject(HttpClient);
  private readonly route = inject(ActivatedRoute);
  username: Observable<string>;
  apiDomain = getApiDomain();
  courses: any = null;

  constructor(private store: Store<AppState>) {
    this.username = this.store.select(selectUsername);
  }

  async ngOnInit() {
    this.http.get(this.apiDomain + '/menu/courses').subscribe((response) => {
      this.courses = response;
    });
    // console.log(this.route.snapshot.routeConfig?.title);
  }
}
