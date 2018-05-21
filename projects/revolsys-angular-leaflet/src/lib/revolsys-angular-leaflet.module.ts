
import {Injector, NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

import {
  MatAutocompleteModule,
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule
} from '@angular/material';

import {EsriFeatureLayerComponent} from './esri-feature-layer.component';
import {EsriTiledLayerComponent} from './esri-tiled-layer.component';
import {GeoJsonLayerComponent} from './geo-json-layer.component';
import {LayerComponent} from './layer.component';
import {MapComponent} from './map.component';
import {MapService} from './map.service';
import {SearchZoomComponent} from './search-zoom.component';
import {TileLayerComponent} from './tile-layer-component';
import {WmsLayerComponent} from './wms-layer.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  declarations: [
    EsriFeatureLayerComponent,
    EsriTiledLayerComponent,
    GeoJsonLayerComponent,
    LayerComponent,
    MapComponent,
    SearchZoomComponent,
    TileLayerComponent,
    WmsLayerComponent
  ],
  providers: [
    MapService,
  ],
  exports: [
    EsriFeatureLayerComponent,
    EsriTiledLayerComponent,
    GeoJsonLayerComponent,
    LayerComponent,
    MapComponent,
    SearchZoomComponent,
    TileLayerComponent,
    WmsLayerComponent
  ]
})
export class RevolsysAngularLeafletModule {
}
