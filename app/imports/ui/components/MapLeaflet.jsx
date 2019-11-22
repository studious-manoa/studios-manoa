import React, { Component } from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import PropTypes from 'prop-types';

class MapLeaflet extends Component {

  render() {
    const position = [this.props.lat, this.props.lng];
    return (
        <Map center={position} zoom={this.props.zoom} style={{ height: 500 }}>
          <TileLayer
              attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
              url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
          />
          <Marker position={position}>
            <Popup>
              {this.props.popupText}
            </Popup>
          </Marker>
        </Map>
    );
  }
}

MapLeaflet.propTypes = {
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired,
  zoom: PropTypes.number.isRequired,
  popupText: PropTypes.string,
};

export default MapLeaflet;
