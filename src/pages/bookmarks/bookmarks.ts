import { Component } from '@angular/core';
import { BookmarksList } from '../../components/bookmarks-list/bookmarks-list';

@Component({
  imports: [BookmarksList],
  templateUrl: './bookmarks.html',
})
export class Bookmarks {}
