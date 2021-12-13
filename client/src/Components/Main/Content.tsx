import styled from 'styled-components';
const StyledMain = styled.div`
  background-color: white;
  padding: 10px;
  margin-top: 10px;
`;

export default function Content({ children }: { children: React.ReactNode }) {
  return <StyledMain>{children}</StyledMain>;
}
