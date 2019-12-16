import React from 'react';
import { Grid, Icon, Header, Search } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { tagsName } from '../../api/tags/Tags';
import { profilesName } from '../../api/profiles/Profiles';
import { profilesTagsName } from '../../api/profiles/ProfilesTags';
import { profilesProjectsName } from '../../api/profiles/ProfilesProjects';
import { projectsName } from '../../api/projects/Projects';
import Projects from './Projects';

/* search bar */
const initialState = { isLoading: false, results: [], value: '' };

/** A simple static component to render some text for the landing page. */
class Landing extends React.Component {
  state = initialState;

  handleResultSelect = (e, { result }) => this.setState({ value: result.title });

  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, value });
    setTimeout(() => {
      if (this.state.value.length < 1) return this.setState(initialState);
      const re = new RegExp(_.escapeRegExp(this.state.value), 'i');
      const isMatch = (result) => re.test(result.title);
      this.setState({
        isLoading: false,
        results: _.filter(Projects.find().fetch(), isMatch),
      });
    }, 300);
  };

  render() {
    const titleStyle = {
      fontFamily: 'Staatliches',
      fontSize: '75px',
      color: 'orange',
    };
    const subtitleStyle = {
      fontFamily: 'Quicksand',
      fontSize: '24px',
    };
    const { isLoading, value, results } = this.state;
    return (
        <div className='landing-background'>
          <Grid stackable centered container columns={1}>
            <Grid.Column textAlign='center'>
              <Icon circular inverted name='student' size='massive' color='orange'/>
              <Header inverted as='h1' style={titleStyle}>Studious Manoa</Header>
              <Header inverted as='h3' style={subtitleStyle}>
                Find any study spot in, around, and near the University of Hawaii at Manoa campus.
              </Header>
            </Grid.Column>
            <Search
                fluid
                placeholder='Search for a Location'
                loading={isLoading}
                onResultSelect={this.handleResultSelect}
                onSearchChange={_.debounce(this.handleSearchChange, 500, {
                  leading: true,
                })}
                results={results}
                value={value}
                {...this.props}
            />
          </Grid>
        </div>
    );
  }
}

// export default Landing;
Landing.propTypes = {
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Ensure that minimongo is populated with all collections prior to running render().
  const sub1 = Meteor.subscribe(tagsName);
  const sub2 = Meteor.subscribe(profilesName);
  const sub3 = Meteor.subscribe(profilesTagsName);
  const sub4 = Meteor.subscribe(profilesProjectsName);
  const sub5 = Meteor.subscribe(projectsName);
  return {
    ready: sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready() && sub5.ready(),
  };
})(Landing);
