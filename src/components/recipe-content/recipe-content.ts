import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AppState } from '../../app/app.state';
import { Store } from '@ngrx/store';
import { selectUsername } from '../../store/user.selector';
import { getApiDomain } from '../../app/helper';

interface Recipe {
  id: string;
  name: string;
  instructions: any[];
}

@Component({
  selector: 'recipe-content',
  imports: [],
  templateUrl: './recipe-content.html',
  styleUrl: './recipe-content.css',
})
export class RecipeContent {
  http = inject(HttpClient);
  private readonly route = inject(ActivatedRoute);
  courseId: string | null = this.route.snapshot.paramMap.get('courseId');
  recipeId: string | null = this.route.snapshot.paramMap.get('recipeId');
  username: Observable<string>;
  apiDomain = getApiDomain();
  recipe: any = null;

  constructor(private store: Store<AppState>) {
    this.username = this.store.select(selectUsername);
  }

  ngOnInit() {
    this.http
      .get(`${this.apiDomain}/menu/${this.courseId}/${this.recipeId}`)
      .subscribe((response) => {
        this.recipe = response;
      });
  }
}
