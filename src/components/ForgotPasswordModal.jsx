import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import emailServices from '../services/emailServices';
import { toast } from 'react-toastify';

const ForgotPasswordModal = ({ open, handleClose }) => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await emailServices.sendEmail(email);
            toast.success('Pronto! Enviamos para o seu e-mail uma nova senha de acesso!');
            handleClose();
        } catch (error) {
            toast.error('Não encontramos nenhum usuário cadastrado com este e-mail no WheelShare...');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={{ 
                position: 'absolute', 
                top: '50%', 
                left: '50%', 
                transform: 'translate(-50%, -50%)',
                width: '80vw', // Ajuste de largura para telas menores
                maxWidth: '400px', // Limite máximo de largura para desktops
                bgcolor: 'background.paper', 
                boxShadow: 24, 
                p: 4, 
                borderRadius: 3 
            }}>
                <Typography variant="h6" component="h2">
                    Vamos redefinir a senha!
                </Typography>
                <p>Digite o seu e-mail no campo abaixo e clique em Confirmar. </p>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="E-mail"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Enviando...' : 'Confirmar'}
                    </Button>
                </form>
            </Box>
        </Modal>
    );
};

export default ForgotPasswordModal;
