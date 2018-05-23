import {
  Component,
  ElementRef,
  Input,
  ViewChild
} from '@angular/core';
import {
  FormGroup,
  FormBuilder
} from '@angular/forms';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';

import {Observable} from 'rxjs';
import * as L from 'leaflet';
import {MapService} from './map.service';
import {SearchResult} from './SearchResult';

@Component({
  selector: 'leaflet-search-zoom',
  template: `
  <mat-form-field floatLabel="never" [formGroup]="form">
    <input matInput [placeholder]="label" [matAutocomplete]="searchAuto" formControlName="searchValue">
    <mat-autocomplete #searchAuto="matAutocomplete" (optionSelected)="optionSelected($event)">
      <mat-option *ngFor="let result of results" [value]="result.name">
        {{result.label}}
      </mat-option>
    </mat-autocomplete>
  </mat-form-field>
  <button mat-raised-button (click)="zoomToResult()" title="Zoom to {{label}}" [disabled]="searchInvalid"><i class="fa fa-search"></i></button>
  `,
  styles: ['']
})
export class SearchZoomComponent {
  @Input()
  label: string;

  public dataSource: Observable<any>;

  form: FormGroup;

  public query: string;

  private loading = false;

  private noResults = true;

  private searchResult: SearchResult;

  searchIndex = 0;

  results = [];

  searchFunction: (string) => Observable<SearchResult[]>;

  public constructor(
    private mapService: MapService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      searchValue: ''
    });
    this.form.controls['searchValue'].valueChanges.subscribe(searchValue => {
      const searchIndex = ++this.searchIndex;
      if (searchValue) {
        if (this.searchFunction) {
          this.loading = true;
          this.searchFunction(searchValue).subscribe(results => {
            if (searchIndex === this.searchIndex) {
              this.searchResult = null;
              this.results = results;
              this.loading = false;
            }
          });
        }
      } else {
        this.searchResult = null;
        this.results = [];
        this.loading = false;
      }
    });
  }

  optionSelected(event: MatAutocompleteSelectedEvent) {
    const option = event.option;
    for (const result of this.results) {
      if (result.label == option.getLabel()) {
        this.searchResult = result;
        return;
      }
    }
  }


  get searchInvalid(): boolean {
    return this.loading || !this.query || !this.searchResult;
  }

  zoomToResult() {
    this.mapService.withMap(map => {
      if (this.searchResult.bounds) {
        map.fitBounds(this.searchResult.bounds.pad(0.1));
      } else {
        const lat = this.searchResult.point.lat;
        const lon = this.searchResult.point.lon;
        map.setView([lat, lon], 13);
      }
    });
  }
}
