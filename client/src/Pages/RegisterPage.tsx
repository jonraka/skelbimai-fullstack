import Container from '../Components/Main/Container';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';

const StyledInput = styled(Field)`
  width: 700px;
  padding: 10px;
  margin: 2px 0;
`;

const StyledButton = styled.button`
  padding: 10px;
  font-size: 2rem;
  border: none;
  min-width: 200px;
  background-color: #a3a3a3;
  cursor: pointer;

  &:hover {
    background-color: #c3c3c3;
  }
`;

const StyledForm = styled.div`
  margin: 0 auto;
  text-align: center;
`;

const SignupSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Username is too short')
    .max(30, 'Username is too long')
    .required(),
  password: Yup.string()
    .min(5, 'Password is too short')
    .max(50, 'Password is too long')
    .matches(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    .required(),
  password2: Yup.string().oneOf(
    [Yup.ref('password'), null],
    'Passwords must match'
  ),
  email: Yup.string().email('Email is invalid').required(),
});

export default function RegisterPage() {
  return (
    <Container>
      <StyledForm>
        <h1>Signup</h1>
        <Formik
          initialValues={{
            username: '',
            password: '',
            password2: '',
            email: '',
          }}
          validationSchema={SignupSchema}
          onSubmit={(values) => {
            // same shape as initial values
            console.log(values);
          }}
        >
          {({ errors, touched }) => (
            <Form>
              <div>
                <StyledInput
                  type="text"
                  name="username"
                  placeholder="username"
                />
                {errors.username && touched.username ? (
                  <div>{errors.username}</div>
                ) : null}
              </div>

              <div>
                <StyledInput type="email" name="email" placeholder="email" />
                {errors.email && touched.email ? (
                  <div>{errors.email}</div>
                ) : null}
              </div>

              <div>
                <StyledInput
                  type="password"
                  name="password"
                  placeholder="password"
                />
                {errors.password && touched.password ? (
                  <div>{errors.password}</div>
                ) : null}
              </div>

              <div>
                <StyledInput
                  type="password"
                  name="password2"
                  placeholder="password2"
                />
                {errors.password2 && touched.password2 ? (
                  <div>{errors.password2}</div>
                ) : null}
              </div>

              <div>
                <StyledButton type="submit">Register</StyledButton>
              </div>
            </Form>
          )}
        </Formik>
      </StyledForm>
    </Container>
  );
}
