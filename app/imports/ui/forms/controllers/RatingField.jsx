import React from 'react';
import { Rating } from 'semantic-ui-react';
import { connectField } from 'uniforms';

function RatingInput({ onChange, value }) {
  console.log(value);
  return (
      <Rating size='large' maxRating={5} rating={value} onRate={(event, data) => onChange(data.rating)}/>
  );
}

export default connectField(RatingInput);
