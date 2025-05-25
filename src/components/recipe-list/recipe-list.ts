import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../../app/app.state';
import { selectUsername } from '../../store/user.selector';
import { getApiDomain } from '../../app/helper';
import { AsyncPipe } from '@angular/common';

interface Bookmark {
  recipeId: string;
}

@Component({
  selector: 'recipe-list',
  imports: [RouterLink, AsyncPipe],
  templateUrl: './recipe-list.html',
  styleUrl: './recipe-list.css',
})
export class RecipeList {
  http = inject(HttpClient);
  private readonly route = inject(ActivatedRoute);
  courseId: string | null = this.route.snapshot.paramMap.get('courseId');
  username: Observable<string>;
  apiDomain = getApiDomain();
  bookmarks: any = [];
  recipes: any = [];

  constructor(private store: Store<AppState>) {
    this.username = this.store.select(selectUsername);
  }

  ngOnInit() {
    this.route.params.subscribe((routeParams) => {
      this.http
        .get(`${this.apiDomain}/menu/${routeParams['courseId']}`)
        .subscribe((response) => {
          this.recipes = response;
        });
    });
    this.username.subscribe((value) => {
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

  bookmarkRecipe(recipeId: string) {
    this.username.subscribe((value) => {
      this.http
        .post(`${this.apiDomain}/menu/recipe/${recipeId}/bookmark`, {
          userName: value,
        })
        .subscribe((response) => {
          this.http
            .get(`${this.apiDomain}/user/${value}/bookmarks`)
            .subscribe((response) => {
              this.bookmarks = response;
            });
        });
    });
  }

  checkIfRecipeIsBookmarked(recipeId: string) {
    return !this.bookmarks.items?.find(
      (bookmark: Bookmark) => bookmark.recipeId === recipeId
    );
  }
}
