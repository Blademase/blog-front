import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";
import axios from "../redux/axios";
import { useDispatch, useSelector } from "react-redux";
import Button from "@mui/material/Button";
import { Post } from "../components/Post";
import { TagsBlock } from "../components/TagsBlock";
import { CommentsBlock } from "../components/CommentsBlock";
import { fetchPosts, fetchTags } from "../redux/slices/posts";
import { Box } from "@mui/material";
import TextField from "@mui/material/TextField";
import SendIcon from '@mui/icons-material/Send';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LoadingIndicator from "./User/Loading";
import {Helmet} from "react-helmet";

const ReviewModal = ({ isOpen, onClose }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [review, setReview] = useState("");
    const lang = useSelector((state) => state.language.language);

    let rewiev = "";
    let send = "";
    let placeholderName = "";
    let placeholderEmail = "";
    let placeholderFeedback = "";

    if (lang === "en") {
        rewiev = "Leave feedback";
        send = "Send";
        placeholderName = "Full name";
        placeholderEmail = "Email";
        placeholderFeedback = "Feedback"
    } else if (lang === "ru") {
        rewiev = "Оставить отзыв";
        send = "Отправить";
        placeholderName = "Имя";
        placeholderEmail = "Почта";
        placeholderFeedback = "Отзыв"
    } else if (lang === "kg") {
        rewiev = "Пикир калтыруу";
        send = "Жөнөтүү";
        placeholderName = "Толук атыңыз";
        placeholderEmail = "Почтаңыз";
        placeholderFeedback = "Пикир"
    }

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleReviewChange = (event) => {
        setReview(event.target.value);
    };

    const handleSendReview = () => {
        // Отправить отзыв на сервер или обработать его
        onClose();
    };

    return (

        <Modal
            open={isOpen}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 3 }}>
                <h2 id="modal-modal-title">{rewiev}</h2>
                <TextField
                    label={placeholderName}
                    value={name}
                    onChange={handleNameChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label={placeholderEmail}
                    value={email}
                    onChange={handleEmailChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label={placeholderFeedback}
                    value={review}
                    onChange={handleReviewChange}
                    fullWidth
                    margin="normal"
                    multiline
                    rows={4}
                />
                <Button
                    variant="contained"
                    endIcon={<SendIcon />}
                    onClick={handleSendReview}
                    disabled={!name || !email || !review}
                >
                    {send}
                </Button>
            </Box>
        </Modal>
    );
};

