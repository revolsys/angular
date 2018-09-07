import {
  Component,
  Input
} from '@angular/core';
import {
  FormGroup,
  FormBuilder
} from '@angular/forms';
import {MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';

import {Observable} from 'rxjs';
import * as L from 'leaflet';
import {MapService} from './map.service';
import {SearchResult} from './SearchResult';

@Component({
  selector: 'leaflet-search-zoom',
  template: `
  <mat-form-field floatLabel="always" [formGroup]="form">
    <input matInput [placeholder]="label" [matAutocomplete]="searchAuto" formControlName="searchValue">
    <mat-autocomplete #searchAuto="matAutocomplete" (optionSelected)="optionSelected($event)">
      <mat-option *ngFor="let result of results" [value]="result.name">
        {{result.label}}
      </mat-option>
    </mat-autocomplete>
    <button mat-button matSuffix mat-icon-button title="Zoom to {{label}}" (click)="zoomToResult($event)" [disabled]="searchInvalid">
      <mat-icon>search</mat-icon>
    </button>
  </mat-form-field>
  `,
  styles: ['']
})
export class SearchZoomComponent {
  @Input()
  label: string;

  public dataSource: Observable<any>;

  form: FormGroup;

  private loading = false;

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
              this.results = results;
              this.loading = false;
              if (this.searchResult) {
                for (const result of results) {
                  if (result.id == this.searchResult.id) {
                    return;
                  }
                }
              }
              this.searchResult = null;
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
    return !this.searchResult;
  }

  zoomToResult(event: any) {
    event.stopPropagation();
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
