import React, { useState, useContext } from 'react';
import { Form, Button } from 'semantic-ui-react';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';

import useForm from '../util/useForm';
import { AuthContext } from '../context/auth';

export default function Login(props) {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});

  const { onChange, onSubmit, values } = useForm(loginUserCallback, {
    username: '',
    password: '',
  });

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    onCompleted(data) {
      context.login(data.login);
      props.history.push('/');
    },
    variables: values,
    // if there is an error with the mutation we will popular the errors state
    onError(err) {
      console.log('Login Error:', err);
      if (err.graphQLErrors) {
        setErrors(err.graphQLErrors[0].extensions.exception.errors);
      }
    },
  });

  function loginUserCallback() {
    loginUser();
  }

  return (
    <div className="form-container">
      {/* Login Form Body */}
      <Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
        <h1>Login</h1>
        {/* Username */}
        <Form.Input
          label="Username"
          placeholder="Username..."
          name="username"
          type="text"
          value={values.username}
          onChange={onChange}
          error={errors && errors.username ? true : false}
        />
        {/* Password */}
        <Form.Input
          label="Password"
          placeholder="Password..."
          type="password"
          name="password"
          value={values.password}
          onChange={onChange}
          error={errors && errors.password ? true : false}
        />
        {/* Submit Button */}
        <Button type="submit" primary style={{ background: '#00b5ad' }}>
          Login
        </Button>
      </Form>
      {loading ? <p>Logging in user...</p> : ''}
      {errors && Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map((value) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      email
      username
      createdAt
      token
    }
  }
`;
