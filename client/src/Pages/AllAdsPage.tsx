import Container from '../Components/Main/Container';
import styled from 'styled-components';

const StyledAllAds = styled.div`
  margin-top: 50px;

  & > * {
    text-align: center;
  }

  & > h3 {
    margin: 10px 0;
  }
`;

const StyledAdsList = styled.div`
  background-color: red;
  height: 200px;
`;

export default function AllAdsPage() {
  return (
    <Container>
      <StyledAllAds>
        <h1>Ads</h1>
        <h3>Browse to Our Listings</h3>
        <StyledAdsList />
      </StyledAllAds>
    </Container>
  );
}
