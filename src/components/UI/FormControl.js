import styled from 'styled-components';
import { forwardRef } from 'react';

const FormGroup = styled.div`
  display: flex;
  flex-flow: column;
  padding: 0px 0 5px;
`;
const Label = styled.label`
  font-weight: bold;
  margin-bottom: 5px;
`;
const Input = styled.input`
  height: 35px;
  border-radius: 5px;
  border: 2px solid #7998ff;
  &:focus {
    outline: 2px #7998ff solid;
  }
  &::placeholder {
    color: #7998ff;
  }
`;

const FormControl = forwardRef(
  ({ id, label, type, placeholder, defaultValue, min, max, step, required }, ref) => {
    return (
      <FormGroup id={id}>
        <Label>{label}</Label>
        <Input
          type={type}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder ? placeholder : ''}
          ref={ref}
          required={required}
          defaultValue={defaultValue}
        />
      </FormGroup>
    );
  },
);
export default FormControl;
