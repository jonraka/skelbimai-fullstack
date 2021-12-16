import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FeaturedAdsInterface } from '../../mainInterfaces.d';
import noImage from '../../assets/no-image.jpg';

const StyledCard = styled.div`
  min-width: 220px;
  /* height: 100%; */
  background-color: white;
  margin: 10px 0;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #0000003e;
  flex: 0 0 23%;

  & a {
    text-decoration: none;
    color: inherit;
  }

  & a:hover {
    text-decoration: underline;
  }

  @media (max-width: 800px) {
    flex: 0 0 49%;
  }

  @media (max-width: 500px) {
    flex: 0 0 100%;
  }
`;

const StyledImageWrapper = styled.div`
  display: flex;
`;

const StyledImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const StyledTitle = styled.div`
  font-size: 2rem;
  margin: 15px 10px 0 10px;
  font-weight: bold;
`;

const StyledRow = styled.div`
  margin-left: 10px;
  color: #797979;
`;

const StyledPricingRow = styled.div`
  font-size: 1.3rem;
  font-weight: bold;
  text-align: right;
  margin: 10px 20px;
`;

export default function FeaturedListingsCard({ data }: { data: FeaturedAdsInterface }) {
  return (
    <StyledCard>
      <Link to={`/listings/${data.id}`}>
        <StyledImageWrapper>
          <StyledImage
            src={noImage}
            referrerPolicy="no-referrer"
            alt="im"
          ></StyledImage>
        </StyledImageWrapper>
      </Link>
      <StyledTitle>
        <Link to={`/listings/${data.id}`}>{data.title}</Link>
      </StyledTitle>
      <StyledRow>X {new Date(data.created).toLocaleString('lt-LT')}</StyledRow>
      <StyledRow>X {data.city}</StyledRow>
      <StyledRow>
        X <Link to={`/listings/${data.id}`}>{data.category}</Link>
      </StyledRow>
      <StyledPricingRow>€{data.price}</StyledPricingRow>
    </StyledCard>
  );
}
