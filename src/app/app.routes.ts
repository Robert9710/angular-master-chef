import { Routes } from '@angular/router';
import { CreateRecipe } from '../pages/create-recipe/create-recipe';
import { Home } from '../pages/home/home';
// import { Recipes } from '../pages/recipes/recipes';
// import { ViewRecipe } from '../pages/view-recipe/view-recipe';
// import { Bookmarks } from '../pages/bookmarks/bookmarks';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'create', component: CreateRecipe },
  // { path: 'menu/course/:courseId', component: Recipes },
  // {
  //   path: 'menu/course/:courseId/recipe/:recipeId',
  //   component: ViewRecipe,
  //   title: 'ViewRecipe',
  // },
  // {
  //   path: 'bookmarks',
  //   component: Bookmarks,
  // },
];
