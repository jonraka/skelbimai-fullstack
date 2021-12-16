import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import noImage from '../../assets/no-image.jpg';

const StyledList = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
`;

const StyledImage = styled.img`
  width: 250px;
  height: 170px;
  display: block;
  object-fit: cover;
  background-color: black;
`;

const StyledListItem = styled.div`
  background-color: yellow;
  /* margin-bottom: 20px; */
  display: flex;
  margin-bottom: 10px;

  & > .listings_left_side {
    padding: 10px;
  }

  & > .listings_right_side {
      width: 100%;
  }
`;

export default function ListingsMain() {
  const [state, setState] = useState<{
    loading: boolean;
    data:
      | null
      | {
          id: number;
          title: string;
          price: number;
          category: string;
          featured: number;
          sold: number;
          created: string;
        }[];
    error: null | string | string[];
  }>({
    loading: true,
    data: null,
    error: null,
  });

  useEffect(() => {
    let isSubscribed = true;
    fetch(process.env.REACT_APP_BACKEND_URL + '/api/listings')
      .then((res) => {
        if (res.status !== 200) throw new Error('Internal Error');
        return res.json();
      })
      .then((res) => {
        if (!isSubscribed) return;
        if (!res.success) throw new Error('Internal Error');
        setState({
          loading: false,
          data: res.data,
          error: null,
        });
      })
      .catch((err) => {
        if (!isSubscribed) return;
        setState({
          loading: false,
          data: null,
          error: err.message,
        });
      });
  }, []);

  return (
    <StyledList>
      {state.data &&
        state.data.map(({ id, title, created, price }) => (
          <StyledListItem key={id}>
            <div className="listings_left_side">
              <Link to={`/listings/${id}`}><StyledImage src={noImage} alt="Image" referrerPolicy='no-referrer'/></Link>
            </div>
            <div className="listings_right_side">
              <div><Link to={`/listings/${id}`}>{title}</Link></div>
              <div>{new Date(created).toLocaleString('lt-LT')}</div>
              <div>{price}</div>
            </div>
          </StyledListItem>
        ))}
    </StyledList>
  );
}
