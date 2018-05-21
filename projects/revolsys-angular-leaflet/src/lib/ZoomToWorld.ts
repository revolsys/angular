import * as L from 'leaflet';

export let ZoomToWorld = L.Control.Zoom.extend({
  options: {
    bounds: L.latLngBounds()
  },

  initialize: function(options) {
    L.Util.setOptions(this, options);
  },

  onAdd: function(map) {
    const container = L.Control.Zoom.prototype.onAdd.call(this, map);

    this._zoomToWorldButton = this._createButton('<span class="glyphicon glyphicon-globe"></span>',
      'Zoom To World', 'leaflet-control-zoom-to-world', container, this._zoomToWorld);
    L.DomUtil.toBack(this._zoomToWorldButton);
    if (this.options.bounds) {
      map.fitBounds(this.options.bounds);
    }
    return container;
  },

  _zoomToWorld: function(e) {
    if (!this._disabled ) {
      let bounds = this.options.bounds;
      if (bounds && bounds.isValid()) {
        this._map.fitBounds(bounds);
      } else {
        this._map.fitWorld();
      }
    }
  },
});
