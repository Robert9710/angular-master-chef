import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../app/app.state';
import { selectUsername } from '../../store/user.selector';
import { Observable } from 'rxjs';
import { getApiDomain } from '../../app/helper';

@Component({
  selector: 'bookmarks-list',
  imports: [RouterLink],
  templateUrl: './bookmarks-list.html',
  styleUrl: './bookmarks-list.css',
})
export class BookmarksList {
  http = inject(HttpClient);
  username: Observable<string>;
  apiDomain = getApiDomain();
  bookmarks: any = [];

  constructor(private store: Store<AppState>) {
    this.username = this.store.select(selectUsername);
  }

  ngOnInit() {
    console.log('Bookmarks');
    this.username.subscribe((value: string) => {
      if (value) {
        this.http
          .get(`${this.apiDomain}/user/${value}/bookmarks`)
          .subscribe((response) => {
            this.bookmarks = response;
          });
      } else {
      }
    });
  }

  removeBookmark(bookmarkId: string) {
    this.username.subscribe((value: string) => {
      this.http
        .delete(`${this.apiDomain}/user/${value}/bookmark/${bookmarkId}`)
        .subscribe((response) => {
          this.bookmarks = response;
        });
    });
  }
}
