import React from 'react';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { connectField } from 'uniforms';

function MapInput({ onChange, value }) {
  return (
      <div>
        <Map center={[21.2989, -157.817]} zoom={17} style={{ height: 300 }} scrollWheelZoom={false}>
          <TileLayer
              attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
              url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
          />
          <Marker position={'lat' in value ? value : [21.2989, -157.817]} draggable={true}
                  onDragend={event => onChange(event.target._latlng)}>
          </Marker>)
        </Map>
      </div>
  );
}

export default connectField(MapInput);
