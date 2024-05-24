import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import styles from "./Error.module.scss"

const ErrorModal = ({ error, onClose }) => {
    return (
        <Modal
            open={Boolean(error && error.length > 0)}
            onClose={onClose}
            aria-labelledby="error-modal-title"
            aria-describedby="error-modal-description"
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4
            }}>
                <Typography id="error-modal-title" variant="h6" component="h2" sx={{
                    display:"flex",
                    alignItems:"center",
                    gap:"10px",
                    color:"red",
                    justifyContent:"center",
                    fontSize:"25px"
                }}>
                   <WarningAmberIcon/> Ошибка
                </Typography>
                {error && error.length > 0 && (
                    <Typography id="error-modal-description" sx={{ mt: 1 }}>
                        {error.map((err, index) => (
                            <div key={index}>
                                <Typography sx={{
                                    marginBottom:"5px"
                                }}>
                                    {err.msg}
                                </Typography>
                            </div>
                        ))}
                    </Typography>
                )}
                <p className={styles.btnCloseRlc}>
                <Button onClick={onClose} className={styles.btnClose}>
                    Закрыть
                </Button>
                </p>
            </Box>
        </Modal>
    );
};

export default ErrorModal;
