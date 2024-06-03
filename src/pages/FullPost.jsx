import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Box, Button } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';

import { Post } from "../components/Post";
import axios from "../redux/axios";
import AddComment from "../components/AddComment/index";
import ReactMarkdown from "react-markdown";
import { CommentsBlock } from "../components/CommentsBlock";
import { useSelector } from "react-redux";
import {Helmet} from "react-helmet";

export const FullPost = () => {
    const [data, setData] = useState(null);
    const [comments, setComments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { id } = useParams();
    const userData = useSelector((state) => state.auth.data);
    const lang = useSelector((state) => state.language.language)
    const storedLanguage = localStorage.getItem('selectedLanguage');

    const [language, setLanguage] = useState(storedLanguage);
    const handleStorageChange = () => {
        if (storedLanguage) {
            setLanguage(storedLanguage);
        }
    };

    useEffect(() => {
        handleStorageChange();
        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [lang]);
    useEffect(() => {
        if (data) {
            document.title = getTitleByLanguage();
        }
    }, [lang, data]);
    useEffect(() => {
        axios
            .get(`/posts/${id}`)
            .then((res) => {
                setData(res.data);
                setIsLoading(false);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [id, lang]);
    const getTitleByLanguage = (post) => {
        if (!post) return "";

        const { info_en, info_ru, info_kg } = post;

        if (lang === "en") {
            return info_en.title || info_ru.title;
        }

        if (lang === "kg") {
            return info_kg.title || info_ru.title;
        }

        return info_ru.title;
    };
    useEffect(() => {
        axios
            .get(`/posts/${id}/comments`)
            .then((res) => {
                setComments(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [id]);



    const formatDateTime = (dateTimeString) => {
        let months = [];
        let yearLanguage="";
        if(lang==="ru") {
            months = [
            "января", "февраля", "марта", "апреля", "мая", "июня",
            "июля", "августа", "сентября", "октября", "ноября", "декабря"
        ];
            yearLanguage="года"
        }
        if (lang === "en") {
            months = [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];
            yearLanguage="year"
        }
        if(lang==="kg") {
            months = [
            "Үчтүн Айы", "Бирдин Айы", "Жалган Куран", "Чын Куран", "Бугу", "Кулжа",
            "Теке", "Баш Оона", "Аяк Оона", "Тогуздун айы ", "Жетинин Айы", "Бештин Айы"
        ];
            yearLanguage="жылы"
        }
        const date = new Date(dateTimeString);
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        const hours = date.getHours();
        let minutes = date.getMinutes();
        if(minutes<=9) {minutes="0"+minutes}
        const formattedDateTime = `${day} ${month} ${year} ${yearLanguage} ${hours}:${minutes}`;
        return formattedDateTime;
    };



    const getTextByLanguage = (post) => {
        if (!post) return "";

        const { info_en, info_ru, info_kg } = post;

        if (lang === "en") {
            return info_en.text || info_ru.text;
        }

        if (lang === "kg") {
            return info_kg.text || info_ru.text;
        }

        return info_ru.text;
    };
    if (isLoading) {
        return <Post isLoading={isLoading} isFullPost />;
    }
    let BtnEdit="";
if (lang === "en"){
    BtnEdit="Edit"
}

if (lang === "kg"){
    BtnEdit="Түзөтүү"
    }

if (lang === "ru"){
    BtnEdit= "Редактировать"
    }
    return (
        <>
            <Helmet>
                <title>Страница поста</title>
            </Helmet>
            <Post
                id={data._id}
                title={getTitleByLanguage(data)}
                imageUrl={data.imageUrl ? `http://localhost:4444${data.imageUrl}` : undefined}
                user={data.user}
                createdAt={formatDateTime(data.createdAt)}
                viewsCount={data.viewsCount}
                commentsCount={data.commentsCount}
                tags={data.tags}
                isFullPost
            >
                {userData?._id === data?.user?._id && (
                    <Link to={`/post/${data._id}/edit`}>
                        <Box position="absolute" top={0} right={0} padding={1} zIndex={1}>
                            <Button style={{ fontSize: "20px" }} size="large" startIcon={<EditIcon />}>
                                {BtnEdit}
                            </Button>
                        </Box>
                    </Link>
                )}
                <ReactMarkdown children={getTextByLanguage(data)} />
            </Post>
            <CommentsBlock items={comments} isLoading={false}>
                <AddComment postId={id} setComments={setComments} />
            </CommentsBlock>
        </>
    );
};
