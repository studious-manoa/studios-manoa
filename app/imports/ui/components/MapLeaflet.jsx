import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Image, Header } from 'semantic-ui-react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';

class MapLeaflet extends Component {

  render() {
    const position = [this.props.lat, this.props.lng];
    return (
        <Map center={position} zoom={this.props.zoom} style={{ height: 500 }} scrollWheelZoom={false}>
          <TileLayer
              attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
              url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
          />
          {_.map(this.props.locations, location => <Marker position={[location[1], location[2]]}>
            <Popup>
              <Link to={`/${location[0]}`}>
                <div>
                  <Header as='h3'>{location[0]}</Header>
                  <Image src={location[3]} width={192}/>
                  <div>{location[4]}</div>
                </div>
              </Link>
            </Popup>
          </Marker>)}
        </Map>);
  }
}

MapLeaflet.propTypes = {
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired,
  // elements in the array: [name, lat, lng, img url, description]
  locations: PropTypes.array.isRequired,
  zoom: PropTypes.number.isRequired,
};

export default MapLeaflet;
