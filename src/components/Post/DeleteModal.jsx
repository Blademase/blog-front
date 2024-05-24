import React from "react";
import {useDispatch, useSelector} from "react-redux";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import { fetchRemovePost } from "../../redux/slices/posts";
import ReportIcon from '@mui/icons-material/Report';
export const DeleteModal = ({ postId, onClose }) => {
    const dispatch = useDispatch();
    const onClickRemove = () => {
        dispatch(fetchRemovePost(postId));
        onClose(); // Закрытие модального окна после удаления
    };
    const lang = useSelector((state) => state.language.language);
    let text= "";
    let BtnCancel= "";
    let BtnDelete= "";
    let attention="";
    if (lang==="en") {
        text="Are you sure you want to delete the article?";
        BtnCancel="Cancel";
        BtnDelete="Delete";
        attention="Attention"
    }
    if (lang==="kg") {
        text="Макаланы чын эле очургуңуз келеби?";
        BtnCancel="Жокко чыгаруу";
        BtnDelete="Өчууру";
        attention="Көңүл буруңуз"
    }
    if (lang==="ru") {
        text="Вы действительно хотите удалить статью?";
        BtnCancel="Отмена";
        BtnDelete="Удалить"
        attention="Внимание"
    }

    return (
        <Modal open={true} onClose={onClose} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px'}}>
                <h2 style={{ display:'flex',justifyContent:'center',alignItems:'center',color:'red',gap:'10px'}}><ReportIcon fontSize={"large"}/>
                    {attention}</h2>
                <p>{text}</p>
                <div style={{ display: 'flex', gap:'15px',justifyContent:'center' }}>
                    <Button onClick={onClose} variant="contained">
                        {BtnCancel}
                    </Button>
                    <Button onClick={onClickRemove} variant="contained" style={{ color:"white",backgroundColor:"red" }} >
                        {BtnDelete}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
