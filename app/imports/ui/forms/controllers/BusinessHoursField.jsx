import React from 'react';
import { Grid, Dropdown } from 'semantic-ui-react';
import { connectField } from 'uniforms';

// bad
function newValue(value, day, openClose, hour) {
  const ret = value;
  console.log(value);
  console.log(ret);
  ret[day][openClose] = hour;
  return ret;
}

// bad
const options = [
  { text: '00:00', value: 0 }, { text: '00:30', value: 1 }, { text: '01:00', value: 2 }, { text: '01:30', value: 3 },
  { text: '02:00', value: 4 }, { text: '02:30', value: 5 }, { text: '03:00', value: 6 }, { text: '03:30', value: 7 },
  { text: '04:00', value: 8 }, { text: '04:30', value: 9 }, { text: '05:00', value: 10 },
  { text: '05:30', value: 11 }, { text: '06:00', value: 12 }, { text: '06:30', value: 13 },
  { text: '07:00', value: 14 }, { text: '07:30', value: 15 }, { text: '08:00', value: 16 },
  { text: '08:30', value: 17 }, { text: '09:00', value: 18 }, { text: '09:30', value: 19 },
  { text: '10:00', value: 20 }, { text: '10:30', value: 21 }, { text: '11:00', value: 22 },
  { text: '11:30', value: 23 }, { text: '12:00', value: 24 }, { text: '12:30', value: 25 },
  { text: '13:00', value: 26 }, { text: '13:30', value: 27 }, { text: '14:00', value: 28 },
  { text: '14:30', value: 29 }, { text: '15:00', value: 30 }, { text: '15:30', value: 31 },
  { text: '16:00', value: 32 }, { text: '16:30', value: 33 }, { text: '17:00', value: 34 },
  { text: '17:30', value: 35 }, { text: '18:00', value: 36 }, { text: '18:30', value: 37 },
  { text: '19:00', value: 38 }, { text: '19:30', value: 39 }, { text: '20:00', value: 40 },
  { text: '20:30', value: 41 }, { text: '21:00', value: 42 }, { text: '21:30', value: 43 },
  { text: '22:00', value: 44 }, { text: '22:30', value: 45 }, { text: '23:00', value: 46 },
  { text: '23:30', value: 47 }, { text: 'N/A', value: -1 },
];

function HoursInput({ onChange, value }) {
  if (typeof value[0] === 'undefined') {
    onChange([[-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1]]);
  }
  return (
      <div>
        <Grid centered>
          <Grid.Row>
              {/* sorry for making this */}
            Monday:&nbsp;&nbsp;<Dropdown placeholder='Opening Hours' options={options} scrolling={true} upward={false}
                              onChange={(event, data) => onChange(newValue(value, 0, 0, data.value))}/>
            &nbsp;&nbsp;&nbsp;to&nbsp;&nbsp;&nbsp;
            <Dropdown placeholder='Closing Hours' options={options} scrolling={true} upward={false}
                      onChange={(event, data) => onChange(newValue(value, 0, 1, data.value))}/>
          </Grid.Row>
          <Grid.Row>
            Tuesday:&nbsp;&nbsp;<Dropdown placeholder='Opening Hours' options={options} scrolling={true} upward={false}
                                         onChange={(event, data) => onChange(newValue(value, 1, 0, data.value))}/>
            &nbsp;&nbsp;&nbsp;to&nbsp;&nbsp;&nbsp;
            <Dropdown placeholder='Closing Hours' options={options} scrolling={true} upward={false}
                      onChange={(event, data) => onChange(newValue(value, 1, 1, data.value))}/>
          </Grid.Row>
          <Grid.Row>
            Wednesday:&nbsp;&nbsp;<Dropdown placeholder='Opening Hours'
                                            options={options} scrolling={true} upward={false}
                                         onChange={(event, data) => onChange(newValue(value, 2, 0, data.value))}/>
            &nbsp;&nbsp;&nbsp;to&nbsp;&nbsp;&nbsp;
            <Dropdown placeholder='Closing Hours' options={options} scrolling={true} upward={false}
                      onChange={(event, data) => onChange(newValue(value, 2, 1, data.value))}/>
          </Grid.Row>
          <Grid.Row>
            Thursday:&nbsp;&nbsp;<Dropdown placeholder='Opening Hours' options={options} scrolling={true} upward={false}
                                         onChange={(event, data) => onChange(newValue(value, 3, 0, data.value))}/>
            &nbsp;&nbsp;&nbsp;to&nbsp;&nbsp;&nbsp;
            <Dropdown placeholder='Closing Hours' options={options} scrolling={true} upward={false}
                      onChange={(event, data) => onChange(newValue(value, 3, 1, data.value))}/>
          </Grid.Row>
          <Grid.Row>
            Friday:&nbsp;&nbsp;<Dropdown placeholder='Opening Hours' options={options} scrolling={true} upward={false}
                                         onChange={(event, data) => onChange(newValue(value, 4, 0, data.value))}/>
            &nbsp;&nbsp;&nbsp;to&nbsp;&nbsp;&nbsp;
            <Dropdown placeholder='Closing Hours' options={options} scrolling={true} upward={false}
                      onChange={(event, data) => onChange(newValue(value, 4, 1, data.value))}/>
          </Grid.Row>
          <Grid.Row>
            Saturday:&nbsp;&nbsp;<Dropdown placeholder='Opening Hours' options={options} scrolling={true} upward={false}
                                         onChange={(event, data) => onChange(newValue(value, 5, 0, data.value))}/>
            &nbsp;&nbsp;&nbsp;to&nbsp;&nbsp;&nbsp;
            <Dropdown placeholder='Closing Hours' options={options} scrolling={true} upward={false}
                      onChange={(event, data) => onChange(newValue(value, 5, 1, data.value))}/>
          </Grid.Row>
          <Grid.Row>
            Sunday:&nbsp;&nbsp;<Dropdown placeholder='Opening Hours' options={options} scrolling={true} upward={false}
                                         onChange={(event, data) => onChange(newValue(value, 6, 0, data.value))}/>
            &nbsp;&nbsp;&nbsp;to&nbsp;&nbsp;&nbsp;
            <Dropdown placeholder='Closing Hours' options={options} scrolling={true} upward={false}
                      onChange={(event, data) => onChange(newValue(value, 6, 1, data.value))}/>
          </Grid.Row>
        </Grid>
      </div>
  );
}

export default connectField(HoursInput);
