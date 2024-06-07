import React, { useState } from 'react';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import InputMask from 'react-input-mask';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { Visibility, VisibilityOff, Email } from '@mui/icons-material';
import '../styles/CustomInput.css'
import { propTypes } from 'react-bootstrap/esm/Image';

const CustomInput = ({ label, type, value, onChange, name, mask, isPassword }) => {

    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return(
      <InputMask mask={mask} value={value} onChange={onChange}>
      {() => (
        <TextField
          className='btn-form'
          label={label}
          variant="outlined"
          type={isPassword && showPassword ? 'text' : type}
          fullWidth
          margin="normal"
          value={value}
          onChange={onChange}
          name={name}
        />
      )}
    </InputMask>
  );
}

CustomInput.propTypes = {
    label: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    isPassword: PropTypes.bool,
    mask: PropTypes.string
  };
  
  CustomInput.defaultProps = {
    isPassword: false,
    mask: ''
  };

export default CustomInput;