import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AppServicesService } from '../../app/app-services.service';
import { HttpClient } from '@angular/common/http';

interface Recipe {
  courseId: string | null;
  recipeName: string | null;
  instructions: Instructions | null;
}

interface Step {
  action: string;
  ingredients: Ingredient[] | [];
  postAction: string;
}

interface Ingredient {
  name: string;
  quantity: string;
}

interface Instructions {
  notes: string | null;
  steps: Step[] | null;
}

@Component({
  imports: [ReactiveFormsModule],
  selector: 'create-recipe-form',
  templateUrl: './create-recipe-form.html',
  styleUrl: './create-recipe-form.css',
})
export class CreateRecipeForm {
  course = new FormControl('');
  recipeName = new FormControl('');
  notes = new FormControl('');
  action = new FormControl('');
  ingredients = new FormControl('');
  additionalInfo = new FormControl('');
  newRecipe: Recipe = {
    courseId: null,
    recipeName: null,
    instructions: null,
  };
  data = inject(AppServicesService);
  courses = this.data.coursesRx;
  coursesData = this.data.coursesRx;
  http = inject(HttpClient);

  async ngOnInit(): Promise<void> {}

  addToRecipe() {
    if (!(this.newRecipe.courseId && this.newRecipe.recipeName)) {
      this.newRecipe['courseId'] = this.course.value;
      this.newRecipe['recipeName'] = this.recipeName.value;
    } else if (!this.newRecipe['instructions']) {
      if (
        this.notes.value !== null &&
        this.action.value !== null &&
        this.ingredients.value !== null &&
        this.additionalInfo.value !== null
      ) {
        const ingredientsList = this.ingredients.value.split('\n');
        let instructions: Instructions = {
          notes: this.notes.value,
          steps: [
            {
              action: this.action.value,
              ingredients: !this.ingredients.value
                ? []
                : ingredientsList.map((ingredientItem) => {
                    const ingredientDetails = ingredientItem.split('-');
                    return {
                      name: ingredientDetails[0]?.trim() || '',
                      quantity: ingredientDetails[1]?.trim() || '',
                    };
                  }),
              postAction: this.additionalInfo.value,
            },
          ],
        };
        this.newRecipe['instructions'] = instructions;
      }
      this.notes.setValue('');
      this.action.setValue('');
      this.ingredients.setValue('');
      this.additionalInfo.setValue('');
    } else {
      if (
        this.action.value !== null &&
        this.ingredients.value !== null &&
        this.additionalInfo.value !== null
      ) {
        const ingredientsList = this.ingredients.value.split('\n');
        const step: Step = {
          action: this.action.value,
          ingredients: !this.ingredients.value
            ? []
            : ingredientsList.map((ingredientItem) => {
                const ingredientDetails = ingredientItem.split('-');
                return {
                  name: ingredientDetails[0]?.trim() || '',
                  quantity: ingredientDetails[1]?.trim() || '',
                };
              }),
          postAction: this.additionalInfo.value,
        };
        this.newRecipe['instructions']['steps']?.push(step);
      }
      this.action.setValue('');
      this.ingredients.setValue('');
      this.additionalInfo.setValue('');
    }
  }

  createRecipe() {
    if (
      this.action.value ||
      this.ingredients.value ||
      this.additionalInfo.value
    ) {
      this.addToRecipe();
    }
    this.http
      .post('http://localhost:3000/menu/add/recipe', this.newRecipe)
      .subscribe((response) => {});
    this.course.setValue('');
    this.recipeName.setValue('');
    this.newRecipe = {
      courseId: null,
      recipeName: null,
      instructions: null,
    };
  }
}
