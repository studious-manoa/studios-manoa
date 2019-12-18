import React from 'react';
import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { Container, Loader, Card, Image, Label, Header, Segment, Rating } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import SubmitField from 'uniforms-semantic/SubmitField';
import AutoForm from 'uniforms-semantic/AutoForm';
import { Link } from 'react-router-dom';
import { Tags, tagsName } from '../../api/tags/Tags';
import { Profiles, profilesName } from '../../api/profiles/Profiles';
import { ProfilesTags, profilesTagsName } from '../../api/profiles/ProfilesTags';
import { ProfilesProjects, profilesProjectsName } from '../../api/profiles/ProfilesProjects';
import { Projects, projectsName } from '../../api/projects/Projects';
import { ProjectsTags, projectsTagsName } from '../../api/projects/ProjectsTags';
import MultiSelectField from '../forms/controllers/MultiSelectField';
import { ProjectsRatings, projectsRatingsValue } from '../../api/projects/ProjectsRatings';

/** Create a schema to specify the structure of the data to appear in the form. */
const makeSchema = (allTags) => new SimpleSchema({
  tags: { type: Array, label: 'Tags', optional: true },
  'tags.$': { type: String, allowedValues: allTags },
});

/** Gets the Project data as well as Profiles and Tags associated with the passed Project name. */
function getProjectData(name) {
  const data = Projects.findOne({ name });
  const tags = _.pluck(ProjectsTags.find({ project: name }).fetch(), 'tag');
  const ratings = _.pluck(ProjectsRatings.find({ project: name }).fetch(), 'rating');
  const avgRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
  const profiles = _.pluck(ProfilesProjects.find({ project: name }).fetch(), 'profile');
  const profilePictures = profiles.map(profile => Profiles.findOne({ email: profile }).picture);
  return _.extend({ }, data, { tags, avgRating, participants: profilePictures });
}

/** Component for layout out a Profile Card. */
const MakeCard2 = (props) => (
    <Card width={1000}>
      <Card.Content>
        <Image src={props.project.picture} style={{ height: '200px' }} fluid rounded centered />
        <Card.Header style={{ marginTop: '0px', fontFamily: 'Staatliches' }}>
          <Link to={`/location/${props.project.name}`}>{props.project.name}</Link>
        </Card.Header>        <Card.Meta>
          <span className='date'>{props.project.title}</span>
        </Card.Meta>
        <Card.Description style={{ fontFamily: 'Quicksand' }}>
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

MakeCard2.propTypes = {
  project: PropTypes.object.isRequired,
};


/** Renders the Profile Collection as a set of Cards. */
class Filter extends React.Component {

  constructor(props) {
    super(props);
    this.state = { tags: [] };
  }

  submit(data) {
    this.setState({ tags: data.tags || [] });
  }

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    const allTags = _.pluck(Tags.find().fetch(), 'name');
    const formSchema = makeSchema(allTags);
    const stuff = _.pluck(ProjectsTags.find({ tag: { $in: this.state.tags } }).fetch(), 'project');
    const projdata = _.uniq(stuff).map(thing => getProjectData(thing));
    const margins = {
      marginTop: '20px',
      marginBottom: '20px',
    };
    const pageStyle = {
      fontFamily: 'Staatliches',
      color: 'orange',
    };

    return (
      <Container style={margins}>
        <Header as='h1' textAlign='center' inverted style={pageStyle}>Filter Locations</Header>
        <AutoForm schema={formSchema} onSubmit={data => this.submit(data)} >
          <Segment>
            <MultiSelectField name='tags' showInlineError={true} placeholder={'Tags'}/>
            <SubmitField value='Submit'/>
          </Segment>
        </AutoForm>
        <Card.Group style={margins}>
          {_.map(projdata, (project, index) => <MakeCard2 key={index} project={project}/>)}
        </Card.Group>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
      </Container>
    );
  }
}

/** Require an array of Stuff documents in the props. */
Filter.propTypes = {
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Ensure that minimongo is populated with all collections prior to running render().
  const sub1 = Meteor.subscribe(profilesName);
  const sub2 = Meteor.subscribe(profilesTagsName);
  const sub3 = Meteor.subscribe(profilesProjectsName);
  const sub4 = Meteor.subscribe(projectsName);
  const sub5 = Meteor.subscribe(tagsName);
  const sub6 = Meteor.subscribe(projectsTagsName);
  const sub7 = Meteor.subscribe(projectsRatingsValue);
  return {
    ready: sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready() && sub5.ready() && sub6.ready() && sub7.ready(),
  };
})(Filter);
