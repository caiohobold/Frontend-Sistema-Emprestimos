import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Visibility, VisibilityOff, Email } from '@mui/icons-material';
import '../styles/CustomBtn.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'



const CustonBtn = ({ label, icon, textColor, iconColor, onClick }) => {

    const iconStyle = {
        width: '65px',
        height: '50px',
        color: iconColor
    }

    const textStyle = {
        fontFamily: 'League Spartan',
        fontSize: '20px',
        color: textColor
    }
    

    return(
        <div className='custom-btn' onClick={onClick}>
            <div className='icon'>
                <FontAwesomeIcon icon={icon} style={iconStyle}/>
            </div>
            <span style={textStyle} className='compact-text'>{label}</span>
        </div>
  );
}

CustonBtn.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string
  };

  

export default CustonBtn;