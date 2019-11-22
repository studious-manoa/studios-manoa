import React from 'react';
import { Form, Button, Header, Container, Image, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const Edit = () => (
<Container align={'center'}>
  <Form.Group>
        <Form>
          <Header color={'orange'} as="h1">Edit Profile</Header>
          <Image src='/images/profilpicture.png' size='small' circular/>
        <br/><Button circular><Icon name='picture'/>Change profile picture</Button>
          <Form.Field width={6}>
            <label align={'left'}>Name</label>
            <input placeholder='Ola Nordmann'/>
          </Form.Field>
          <Form.Field width={6} >
            <label align={'left'}>Username</label>
            <input placeholder='Onordmann82'/>
          </Form.Field>
          <Form.Field width={6} >
            <label align={'left'}>Mail</label>
            <input placeholder='example@hawaii.edu'/>
          </Form.Field>
          <Form.Field width={6} >
            <label align={'left'}>Major</label>
            <input placeholder='Computer Science'/>
          </Form.Field>
          <Button circular color={'orange'} as={Link} to="/UserProfile"><Icon name='save'/>
            Submit changes</Button>
        </Form>
  </Form.Group>
</Container>
);

export default Edit;
