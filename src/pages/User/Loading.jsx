import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import styles from "./LoadingIndicator.module.scss";
import { useSelector } from "react-redux";

const LoadingIndicator = () => {
    const [dots, setDots] = useState(1);
    const lang = useSelector((state) => state.language.language);

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prevDots) => (prevDots === 3 ? 1 : prevDots + 1));
        }, 500);

        return () => clearInterval(interval);
    }, []);

    const getLoadingText = () => {
        let loading = "";
        if (lang === "en") {
            loading = "Loading";
        } else if (lang === "ru") {
            loading = "Загрузка";
        } else if (lang === "kg") {
            loading = "Жүктөө";
        }

        switch (dots) {
            case 1:
                return loading + '.';
            case 2:
                return loading + '..';
            case 3:
                return loading + '...';
            default:
                return loading;
        }
    };

    return (
        <div className={styles.loadingIndicator}>
            <div className={styles.circle}>
                <Box sx={{ display: 'flex' }}>
                    <CircularProgress />
                </Box>
            </div>
            <p>{getLoadingText()}</p>
        </div>
    );
};

export default LoadingIndicator;
