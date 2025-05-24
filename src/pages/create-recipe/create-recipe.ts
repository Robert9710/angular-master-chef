import { Component } from '@angular/core';
import { CreateRecipeForm } from '../../components/create-recipe-form/create-recipe-form';

@Component({
  imports: [CreateRecipeForm],
  templateUrl: './create-recipe.html',
})
export class CreateRecipe {}
