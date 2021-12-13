import styled from 'styled-components';
import Container from '../Main/Container';
import { NavLink } from 'react-router-dom';
import TopBar from './TopBar';

const StyledHeaderBackground = styled.div`
  background-color: white;
`;

const StyledHeader = styled.div`
  min-height: 70px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const StyledLogo = styled.div`
  background-color: black;
  color: white;
  font-size: 3rem;
  text-align: center;
  width: 200px;
`;

const StyledNavList = styled.ul`
  display: flex;
  list-style: none;
  flex-wrap: wrap;

  & > li {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  & a {
    padding: 0 20px;
    display: inline-block;
    text-decoration: none;
    align-items: center;
    justify-content: center;
    line-height: 70px;
    font-size: 1.1rem;
    color: black;
  }

  & .active {
    color: red;
  }

  & a:hover {
    background-color: #e9e9e9;
  }
`;

const StyledPostAddButton = styled(NavLink)`
  background-color: orange;
  font-weight: bold;
  border-radius: 10px;
  line-height: 40px;
  padding: 0 20px;
  height: 40px;
  align-self: center;
  text-decoration: none;
  color: black;
  display: block;

  &:hover {
    background-color: #ffc04a;
  }
`;

export default function Header() {
  return (
    <>
      <TopBar />
      <StyledHeaderBackground>
        <Container>
          <StyledHeader>
            <StyledLogo>Logo</StyledLogo>
            <StyledNavList>
              <NavLink to="/">Home</NavLink>
              <NavLink to="/ads">All Ads</NavLink>
              <NavLink to="/pages">Pages</NavLink>
              <NavLink to="/blog">Blog</NavLink>
              <NavLink to="/contact">Contact</NavLink>
              <NavLink to="/register">Register</NavLink>
            </StyledNavList>
            <StyledPostAddButton to="/">Post Your Ad</StyledPostAddButton>
          </StyledHeader>
        </Container>
      </StyledHeaderBackground>
    </>
  );
}
