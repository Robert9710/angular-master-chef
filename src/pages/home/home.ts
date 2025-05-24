import { Component } from '@angular/core';
import { CourseList } from '../../components/course-list/course-list';

@Component({
  imports: [CourseList],
  templateUrl: './home.html',
})
export class Home {}