export const Home = () => {
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const lang = useSelector((state) => state.language.language);

    const dispatch = useDispatch();
    const { posts, tags } = useSelector((state) => state.posts);
    const userData = useSelector((state) => state.auth.data);
    const isPostsLoading = posts.status === "loading";
    const isTagsLoading = tags.status === "loading";
    const [activeTab, setActiveTab] = useState(0);
    const [loadedPosts, setLoadedPosts] = useState([]);
    const [totalPostsCount, setTotalPostsCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

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
        if (posts.items.length) {
            document.title = getTitleByLanguage(posts.items[0]);
        }
    }, [lang, posts]);

    useEffect(() => {
        dispatch(fetchPosts());
        dispatch(fetchTags());
    }, [dispatch]);

    useEffect(() => {
        if (!isPostsLoading) {
            const sortedPosts = activeTab === 1
                ? posts.items.slice().sort((a, b) => b.viewsCount - a.viewsCount)
                : posts.items.slice().reverse();
            setLoadedPosts(sortedPosts.slice(0, currentPage * 3));
            setTotalPostsCount(posts.items.length);
        }
    }, [isPostsLoading, posts.items, currentPage, activeTab]);

    const [comments, setComments] = useState([]);

    useEffect(() => {
        axios
            .get("/comments/last")
            .then((res) => {
                setComments(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const host = "http://localhost:4444";

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
        setCurrentPage(1); // Reset page when changing tabs
    };

    const handleScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        if (scrollTop + clientHeight >= scrollHeight - 10 && loadedPosts.length < totalPostsCount) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [loadedPosts.length, totalPostsCount]);

    const formatDateTime = (dateTimeString) => {
        let months = [];
        let yearLanguage = "";
        if (lang === "ru") {
            months = [
                "января", "февраля", "марта", "апреля", "мая", "июня",
                "июля", "августа", "сентября", "октября", "ноября", "декабря"
            ];
            yearLanguage = "года";
        } else if (lang === "en") {
            months = [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];
            yearLanguage = "year";
        } else if (lang === "kg") {
            months = [
                "Үчтүн Айы", "Бирдин Айы", "Жалган Куран айы", "Чын Куран айы", "Бугу айы", "Кулжа айы",
                "Теке айы", "Баш Оона", "Аяк Оона айы", "Тогуздун айы ", "Жетинин Айы", "Бештин Айы"
            ];
            yearLanguage = "жылы";
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

    let email = "";
    let phone = "";
    let location = "";
    let time = "";
    let button = "";
    let tabNewLabel = "";
    let tabPopularLabel = "";
    let tabContactsLabel = "";
    if (lang === "en") {
        email = "E-mail";
        phone = "Our number";
        location = "Our location";
        time = "Work time: Mon.-Fri.";
        button = "Leave feedback";
        tabNewLabel = "New";
        tabPopularLabel = "Popular";
        tabContactsLabel = "Contacts";
    } else if (lang === "ru") {
        email = "Наша почта";
        phone = "Наш телефонный номер";
        location = "Наше местоположение";
        time = "Наше рабочее время: Пн.-Пт.";
        button = "Оставить отзыв";
        tabNewLabel = "Новые";
        tabPopularLabel = "Популярные";
        tabContactsLabel = "Контакты";
    } else if (lang === "kg") {
        email = "Почтабыз";
        phone = "Биздин телефон номерибиз";
        location = "Биздин жайгашкан жерибиз";
        time = "Биздин иш убактысы: Дүй.-Жу.";
        button = "Пикир калтыруу";
        tabNewLabel = "Жаңы";
        tabPopularLabel = "Популярдуу";
        tabContactsLabel = "Байланыштар";
    }

    const handleReviewModalOpen = () => {
        setReviewModalOpen(true);
    };

    const handleReviewModalClose = () => {
        setReviewModalOpen(false);
    };

    if (posts.status === "loading") {
        return <LoadingIndicator />
    }

    console.log(posts);
    return (
        <>
            <Helmet>
                <title>Главная страница</title>
            </Helmet>
            <Tabs
                style={{ marginBottom: 15 }}
                value={activeTab}
                onChange={handleTabChange}
                aria-label="basic tabs example"
            >
                <Tab label={tabNewLabel} />
                <Tab label={tabPopularLabel} />
                <Tab label={tabContactsLabel} />
            </Tabs>
            <Grid container spacing={4}>
                <Grid xs={8} item>
                    {activeTab === 0 && loadedPosts.map((obj, index) =>
                        isPostsLoading ? (
                            <Post key={index} isLoading={true} />
                        ) : (
                            <Post
                                key={obj._id}
                                id={obj._id}
                                title={getTitleByLanguage(obj)}
                                imageUrl={obj.imageUrl ? host + obj.imageUrl : ""}
                                user={obj.user}
                                createdAt={formatDateTime(obj.createdAt)}
                                viewsCount={obj.viewsCount}
                                commentsCount={obj.commentsCount}
                                tags={obj.tags}
                                isEditable={userData?._id && (userData?._id === obj.user._id || userData?._id === "664d8fb8cfa4451ab0217efa")}
                            />
                        )
                    )}
                    {activeTab === 1 && loadedPosts.map((obj, index) =>
                        isPostsLoading ? (
                            <Post key={index} isLoading={true} />
                        ) : (
                            <Post
                                key={obj._id}
                                id={obj._id}
                                title={getTitleByLanguage(obj)}
                                imageUrl={obj.imageUrl ? host + obj.imageUrl : ""}
                                user={obj.user}
                                createdAt={formatDateTime(obj.createdAt)}
                                viewsCount={obj.viewsCount}
                                commentsCount={obj.commentsCount}
                                tags={obj.tags}
                                isEditable={userData?._id && userData?._id === obj.user._id}
                            />
                        )
                    )}
                    {activeTab === 2 && (
                        <Box sx={{ display: 'grid', gridTemplateRows: 'repeat(3, 1fr)' }}>
                            <span style={{ display: 'flex', alignItems: 'center', paddingBottom: "10px" }}>
                                <AlternateEmailIcon />
                                <span style={{ marginLeft: '5px' }}>
                                    {email}: example@example.com
                                </span>
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', paddingBottom: "10px" }}>
                                <LocalPhoneIcon />
                                <span style={{ marginLeft: '5px' }}>
                                    {phone}: +996 (509) 54 44 69
                                </span>
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', paddingBottom: "10px" }}>
                                <FmdGoodIcon />
                                <span style={{ marginLeft: '5px' }}>
                                    {location}: Кыргызстан, Бишкек, Исанова 77
                                </span>
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', paddingBottom: "10px" }}>
                                <AccessTimeIcon />
                                <span style={{ marginLeft: '5px' }}>
                                    {time} 9:00-18:00
                                </span>
                            </span>
                            <Button
                                size="medium"
                                variant="contained"
                                endIcon={<SendIcon />}
                                sx={{ width: 'fit-content', margin: 'start' }}
                                onClick={handleReviewModalOpen}
                            >
                                {button}
                            </Button>
                            <ReviewModal isOpen={reviewModalOpen} onClose={handleReviewModalClose} />
                        </Box>
                    )}
                </Grid>
                <Grid xs={4} item>
                    <TagsBlock items={tags.items} isLoading={isTagsLoading} />
                    <CommentsBlock items={comments} isLoading={isPostsLoading} />
                </Grid>
            </Grid>
        </>
    );
};
