import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Loader, Card, Image } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { tagsName, Tags } from '../../api/tags/Tags';
import { Profiles, profilesName } from '../../api/profiles/Profiles';
import { ProfilesTags, profilesTagsName } from '../../api/profiles/ProfilesTags';
import { profilesProjectsName } from '../../api/profiles/ProfilesProjects';
import { Projects, projectsName } from '../../api/projects/Projects';
import { ProjectsTags, projectsTagsName } from '../../api/projects/ProjectsTags';

/** Returns the Profiles and Projects associated with the passed Tag. */
function getTagData(name) {
  const profiles = _.pluck(ProfilesTags.find({ tag: name }).fetch(), 'profile');
  const profilePictures = profiles.map(profile => Profiles.findOne({ email: profile }).picture);
  const projects = _.pluck(ProjectsTags.find({ tag: name }).fetch(), 'project');
  const projectPictures = projects.map(project => Projects.findOne({ name: project }).picture);
  // console.log(_.extend({ }, data, { tags, projects: projectPictures }));
  return _.extend({ }, { name, profiles: profilePictures, projects: projectPictures });
}

/** Component for layout out an Tag Card. */
const MakeCard = (props) => (
  <Card>
    <Card.Content>
      <Card.Header style={{ marginTop: '0px' }}>{props.tag.name}</Card.Header>
    </Card.Content>
    <Card.Content extra>
      {_.map(props.tag.profiles, (p, index) => <Image key={index} circular size='mini' src={p}/>)}
      {_.map(props.tag.projects, (p, index) => <Image key={index} circular size='mini' src={p}/>)}
    </Card.Content>
  </Card>
);

MakeCard.propTypes = {
  tag: PropTypes.object.isRequired,
};

/** Renders the Tags as a set of Cards. */
class TagsPage extends React.Component {

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    const tags = _.pluck(Tags.find().fetch(), 'name');
    const tagData = tags.map(tag => getTagData(tag));
    return (
      <Container>
        <Card.Group>
          {_.map(tagData, (tag, index) => <MakeCard key={index} tag={tag}/>)}
        </Card.Group>
      </Container>
    );
  }
}

TagsPage.propTypes = {
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Ensure that minimongo is populated with all collections prior to running render().
  const sub1 = Meteor.subscribe(profilesProjectsName);
  const sub2 = Meteor.subscribe(projectsName);
  const sub3 = Meteor.subscribe(projectsTagsName);
  const sub4 = Meteor.subscribe(profilesName);
  const sub5 = Meteor.subscribe(tagsName);
  const sub6 = Meteor.subscribe(profilesTagsName);
  return {
    ready: sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready() && sub5.ready() && sub6.ready(),
  };
})(TagsPage);
