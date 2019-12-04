import React, { Component } from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import PropTypes from 'prop-types';

class MapLeaflet extends Component {

  render() {
    const position = [this.props.lat, this.props.lng];
    const locations = this.props.locations;
    return (
        <Map center={position} zoom={this.props.zoom} style={{ height: 500 }}>
          <TileLayer
              attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
              url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
          />
          locations.map( location =>
          <Marker position={[location[1], location[2]]}>
            <Popup>
              {location[0]}
            </Popup>
          </Marker>);
        </Map>);

  }
}

MapLeaflet.propTypes = {
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired,
  // elements in the array: [name, lat, lng]
  locations: PropTypes.array,
  zoom: PropTypes.number.isRequired,
};

export default MapLeaflet;
