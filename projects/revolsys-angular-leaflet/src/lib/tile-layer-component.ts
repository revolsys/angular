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
    options['maxNativeZoom'] = this.maxNativeZoom;
    options['tileSize'] = this.tileSize;
    options['subdomains'] = this.subdomains;
    options['errorTileUrl'] = this.errorTileUrl;
    options['attribution'] = this.attribution;
    options['tms'] = this.tms;
    options['continuousWorld'] = this.continuousWorld;
    options['noWrap'] = this.noWrap;
    options['zoomOffset'] = this.zoomOffset;
    options['zoomReverse'] = this.zoomReverse;
    options['opacity'] = this.opacity;
    options['zIndex'] = this.zIndex;
    options['unloadInvisibleTiles'] = this.unloadInvisibleTiles;
    options['updateWhenIdle'] = this.updateWhenIdle;
    options['detectRetina'] = this.detectRetina;
    options['reuseTiles'] = this.reuseTiles;
    options['bounds'] = this.bounds;
    return options;
  }
}
