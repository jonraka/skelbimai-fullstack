/* eslint-disable jsx-a11y/img-redundant-alt */
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import noImage from '../assets/no-image.jpg';

interface StateInterface {
  loading: boolean;
  data: null | {
    id: number;
    title: string;
    price: string;
    category: string;
    featured: number;
    sold: number;
    created: string;
    city: string;
    body: string;
  };
  error: null | string;
}

export default function SingleListingPage() {
  const [state, setState] = useState<StateInterface>({
    loading: true,
    data: null,
    error: null,
  });
  const { id: listingId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (isNaN(Number(listingId))) {
      toast.error('Listing not found');
      navigate('/');
    }

    let isSubscribed = true;
    fetch(process.env.REACT_APP_BACKEND_URL + '/api/listings/' + listingId)
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      {state.data && (
        <>
          <div>
            <img src={noImage} alt="Image" />
          </div>
          <div>{state.data.title}</div>
          <div>{state.data.created}</div>
          <div>{state.data.body}</div>
          <div>{state.data.city}</div>
          <div>{state.data.category}</div>
        </>
      )}
    </div>
  );
}
