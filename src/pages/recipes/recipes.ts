import { Component } from '@angular/core';
import { RecipeList } from '../../components/recipe-list/recipe-list';

@Component({
  imports: [RecipeList],
  templateUrl: './recipes.html',
  styleUrl: 'recipes.css',
})
export class Recipes {}
