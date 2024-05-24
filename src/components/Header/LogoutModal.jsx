import React, { useState } from "react";
import {useDispatch, useSelector} from "react-redux";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import styles from "./LogoutModal.module.scss";
import { logout } from "../../redux/slices/auth";
import ReportIcon from '@mui/icons-material/Report';
export const LogoutModal = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const lang = useSelector((state) => state.language.language);

    const handleLogout = () => {
        dispatch(logout());
        window.localStorage.removeItem("token");
        onClose();
    };
    let attention="";
    let text="";
    let BtnExit="";
    let BrnCancel="";
    if(lang==="en"){
        attention="Attention"
        text="Are you sure you want to leave?"
        BtnExit="Exit";
        BrnCancel="Cancel"
    }
    if(lang==="ru"){
        attention="Внимание"
        text="Вы действительно хотите выйти?"
        BtnExit="Выйти";
        BrnCancel="Отмена"
    }
    if(lang==="kg"){
        attention="Көңүл буруңуз"
        text="Чын эле кеткиңиз келеби?"
        BtnExit="Чыгуу";
        BrnCancel="Жокко чыгаруу"
    }

    return (
        <Modal open={isOpen} onClose={onClose}>
            <div className={styles.modal}>
                <p className={styles.attention}>
                    <ReportIcon fontSize={"largeuseUtilityClasses"}/>
                    {attention}
                </p>

                <h2>{text}</h2>
                <div className={styles.buttons}>
                    <Button variant="contained" color="primary" onClick={onClose}>
                        {BrnCancel}
                    </Button>
                    <Button variant="contained" color="error" onClick={handleLogout}>
                        {BtnExit}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
