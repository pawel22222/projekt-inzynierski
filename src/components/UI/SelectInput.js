import { forwardRef } from 'react';
import styled from 'styled-components';

const Select = styled.select`
  height: 35px;
  border-radius: 5px;
  border: 2px solid #7998ff;
  margin-left: 5px;
  &:focus {
    outline: 2px #7998ff solid;
  }
`;
const Option = styled.option``;

const SelectInput = forwardRef(({ label, name, options }, ref) => {
  return (
    <>
      <label htmlFor={name}>{label}</label>
      <Select name={name} id={name} ref={ref}>
        {options.map((option) => (
          <Option key={option} value={option}>
            {option}
          </Option>
        ))}
      </Select>
    </>
  );
});

export default SelectInput;
