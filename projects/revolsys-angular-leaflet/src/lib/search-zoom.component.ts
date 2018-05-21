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

import {Observable} from 'rxjs';
import * as L from 'leaflet';
import {MapService} from './map.service';
import {SearchResult} from './SearchResult';

@Component({
  selector: 'leaflet-search-zoom',
  template: `
  <mat-form-field floatLabel="never" [formGroup]="form">
    <input matInput [placeholder]="label" [matAutocomplete]="searchAuto" formControlName="searchValue" required>
    <mat-autocomplete #searchAuto="matAutocomplete">
      <mat-option *ngFor="let result of results" [value]="result.label">
        {{result.label}}
      </mat-option>
    </mat-autocomplete>
  </mat-form-field>
    <span class="input-group-btn">
      <button type="button" (click)="zoomToResult()" class="btn btn-primary" title="Zoom to {{label}}" [disabled]="searchInvalid">
        <i class="glyphicon glyphicon-search"></i>
      </button>
    </span>
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

  results = [];

  searchFunction: (string) => Promise<SearchResult[]>;

  public constructor(
    private mapService: MapService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      searchValue: ''
    });
    this.dataSource = Observable.create((observer: any) => {
      observer.next(this.query);
    }).mergeMap((token: string) => {
      if (this.searchFunction) {
        return this.searchFunction(token);
      }
    });
  }

  public setLoading(loading: boolean): void {
    this.loading = loading;
  }

  public setNoResults(noResults: boolean): void {
    this.noResults = noResults;
  }

  public setSearchResult(searchResult: SearchResult) {
    this.searchResult = searchResult;
  }

  get searchInvalid(): boolean {
    return this.loading || this.noResults || !this.query || !this.searchResult;
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
