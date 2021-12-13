import styled from 'styled-components';
import React from 'react';

interface Props {
  children: React.ReactNode;
}

const StyledContainer = styled.div<Props>`
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
`;

const StyledFlexedContainer = styled(StyledContainer)`
  display: flex;
`;

export default function Container({ children }: { children: React.ReactNode }) {
  return <StyledContainer>{children}</StyledContainer>;
}

export function FlexedContainer({ children }: { children: React.ReactNode }) {
  return <StyledFlexedContainer>{children}</StyledFlexedContainer>;
}
