import React, { useState, useEffect } from "react";
import { SideBlock } from "./SideBlock";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "../redux/axios";
import { useSelector } from "react-redux";
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

const host = "http://localhost:4444";

export const CommentsBlock = ({ items, children }) => {
    const currentPath = window.location.pathname;
    const Path = currentPath.replace("/post", "/posts");
    const userData = useSelector((state) => state.auth.data);
    const [comments, setComments] = useState([]); // Используем items как начальное значение для комментариев
    const [loadingStates, setLoadingStates] = useState({}); // Track loading states for each comment
    const lang = useSelector((state) => state.language.language);
    let title = "";
    if (lang === "en") { title = "Comments" }
    if (lang === "ru") { title = "Комментарии" }
    if (lang === "kg") { title = "Комментарийлер" }

    useEffect(() => {
        if (items && Array.isArray(items)) {
            setComments(items);
        }
    }, [items]);
    // http://localhost:4444/posts/664ee012e2a8f8ef77bd37b5/comments/664ee1a3e2a8f8ef77bd3801
    console.log(userData)
    const handleDeleteComment = (commentId, authorId, postId) => {
        if (userData?.email === authorId || userData?.email === "admin@admin.kg") {
            setLoadingStates(prevState => ({ ...prevState, [commentId]: true }));

            let URL;
            if (Path.length === 1) {
                URL = "posts/" + postId + Path + "comments/" + commentId;
            } else {
                URL = Path + "/comments/" + commentId;
            }

            axios
                .delete(`${URL}`)
                .then(response => {
                    console.log("Комментарий успешно удален:", response.data);
                    // Обновляем список комментариев, удалив удаленный комментарий
                    const updatedComments = comments.filter(comment => comment._id !== commentId);
                    setComments(updatedComments);
                })
                .catch(error => {
                    console.error("Ошибка при удалении комментария:", error);
                })
                .finally(() => {
                    setLoadingStates(prevState => ({ ...prevState, [commentId]: false }));
                });
        } else {
            alert("Вы не можете удалить этот комментарий, так как вы не его автор.");
            console.log(authorId);
        }
    };

    return (
        <SideBlock title={title}>
            <List>
                {comments.map((obj, index) => (
                    <React.Fragment key={index}>
                        <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                                <Avatar
                                    alt={obj?.user.fullName}
                                    src={`${host}${obj?.user.avatarUrl}`}
                                />
                            </ListItemAvatar>
                            <ListItemText
                                primary={obj?.user.fullName}
                                secondary={obj?.text}
                            />
                            {(userData?.email === obj?.user.email || userData?.email === "admin@admin.kg") && (
                                <IconButton
                                    edge="end"
                                    aria-label="delete"
                                    onClick={() => handleDeleteComment(obj?._id, obj?.user.email, obj?.post)}
                                >
                                    {loadingStates[obj._id] ? (
                                        <CircularProgress size={24} />
                                    ) : (
                                        <DeleteIcon />
                                    )}
                                </IconButton>
                            )}
                        </ListItem>
                        <Divider variant="inset" component="li" />
                    </React.Fragment>
                ))}
            </List>
            {children}
        </SideBlock>
    );
};
