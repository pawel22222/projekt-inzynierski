import React from 'react';
import styled, { css } from 'styled-components';

const Button = styled.button`
  border: 2px solid #cdcdcd;
  border-radius: 5px;
  background-color: #407eda;
  color: white;
  height: 35px;
  width: 100%;
  transition: background-color 0.3s ease;
  :hover {
    background-color: #376dbe;
    cursor: pointer;
  }
  ${({ color }) =>
    color === 'primary' &&
    css`
      background-color: #407eda;
      :hover {
        background-color: #376dbe;
      }
    `}
  ${({ color }) =>
    color === 'secondary' &&
    css`
      background-color: #a1a1a1;
      :hover {
        background-color: #8a8a8a;
      }
    `}
    ${({ color }) =>
    color === 'danger' &&
    css`
      background-color: #f03b3b;
      :hover {
        background-color: #d63333;
      }
    `}
    ${({ color }) =>
    color === 'green' &&
    css`
      background-color: #50c533;
      :hover {
        background-color: #43a52b;
      }
    `}
`;

export default function ButtonMain({ label, type, loading, onClick, color }) {
  return (
    <Button color={color} type={type} disabled={loading} onClick={onClick}>
      {label}
    </Button>
  );
}
