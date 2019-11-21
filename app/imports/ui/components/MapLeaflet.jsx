import React, { Component } from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet-universal';

class MapLeaflet extends Component {
  constructor() {
    super();
    this.state = {
      lat: 38.895345,
      lng: -77.030101,
      zoom: 15,
    };
  }

  render() {
    const position = [this.state.lat, this.state.lng];
    return (
        <Map center={position} zoom={this.state.zoom} style={{ height: 500 }}>
          <TileLayer
              attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
              url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
          />
          <Marker position={position}>
            <Popup>
              <span>A pretty CSS3 popup. <br /> Easily customizable.</span>
            </Popup>
          </Marker>
        </Map>
    );
  }
}

export default MapLeaflet;
