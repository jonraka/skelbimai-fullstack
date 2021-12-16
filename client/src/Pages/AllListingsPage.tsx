import Container from '../Components/Main/Container';
import styled from 'styled-components';
import ListingsMain from '../Components/Main/ListingsMain';

const StyledAllAds = styled.div`
  margin-top: 50px;

  & > h1, & > h3 {
    text-align: center;
  }

  & > h3 {
    margin: 10px 0;
  }
`;

export default function AllListingsPage() {
  return (
    <Container>
      <StyledAllAds>
        <h1>Listings</h1>
        <h3>Browse to Our Listings</h3>
        <ListingsMain />
      </StyledAllAds>
    </Container>
  );
}
