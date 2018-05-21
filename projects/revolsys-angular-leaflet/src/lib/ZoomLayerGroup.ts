import {
  Layer,
  LayerGroup,
  Util
} from 'leaflet';

export let ZoomLayerGroup = Layer.extend({
  options: {
    minZoom: 0,
    maxZoom: Infinity
  },

  initialize: function(layers, options) {
    Util.setOptions(this, options);
    this._layers = new LayerGroup(layers);
  },

  onAdd: function(map) {
    if (this._isVisible(map)) {
      map.addLayer(this._layers);
    }
  },

  onRemove: function(map) {
    map.removeLayer(this._layers);
  },

  getEvents: function() {
    const events = {
      zoom: this._onZoom
    };
    return events;
  },

  _isVisible: function(map) {
    const zoom = map.getZoom();
    if (this.options.minZoom <= zoom && zoom <= this.options.maxZoom) {
      return true;
    } else {
      return false;
    }
  },

  _onZoom: function() {
    const map = this._map;
    if (map) {
      if (this._isVisible(map)) {
        map.addLayer(this._layers);
      } else {
        map.removeLayer(this._layers);
      }
    }
  },
});
