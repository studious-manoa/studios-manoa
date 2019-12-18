import React from 'react';
import { Icon } from 'semantic-ui-react';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
class Footer extends React.Component {
  render() {
    const divStyle = {
      fontFamily: 'Quicksand',
      fontSize: '18px',
      paddingTop: '15px',
      paddingBottom: '30px',
      backgroundColor: '#434343',
      color: 'white',
    };
    return (
        <footer>

          <div style={divStyle} className="ui fluid center aligned container">
            <hr />
            <Icon circular inverted color='orange' name='student' />
            <br />
            Studious Manoa, 2019 Fall Semester<br />
            ICS 314, Software Engineering I<br />
            Check out our <a href='https://studious-manoa.github.io'>Github</a> page!
          </div>
        </footer>
    );
  }
}

export default Footer;
