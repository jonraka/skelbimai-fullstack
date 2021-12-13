import FeaturedAdCard from './FeaturedAdCard';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { FeaturedAdsInterface } from '../../mainInterfaces.d';

const StyledCardsList = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  margin: 20px auto;
`;

interface StateInterface {
  loading: boolean;
  data: null | FeaturedAdsInterface[];
  error: null | string;
}

export default function FeaturedAds() {
  const [state, setState] = useState<StateInterface>({
    loading: true,
    data: null,
    error: null,
  });

  useEffect(() => {
    let isSubscribed = true;
    fetch(process.env.REACT_APP_BACKEND_URL + '/ads/featured')
      .then((res) => {
        if (res.status !== 200) throw new Error('Internal Error');
        return res.json();
      })
      .then((res) => {
        if (!isSubscribed) return;
        if (!res.success) throw new Error('Internal Error');
        setState(() => ({
          loading: false,
          data: res.data,
          error: null,
        }));
      })
      .catch((err) => {
        if (!isSubscribed) return;
        setState(() => ({
          loading: false,
          data: null,
          error: err.message,
        }));
      });

    return () => {
      isSubscribed = false;
    };
  }, []);

  return (
    <StyledCardsList>
      {state.loading
        ? 'Loading'
        : state.error
        ? state.error
        : (state.data || []).map((data) => (
            <FeaturedAdCard key={`ad-${data.id}`} data={data} />
          ))}
    </StyledCardsList>
  );
}
