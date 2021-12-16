import Container from '../Components/Main/Container';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
import ErrorDiv from '../Components/Main/ErrorField';
import { useAuthContext } from '../store/authContext';

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

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Email is invalid').required('Email is required'),
  password: Yup.string()
    .min(5, 'Password is too short')
    .max(50, 'Password is too long')
    .required('Password is required'),
});

export default function LoginPage() {
  const { login } = useAuthContext();

  return (
    <Container>
      <StyledForm>
        <h1>Login</h1>
        <Formik
          initialValues={{
            email: '',
            password: '',
            mainErrors: '',
          }}
          validationSchema={LoginSchema}
          onSubmit={({ email, password }, { setFieldError }) => {
            fetch(process.env.REACT_APP_BACKEND_URL + '/api/auth/login', {
              method: 'POST',
              headers: {
                'content-type': 'application/json',
              },
              body: JSON.stringify({
                email,
                password,
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
                  if (!res?.data?.accessToken) {
                    throw new Error('Unkown error');
                  } else {
                    const {accessToken, id, email, username} = res.data;
                    login({accessToken, id, email, username});
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
                <StyledButton type="submit">Login</StyledButton>
              </StyledInputRow>

              {errors.mainErrors && <ErrorDiv>{errors.mainErrors}</ErrorDiv>}
            </Form>
          )}
        </Formik>
      </StyledForm>
    </Container>
  );
}
