import Container from '../Components/Main/Container';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
import ErrorDiv from '../Components/Main/ErrorField';
import { useAuthContext } from '../store/authContext';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

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

  &:not(:disabled):hover {
    cursor: pointer;
    background-color: #c3c3c3;
  }
`;

const StyledForm = styled.div`
  margin: 0 auto;
  text-align: center;
`;

const NewListingSchema = Yup.object().shape({
  title: Yup.string().min(5).max(30).required(),
  price: Yup.number().required(),
  phone_number: Yup.string().required(),
  city: Yup.number().min(1, 'City is missing').required(),
  category: Yup.number().min(1, 'Category is missing').required(),
  body: Yup.string().min(10).max(2000).required(),
});

export default function AddNewListingPage() {
  const { authState } = useAuthContext();
  const navigate = useNavigate();

  const [info, setInfo] = useState({
    loading: true,
    categories: null,
    locations: null,
    error: null,
  });

  useEffect(() => {
    fetch(process.env.REACT_APP_BACKEND_URL + '/api/listings/new-listing-data')
      .then((res) => res.json())
      .then((res) => {
        if (!res?.success) throw new Error('err');
        setInfo({
          loading: false,
          categories: res.data.categories,
          locations: res.data.locations,
          error: null,
        });
      })
      .catch((err) => {
        setInfo({
          loading: false,
          categories: null,
          locations: null,
          error: err.message,
        });
      });
  }, []);

  if (info.loading) {
    return (
      <Container>
        <h1>Loading</h1>
      </Container>
    );
  } else if (info.error) {
    return (
      <Container>
        <h1>Error while loading, try again later.</h1>
      </Container>
    );
  } else if (!authState.loggedIn) {
    return (
      <Container>
        <h1>You are not logged in</h1>
      </Container>
    );
  }

  return (
    <Container>
      <StyledForm>
        <h1>Add New Listing</h1>
        <Formik
          initialValues={{
            title: '',
            price: '',
            phone_number: '',
            city: '',
            category: '',
            body: '',
            mainErrors: '',
          }}
          validationSchema={NewListingSchema}
          onSubmit={(
            { title, price, phone_number, city, category, body },
            { setFieldError }
          ) => {
            if (!authState.loggedIn) return;

            const formData = new FormData();
            formData.append('title', title);
            formData.append('price', price);
            formData.append('phone_number', phone_number);
            formData.append('city', city);
            formData.append('category', category);
            formData.append('body', body);

            fetch(process.env.REACT_APP_BACKEND_URL + '/api/listings', {
              method: 'POST',
              headers: {
                // 'content-type': 'application/json',
                authentication: `Bearer ${authState.accessToken}`,
              },
              // body: JSON.stringify({
              //   title,
              //   price,
              //   phone_number,
              //   city,
              //   category,
              //   body,
              // }),
              body: formData,
            })
              .then((res) => res.json())
              .then((res) => {
                console.log(res);
                if (res.error) {
                  if (Array.isArray(res.error)) {
                    res.error.forEach(([key, err]: [string, string]) => {
                      setFieldError(key, err);
                    });
                  } else {
                    throw new Error(res.error);
                  }
                } else if (res.success) {
                  toast.success('New listing added');
                  navigate('/');
                }
              })
              .catch((err) => {
                setFieldError('mainErrors', err.message);
              });
          }}
        >
          {({ errors, touched, setFieldValue }) => (
            <Form encType="multipart/form-data">
              <StyledInputRow>
                <StyledInput
                  type="text"
                  name="title"
                  placeholder="Listing title"
                />
                {errors.title && touched.title && <div>{errors.title}</div>}
              </StyledInputRow>

              <StyledInputRow>
                <StyledInput
                  type="number"
                  name="price"
                  placeholder="Price"
                  step="any"
                />
                {errors.price && touched.price && <div>{errors.price}</div>}
              </StyledInputRow>

              <StyledInputRow>
                <StyledInput
                  type="text"
                  name="phone_number"
                  placeholder="Phone Number"
                />
                {errors.phone_number && touched.phone_number && (
                  <div>{errors.phone_number}</div>
                )}
              </StyledInputRow>

              <StyledInputRow>
                <StyledInput
                  name="category"
                  placeholder="Category"
                  as="select"
                  disabled={!info.categories}
                  onChange={({
                    target: { value },
                  }: {
                    target: { value: string };
                  }) => {
                    setFieldValue('category', Number(value));
                  }}
                >
                  <option
                    value={-1}
                    key={-1}
                    style={{ backgroundColor: 'black', color: 'white' }}
                  >
                    Category
                  </option>
                  {(info.categories || []).map(
                    ({ id, category }: { id: number; category: string }) => (
                      <option value={id} key={id}>
                        {category}
                      </option>
                    )
                  )}
                </StyledInput>
                {errors.category && touched.category && (
                  <div>{errors.category}</div>
                )}
              </StyledInputRow>

              <StyledInputRow>
                <StyledInput
                  name="city"
                  placeholder="City"
                  as="select"
                  disabled={!info.locations}
                  onChange={({
                    target: { value },
                  }: {
                    target: { value: string };
                  }) => {
                    setFieldValue('city', Number(value));
                  }}
                >
                  <option
                    value={-1}
                    key={-1}
                    style={{ backgroundColor: 'black', color: 'white' }}
                  >
                    City
                  </option>
                  {(info.locations || []).map(
                    ({ id, city }: { id: number; city: string }) => (
                      <option value={id} key={id}>
                        {city}
                      </option>
                    )
                  )}
                </StyledInput>
                {errors.city && touched.city && <div>{errors.city}</div>}
              </StyledInputRow>

              <StyledInputRow>
                <StyledInput
                  name="body"
                  placeholder="Text"
                  as="textarea"
                  onChange={({
                    target: { value },
                  }: {
                    target: { value: string };
                  }) => {
                    setFieldValue('body', value);
                  }}
                />
                {errors.body && touched.body && <div>{errors.body}</div>}
              </StyledInputRow>

              <StyledInputRow>
                <StyledButton type="submit" disabled={info.loading}>
                  Add
                </StyledButton>
              </StyledInputRow>

              {errors.mainErrors && <ErrorDiv>{errors.mainErrors}</ErrorDiv>}
            </Form>
          )}
        </Formik>
      </StyledForm>
    </Container>
  );
}
