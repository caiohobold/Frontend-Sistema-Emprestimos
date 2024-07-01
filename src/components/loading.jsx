import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

const Loading = () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80%', flexDirection: 'column' }}>
        <CircularProgress />
        <br />
        <div className='carregando-p'>Carregando...</div>
    </div>
);

export default Loading;