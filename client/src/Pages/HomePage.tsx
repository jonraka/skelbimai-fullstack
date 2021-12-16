import Container from '../Components/Main/Container';
import FeaturedListings from '../Components/Main/FeaturedListings';
import styled from 'styled-components';

const StyledFeaturedDescription = styled.div`
  margin-top: 50px;

  & > * {
    text-align: center;
  }

  & > h3 {
    margin: 10px 0;
  }
`;

export default function HomePage() {
  return (
    <Container>
      <StyledFeaturedDescription>
        <h1>Our Featured Ads</h1>
        <h3>Browse to Our Top Products</h3>
      </StyledFeaturedDescription>
      <FeaturedListings />
    </Container>
  );
}
