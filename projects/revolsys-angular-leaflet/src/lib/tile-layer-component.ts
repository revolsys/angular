import {
  Component,
  Input
} from '@angular/core';
import {
  ILayer,
  LTileLayer
} from 'leaflet';
import {LayerComponent} from './layer.component';
import {MapService} from './map.service';

@Component({
  selector: 'leaflet-tile-layer',
  template: ''
})
export class TileLayerComponent extends LayerComponent {

  @Input() url: string;

  @Input() maxNativeZoom: number = null;

  @Input() tileSize = 256;

  @Input() subdomains = 'abc';

  @Input() errorTileUrl = '';

  @Input() attribution = '';

  @Input() tms = false;

  @Input() continuousWorld = false;

  @Input() noWrap = false;

  @Input() zoomOffset = 0;

  @Input() zoomReverse = false;

  @Input() opacity = 1;

  @Input() zIndex: number = null;

  @Input() unloadInvisibleTiles: boolean;

  @Input() updateWhenIdle: boolean;

  @Input() detectRetina = false;

  @Input() reuseTiles = false;

  @Input() bounds: any = null;

  constructor(mapService: MapService
  ) {
    super(mapService);
    if (this.basemapLayer === undefined) {
      this.basemapLayer = true;
    }
  }

  newLayer(): ILayer {
    return new LTileLayer(
      this.url,
      this.getOptions()
    );
  }

  protected getOptions(): any {
    const options = super.getOptions();
    if (this.maxNativeZoom != null) {
      options['maxNativeZoom'] = this.maxNativeZoom;
    }
    if (this.tileSize !== 256) {
      options['tileSize'] = this.tileSize;
    }
    if (this.subdomains !== 'abc') {
      options['subdomains'] = this.subdomains;
    }
    if (this.errorTileUrl !== '') {
      options['errorTileUrl'] = this.errorTileUrl;
    }
    if (this.attribution !== '') {
      options['attribution'] = this.attribution;
    }
    if (this.tms) {
      options['tms'] = this.tms;
    }
    if (this.continuousWorld) {
      options['continuousWorld'] = this.continuousWorld;
    }
    if (this.noWrap) {
      options['noWrap'] = this.noWrap;
    }
    if (this.zoomOffset !== 0) {
      options['zoomOffset'] = this.zoomOffset;
    }
    if (this.zoomReverse) {
      options['zoomReverse'] = this.zoomReverse;
    }
    if (this.opacity !== 1) {
      options['opacity'] = this.opacity;
    }
    if (this.zIndex !== null) {
      options['zIndex'] = this.zIndex;
    }
    if (this.unloadInvisibleTiles) {
      options['unloadInvisibleTiles'] = this.unloadInvisibleTiles;
    }
    if (this.updateWhenIdle) {
      options['updateWhenIdle'] = this.updateWhenIdle;
    }
    if (this.detectRetina) {
      options['detectRetina'] = this.detectRetina;
    }
    if (this.reuseTiles) {
      options['reuseTiles'] = this.reuseTiles;
    }
    if (this.bounds !== null) {
      options['bounds'] = this.bounds;
    }
    return options;
  }
}
