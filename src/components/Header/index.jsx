import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { selectIsAuth } from "../../redux/slices/auth";
import styles from "./Header.module.scss";
import Avatar from "@mui/material/Avatar";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Modal from "@mui/material/Modal";
import { Box } from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { LogoutModal } from "./LogoutModal";
import {setLanguageHandler} from "../../redux/slices/language"
export const Header = () => {
    const [language, setLanguage] = useState('ru');
    const dispatch = useDispatch();

    const handleChange = (event) => {
        const selectedLanguage = event.target.value;
        dispatch(setLanguageHandler(selectedLanguage));
        setLanguage(selectedLanguage)
    };


    const userData = useSelector((state) => state.auth.data);
    const isAuth = useSelector(selectIsAuth);
    const host = "http://localhost:4444";
    const [showProfileOptionsLeft, setshowProfileOptionsLeft] = useState();
    const [showProfileOptions, setShowProfileOptions] = useState(false); // Состояние для отображения кнопок профиля
    const arrowButtonRef = useRef(null); // Создаем ref для кнопки

    // Функции для управления модальным окном выхода
    const [logoutModalOpen, setLogoutModalOpen] = useState(false);
    const handleLogoutModalOpen = () => {
        setLogoutModalOpen(true);
    };
    const handleLogoutModalClose = () => {
        setLogoutModalOpen(false);
    };

    useEffect(() => {
        if (arrowButtonRef.current) {
            const rect = arrowButtonRef.current.getBoundingClientRect();
            setshowProfileOptionsLeft(rect.left);
        }
    }, [showProfileOptions]); // Зависимость от showProfileOptions, чтобы обновлять при изменении

    const handleToggleProfileOptions = () => {
        setShowProfileOptions(!showProfileOptions);
    };
    let writeArticle="";
    let enter="";
    let createAccount="";
    let profile="";
    let exit="";
    if (language==="en"){
        writeArticle="Сreate an article";
        enter="Login";
        createAccount="Create an account";
        profile="Profile";
        exit="Logout";
    }
    if (language==="ru"){
        writeArticle="Написать статью";
        enter="Войти";
        createAccount="Создать аккаунт";
        profile="Профиль";
        exit="Выйти";
    }
    if (language==="kg"){
        writeArticle="Макала жазуу";
        enter="Кирүү";
        createAccount="Аккаунт түзүү";
        profile="Профиль";
        exit="Чыгуу";
    }
    return (
        <div className={styles.root}>
            <Container maxWidth="lg">
                <div className={styles.inner}>
                    <div className={styles.leftRow}>
                        <Link to="/" className={styles.logoContainer}>
                            <div className={styles.logo}>BLOGUS</div>
                        </Link>
                    </div>
                    <div className={styles.rightRow}>
                        <div className={styles.buttons}>
                            {isAuth ? (
                                <>
                                    <Link to="/add-post">
                                        <Button variant="contained">{writeArticle}</Button>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link to="/login">
                                        <Button variant="outlined">{enter}</Button>
                                    </Link>
                                    <Link to="/register">
                                        <Button variant="contained">{createAccount}</Button>
                                    </Link>
                                </>
                            )}
                        </div>
                        <Box>
                            <FormControl  sx={{width: 70}} size="small">
                                <InputLabel id="demo-simple-select-label"></InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={language}
                                    onChange={handleChange}
                                >
                                    <MenuItem value="ru">РУ</MenuItem>
                                    <MenuItem value="en">EN</MenuItem>
                                    <MenuItem value="kg">КГ</MenuItem>

                                </Select>
                            </FormControl>
                        </Box>
                        {userData && (
                            <div className={styles.userInfo}>
                                <Avatar
                                    src={userData.avatarUrl ? host + userData.avatarUrl : ""}
                                    alt="/broken-image.jpg"
                                />
                                <button
                                    ref={arrowButtonRef} // Привязываем ref к кнопке
                                    className={styles.arrowButton}
                                    style={{
                                        width: "30px",
                                        height: "30px",
                                        minWidth: "unset",
                                        minHeight: "unset",
                                        padding: "0",
                                        transform: showProfileOptions ? 'rotate(180deg)' : 'none',
                                        transition: 'transform 0.3s ease-in-out',
                                        backgroundColor: 'transparent', // Прозрачный фон
                                        outline: 'none', // Убираем обводку
                                        border: 'none',
                                        color: '#4361ee',
                                        position: 'relative', // Относительное позиционирование
                                        zIndex: 1, // Чтобы кнопка была выше модального окна
                                        marginBottom: '10px' // Для отступа между кнопкой и модальным окном
                                    }}
                                    onClick={handleToggleProfileOptions}
                                >
                                    <KeyboardArrowDownIcon sx={{fontSize: "26px"}}/>
                                </button>
                            </div>
                        )}

                    </div>
                </div>
            </Container>
            <Modal
                open={showProfileOptions}
                onClose={() => setShowProfileOptions(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                BackdropProps={{
                    style: {backgroundColor: "transparent"}
                }}
            >

                <Box sx={{
                    position: 'fixed', // Фиксированное позиционирование
                    top: 'calc(100% - 95vh)', // Расположение под кнопкой стрелка вниз
                    left: `${showProfileOptionsLeft}px`,
                    width: 138,
                    boxShadow: '24px 38px 32px rgba(0,0,0,0.2)', // Пример тени
                    bgcolor: 'background.paper',
                    p: 1,
                    borderRadius: 3,
                }}>
                    <div className={styles.modalBtns}>
                        <Link to="/user" style={{ gap: '10px',width:'120px' }}>
                            <PersonOutlineIcon  /> {profile}
                        </Link>
                        <Button sx={{ gap: '10px',width:'120px' }} className={styles.ModalBtnExit} onClick={handleLogoutModalOpen}>
                            <LogoutIcon /> {exit}
                        </Button>
                    </div>
                </Box>
            </Modal>

            <LogoutModal isOpen={logoutModalOpen} onClose={handleLogoutModalClose}/>
        </div>
    );
};
