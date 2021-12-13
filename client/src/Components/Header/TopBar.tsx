import Container from '../Main/Container';
import styled from 'styled-components';

const StyledTopbarBackground = styled.div`
  background-color: black;
  color: white;
`;

const StyledMain = styled.div`
  display: flex;
  justify-content: space-between;
  height: 100%;
`;

const IconsList = styled.ul`
  display: flex;
  list-style: none;

  & li {
    margin: 0 5px;
  }
`;

export default function TopBar() {
  return (
    <StyledTopbarBackground>
      <Container>
        <StyledMain>
          <div>X +456456465456</div>
          <div>
            <IconsList>
              <li>X</li>
              <li>X</li>
              <li>X</li>
              <li>X</li>
            </IconsList>
          </div>
        </StyledMain>
      </Container>
    </StyledTopbarBackground>
  );
}
