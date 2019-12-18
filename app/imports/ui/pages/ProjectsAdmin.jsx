import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withRouter, Link } from 'react-router-dom';
import { Grid, Loader, Card, Image, Label } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { Profiles, profilesName } from '../../api/profiles/Profiles';
import { ProfilesProjects, profilesProjectsName } from '../../api/profiles/ProfilesProjects';
import { Projects, projectsName } from '../../api/projects/Projects';
import { ProjectsTags, projectsTagsName } from '../../api/projects/ProjectsTags';

/** Gets the Project data as well as Profiles and Tags associated with the passed Project name. */
function getProjectData(name) {
  const data = Projects.findOne({ name });
  const tags = _.pluck(ProjectsTags.find({ project: name }).fetch(), 'tag');
  const profiles = _.pluck(ProfilesProjects.find({ project: name }).fetch(), 'profile');
  const profilePictures = profiles.map(profile => Profiles.findOne({ email: profile }).picture);
  return _.extend({ }, data, { tags, participants: profilePictures });
}

/** Component for layout out a Project Card. */
const MakeCard = (props) => (
  <Card>
    <Card.Content>
      <Image src={props.project.picture} style={{ height: '200px' }} fluid rounded centered/>
      {/* eslint-disable-next-line max-len */}
      <Card.Header style={{ marginTop: '0px', fontFamily: 'Staatliches', color: 'orange' }}>{props.project.name}</Card.Header>
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
      <Link to={`/edit/${props.project._id}`}>Edit</Link>
    </Card.Content>
  </Card>
);

MakeCard.propTypes = {
  project: PropTypes.object.isRequired,
};

/** Renders the Project Collection as a set of Cards. */
class ProjectsAdmin extends React.Component {

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    const projects = _.pluck(Projects.find().fetch(), 'name');
    const projectData = projects.map(project => getProjectData(project));
    const reviewStyle = {
      marginTop: '20px',
      marginBottom: '20px',
      fontFamily: 'Quicksand',
    };
    return (
      <Grid fluid container style={reviewStyle}>
        <Card.Group centered>
          {_.map(projectData, (project, index) => <MakeCard key={index} project={project}/>)}
        </Card.Group>
      </Grid>
    );
  }
}

ProjectsAdmin.propTypes = {
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Ensure that minimongo is populated with all collections prior to running render().
  const sub1 = Meteor.subscribe(profilesProjectsName);
  const sub2 = Meteor.subscribe(projectsName);
  const sub3 = Meteor.subscribe(projectsTagsName);
  const sub4 = Meteor.subscribe(profilesName);
  return {
    ready: sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready(),
  };
})(ProjectsAdmin);
