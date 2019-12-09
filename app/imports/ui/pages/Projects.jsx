import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withRouter, Link } from 'react-router-dom';
import { Container, Loader, Card, Image, Label, Header, Rating } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { Profiles, profilesName } from '../../api/profiles/Profiles';
import { ProfilesProjects, profilesProjectsName } from '../../api/profiles/ProfilesProjects';
import { Projects, projectsName } from '../../api/projects/Projects';
import { ProjectsTags, projectsTagsName } from '../../api/projects/ProjectsTags';
import MapLeaflet from '../components/MapLeaflet';
import { ProjectsRatings, projectsRatingsValue } from '../../api/projects/ProjectsRatings';

/** Gets the Project data as well as Profiles and Tags associated with the passed Project name. */
function getProjectData(name) {
  const data = Projects.findOne({ name });
  const tags = _.pluck(ProjectsTags.find({ project: name }).fetch(), 'tag');
  const ratings = _.pluck(ProjectsRatings.find({ project: name }).fetch(), 'rating');
  const avgRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
  const profiles = _.pluck(ProfilesProjects.find({ project: name }).fetch(), 'profile');
  const profilePictures = profiles.map(profile => Profiles.findOne({ email: profile }).picture);
  return _.extend({}, data, { tags, avgRating, participants: profilePictures });
}

/** Component for layout out a Project Card. */
const MakeCard = (props) => (
    <Card width={1000}>
      <Card.Content>
        <Image src={props.project.picture} style={{ height: '200px' }} fluid rounded centered/>
        <Card.Header style={{ marginTop: '0px', fontFamily: 'Staatliches' }}>
          <Link to={`/location/${props.project._id}`}>{props.project.name}</Link>
        </Card.Header>
        <Card.Meta>
          <span className='date'>{props.project.title}</span>
        </Card.Meta>
        <Card.Description>
          {props.project.description}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        {_.map(props.project.tags,
            (tag, index) => <Label key={index} size='tiny' color='orange'>{tag}</Label>)}
      </Card.Content>
      <Card.Content extra>
        <Rating defaultRating={props.project.avgRating} maxRating={5} disabled/>
      </Card.Content>
    </Card>
);

MakeCard.propTypes = {
  project: PropTypes.object.isRequired,
};

/** Renders the Project Collection as a set of Cards. */
class ProjectsPage extends React.Component {

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    const latitudes = _.pluck(Projects.find().fetch(), 'lat');
    const longitudes = _.pluck(Projects.find().fetch(), 'long');
    const names = _.pluck(Projects.find().fetch(), 'name');
    const locations = _.zip(names, latitudes, longitudes);
    const projectData = names.map(project => getProjectData(project));

    const locationStyle = {
      marginTop: '20px',
      marginBottom: '20px',
      fontFamily: 'Quicksand',
    };
    const cardStyle = {
      marginTop: '10px',
      color: 'orange',
    };
    const pageStyle = {
      fontFamily: 'Staatliches',
      color: 'orange',
    };
    return (
        <div style={locationStyle}>
          <Header as='h1' textAlign='center' inverted style={pageStyle}>Study Spots</Header>
          <MapLeaflet lat={21.2989} lng={-157.817} zoom={17} locations={locations}> </MapLeaflet>
          <Container>
            <Card.Group centered style={cardStyle}>
              {_.map(projectData, (project, index) => <MakeCard key={index} project={project}/>)}
            </Card.Group>
          </Container>
        </div>
    );
  }
}

ProjectsPage.propTypes = {
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Ensure that minimongo is populated with all collections prior to running render().
  const sub1 = Meteor.subscribe(profilesProjectsName);
  const sub2 = Meteor.subscribe(projectsName);
  const sub3 = Meteor.subscribe(projectsTagsName);
  const sub4 = Meteor.subscribe(profilesName);
  const sub5 = Meteor.subscribe(projectsRatingsValue);
  return {
    ready: sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready() && sub5.ready(),
  };
})(ProjectsPage);
