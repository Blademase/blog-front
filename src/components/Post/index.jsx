import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import clsx from "clsx";
import { Link } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import EyeIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import CommentIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";

import styles from "./Post.module.scss";
import { UserInfo } from "../UserInfo";
import { PostSkeleton } from "./Skeleton";
import { DeleteModal } from "./DeleteModal"; // Импорт модального окна удаления

export const Post = ({
                         id,
                         title,
                         createdAt,
                         imageUrl,
                         user,
                         viewsCount,
                         commentsCount,
                         tags,
                         children,
                         isFullPost,
                         isLoading,
                         isEditable,
                     }) => {
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false); // Состояние для открытия/закрытия модального окна удаления
    const dispatch = useDispatch();
    const [imageExists, setImageExists] = useState(true); // Состояние для проверки наличия изображения

    useEffect(() => {
        const checkImageExists = async (imageUrl) => {
            try {
                const response = await fetch(imageUrl, {
                    method: "HEAD", // Отправляем только заголовки без тела запроса
                });

                setImageExists(response.ok); // Обновляем состояние наличия изображения
            } catch (error) {
                console.error("Ошибка при проверке изображения:", error);
                setImageExists(false); // В случае ошибки считаем, что изображение отсутствует
            }
        };

        if (imageUrl) {
            checkImageExists(imageUrl);
        }
    }, [imageUrl]);

    const onClickRemove = () => {
        setDeleteModalOpen(true); // Открытие модального окна при удалении
    };

    if (isLoading) {
        return <PostSkeleton />;
    }

    return (
        <div className={clsx(styles.root, { [styles.rootFull]: isFullPost })}>
            {isEditable && (
                <div className={styles.editButtons}>
                    <Link to={`/post/${id}/edit`}>
                        <IconButton color="primary">
                            <EditIcon />
                        </IconButton>
                    </Link>
                    <IconButton onClick={onClickRemove} color="secondary">
                        <DeleteIcon />
                    </IconButton>
                </div>
            )}
            {imageExists && imageUrl && (
                <img
                    className={clsx(styles.image, { [styles.imageFull]: isFullPost })}
                    src={imageUrl}
                    alt={tags}
                />
            )}
            <div className={styles.wrapper}>
                <UserInfo {...user} additionalText={createdAt} />
                <div className={styles.indention}>
                    <h2 className={clsx(styles.title, { [styles.titleFull]: isFullPost })}>
                        {isFullPost ? title : <Link to={`/post/${id}`}>{title}</Link>}
                    </h2>
                    <ul className={styles.tags}>
                        {tags.map((name) => (
                            <li key={name}>
                                <Link to={`/tags/${name}`}>{name}</Link>
                            </li>
                        ))}
                    </ul>
                    {children && <div className={styles.content}>{children}</div>}
                    <ul className={styles.postDetails}>
                        <li>
                            <EyeIcon />
                            <span>{viewsCount}</span>
                        </li>
                        <li>
                            <CommentIcon />
                            <span>{commentsCount}</span>
                        </li>
                    </ul>
                </div>
            </div>
            {isDeleteModalOpen && (
                // Отображение модального окна при isDeleteModalOpen === true
                <DeleteModal postId={id} onClose={() => setDeleteModalOpen(false)} />
            )}
        </div>
    );
};
