import { Component } from '@angular/core';
import {MusicCategory} from "../../../../core/models/track.model";
import {KeyValuePipe, NgForOf, TitleCasePipe} from "@angular/common";
import {Observable} from "rxjs";
import {selectSelectedCategory} from "../../../store/track.selectors";
import {Store} from "@ngrx/store";
import * as TrackActions from "../../../store/track.actions";

@Component({
  selector: 'app-library-categories',
  standalone: true,
  imports: [
    NgForOf,
    TitleCasePipe,
    KeyValuePipe
  ],
  templateUrl: './library-categories.component.html',
  styleUrl: './library-categories.component.scss'
})
export class LibraryCategoriesComponent {
  musicCategory = MusicCategory;
  selectedCategory$: Observable<MusicCategory | null>;

  constructor(private readonly store: Store) {
    this.selectedCategory$ = this.store.select(selectSelectedCategory);
  }

  filterByCategory(category: MusicCategory | null): void {
    this.store.dispatch(TrackActions.setSelectedCategory({ category }));
  }

  isSelectedCategory(category: MusicCategory): boolean {
    let isSelected = false;
    this.selectedCategory$.subscribe(selected => {
      isSelected = selected === category;
    });
    return isSelected;
  }
}
