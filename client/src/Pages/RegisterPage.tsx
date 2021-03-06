import Container from '../Components/Main/Container';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const StyledInput = styled(Field)`
  width: 100%;
  max-width: 500px;
  padding: 10px;
  margin: 2px 0;
`;

const StyledInputRow = styled.div`
  margin: 2px 10px;
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
    .required('Username is required'),
  password: Yup.string()
    .min(5, 'Password is too short')
    .max(50, 'Password is too long')
    //.matches(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    .required('Password is required'),
  password2: Yup.string().oneOf(
    [Yup.ref('password'), null],
    'Passwords must match'
  ).required('Please retype a password'),
  email: Yup.string().email('Email is invalid').required('Email is required'),
});

export default function RegisterPage() {
  const navigation = useNavigate();

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
            mainErrors: '',
          }}
          validationSchema={SignupSchema}
          onSubmit={({ username, password, email }, { setFieldError }) => {
            fetch(process.env.REACT_APP_BACKEND_URL + '/api/auth/register', {
              method: 'POST',
              headers: {
                'content-type': 'application/json',
              },
              body: JSON.stringify({
                username,
                password,
                email,
              }),
            })
              .then((res) => res.json())
              .then((res) => {
                if (res.error) {
                  if (Array.isArray(res.error)) {
                    res.error.forEach(([key, err]: [string, string]) => {
                      setFieldError(key, err);
                    });
                  } else {
                    throw new Error(res.error);
                  }
                } else {
                  if (!res.success) {
                    throw new Error('Unkown error');
                  } else {
                    navigation('/login?registered=1', { replace: true });
                  }
                }
              })
              .catch((err) => {
                setFieldError('mainErrors', err.message);
              });
          }}
        >
          {({ errors, touched }) => (
            <Form>
              <StyledInputRow>
                <StyledInput
                  type="text"
                  name="username"
                  placeholder="Username"
                />
                {errors.username && touched.username && (
                  <div>{errors.username}</div>
                )}
              </StyledInputRow>

              <StyledInputRow>
                <StyledInput type="email" name="email" placeholder="Email" />
                {errors.email && touched.email && <div>{errors.email}</div>}
              </StyledInputRow>

              <StyledInputRow>
                <StyledInput
                  type="password"
                  name="password"
                  placeholder="Password"
                />
                {errors.password && touched.password && (
                  <div>{errors.password}</div>
                )}
              </StyledInputRow>

              <StyledInputRow>
                <StyledInput
                  type="password"
                  name="password2"
                  placeholder="Repeat password"
                />
                {errors.password2 && touched.password2 && (
                  <div>{errors.password2}</div>
                )}
              </StyledInputRow>

              <StyledInputRow>
                <StyledButton type="submit">Register</StyledButton>
              </StyledInputRow>

              {errors.mainErrors && (
                <StyledInputRow>{errors.mainErrors}</StyledInputRow>
              )}
            </Form>
          )}
        </Formik>
      </StyledForm>
    </Container>
  );
}
