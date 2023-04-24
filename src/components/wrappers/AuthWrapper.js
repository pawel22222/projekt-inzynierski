import styled from 'styled-components';

const Card = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column;
  align-items: center;
`;
const CardBody = styled.div`
  border: 2px solid #7998ff;
  border-radius: 5px;
  padding: 10px;
  margin: 10px;
  width: 400px;
`;

export default function AuthWrapper({ children }) {
  return (
    <Card>
      <CardBody>{children}</CardBody>
    </Card>
  );
}
