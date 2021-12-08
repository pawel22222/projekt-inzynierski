import styled, { keyframes } from 'styled-components'

const rotate360 = keyframes`
  from {transform: rotate(0deg);}
  to {transform: rotate(360deg);}
`
const SpinnerLoading = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  margin: 5px;
  animation: ${rotate360} 1s linear infinite;
  transform: translateZ(0);
  border-top: 2px solid grey;
  border-right: 2px solid grey;
  border-bottom: 2px solid grey;
  border-left: 4px solid black;
  background: transparent;
  width: 50px;
  height: 50px;
  border-radius: 50%;
`

export default SpinnerLoading