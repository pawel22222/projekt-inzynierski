import styled from 'styled-components';

const Container = styled.div`
  margin-top: 10px;
`;

export default function AuthHelperWrapper({ children }) {
  return <Container>{children}</Container>;
}
