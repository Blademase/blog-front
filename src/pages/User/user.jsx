import * as React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchPosts, fetchTags } from "../../redux/slices/posts";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Grid from "@mui/material/Grid";
import { Post } from "../../components/Post";
import { Box } from "@mui/material";
import axios from "../../redux/axios";
import EditIcon from '@mui/icons-material/Edit';
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import styles from "./User.module.scss";
import loading from "./Loading";
import LoadingIndicator from "./Loading";
import {Helmet} from "react-helmet";

export const User = () => {
    const dispatch = useDispatch();
    const [userData, setUserData] = useState(null);
    const { posts, tags } = useSelector((state) => state.posts);
    const host = "http://localhost:4444";
    const inputFileRef = React.useRef(null);

    const usersPosts = posts.items.filter(post => post.user._id === userData?._id);
    const lang = useSelector((state) => state.language.language);
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
        if (posts) {
            document.title = getTitleByLanguage();
        }
    }, [lang, posts]);

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
    const formatDateTime = (dateTimeString) => {

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

    const [activeTab, setActiveTab] = useState(0);
    const [newLogin, setNewLogin] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [nameOfImage, setNameOfImage] = useState("");

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };
    let months = [];
    let yearLanguage = "";
    let active="";
    if (lang === "ru") {
        months = [
            "января", "февраля", "марта", "апреля", "мая", "июня",
            "июля", "августа", "сентября", "октября", "ноября", "декабря"
        ];
        yearLanguage = "года";
        active=`Активен с ${formatDateTime(userData?.createdAt)}`
    } else if (lang === "en") {
        months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        yearLanguage = "year";
        active=`Active since ${formatDateTime(userData?.createdAt)}`
    } else if (lang === "kg") {
        months = [
            "Үчтүн Айы", "Бирдин Айы", "Жалган Куран айы", "Чын Куран айы", "Бугу айы", "Кулжа айы",
            "Теке айы", "Баш Оона", "Аяк Оона айы", "Тогуздун айы ", "Жетинин Айы", "Бештин Айы"
        ];
        yearLanguage = "жылдан";
        active=`${formatDateTime(userData?.createdAt)} бери активдуу`
    }
    useEffect(() => {
        dispatch(fetchPosts());
        dispatch(fetchTags());
        fetchUserData();
    }, [dispatch]);

    const fetchUserData = async () => {
        try {
            const response = await axios.get("/auth/me");
            setUserData(response.data);
            setNewLogin(response.data.fullName);
            setNewEmail(response.data.email);
        } catch (error) {
            console.error(error);
        }
    };

    const isPostsLoading = posts.status === "loading";

    const handleLoginChange = (event) => {
        setNewLogin(event.target.value);
    };

    const handleEmailChange = (event) => {
        setNewEmail(event.target.value);
    };

    const handleEdit = async () => {
        try {
            const response = await axios.patch(`/auth/edit/user/${userData._id}`, { fullName: newLogin, email: newEmail });
            setIsEditing(false);
            setUserData(response.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append("image", file);
        setNameOfImage(file.name);

        try {
            const uploadResponse = await axios.post("/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            const newAvatarUrl = `/uploads/${file.name}`;
            await axios.patch(`/auth/edit/user/${userData._id}`, { avatarUrl: newAvatarUrl });
            setUserData((prevData) => ({
                ...prevData,
                avatarUrl: newAvatarUrl,
            }));
        } catch (error) {
            console.error("Error uploading image: ", error);
        }
    };

    if (!userData) {
        return <div>{<LoadingIndicator/>}</div>;
    }
    else if(userData) {
        return (
            <div className={styles.userPage}>
                <Helmet>
                    <title>Страница пользователя</title>
                </Helmet>
                <div className={styles.UserInfo}>
                    <div className={styles.UserInfoMain}>
                        <div
                            className={styles.avatar}
                            onClick={() => inputFileRef.current.click()}
                        >
                            {userData.avatarUrl ? (
                                <div style={{width: "100px", height: "100px"}}>
                                    <img
                                        style={{
                                            width: "100%",
                                            height: "100px",
                                            objectFit: "cover",
                                            borderRadius: "50%",
                                        }}
                                        src={`${host}${userData.avatarUrl}`}
                                        alt=""
                                    />
                                </div>
                            ) : (
                                <Avatar sx={{width: 100, height: 100}}/>
                            )}
                            <input
                                type="file"
                                ref={inputFileRef}
                                style={{display: "none"}}
                                onChange={handleImageUpload}
                            />
                        </div>

                        <div className={styles.userInfoText}>
                            {isEditing ? (
                                <div className={styles.editFields}>
                                    <div className={styles.editLoginField}>
                                        <input
                                            type="text"
                                            value={newLogin}
                                            onChange={handleLoginChange}
                                            placeholder="Введите новый логин"
                                        />
                                    </div>
                                    <div className={styles.editEmailField}>
                                        <input
                                            type="email"
                                            value={newEmail}
                                            onChange={handleEmailChange}
                                            placeholder="Введите новую электронную почту"
                                        />
                                    </div>
                                    <div className={styles.editIcon}>
                                        <Button onClick={handleEdit} sx={{height: "30px"}}>Сохранить</Button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className={styles.userName}>
                                        {userData?.fullName}
                                    </div>
                                    <div className={styles.userEmail}>
                                        {userData?.email}
                                    </div>
                                    <div className={styles.editIcon} onClick={() => setIsEditing(true)}>
                                        <EditIcon sx={{color: 'blue'}}/>
                                    </div>
                                </>
                            )}
                            <div className={styles.userCreated}>
                                {active}
                            </div>
                        </div>
                    </div>

                    <div>
                        <Tabs
                            style={{marginBottom: 15}}
                            value={activeTab}
                            onChange={handleTabChange}
                            aria-label="basic tabs example"
                        >
                            <Tab label="По дате"/>
                            <Tab label="Популярные"/>
                        </Tabs>
                        <Grid container spacing={4}>
                            <Grid xs={10} item>
                                {usersPosts.length === 0 ? (
                                    <Box textAlign="center" mt={3} mb={3}>
                                        У вас пока нет постов.
                                    </Box>
                                ) : (
                                    activeTab === 0 && usersPosts.slice().reverse().map((obj, index) =>
                                        isPostsLoading ? (
                                            <Post key={index} isLoading={true}/>
                                        ) : (
                                            <Post
                                                id={obj._id}
                                                title={getTitleByLanguage(obj)}
                                                imageUrl={obj.imageUrl ? host + obj.imageUrl : ""}
                                                user={obj.user}
                                                createdAt={formatDateTime(obj.createdAt)}
                                                viewsCount={obj.viewsCount}
                                                commentsCount={obj.commentsCount}
                                                tags={obj.tags}
                                                isEditable={userData?._id && (userData?._id === obj.user._id || userData?.email === "admin@admin.kg")}
                                            />
                                        )
                                    )
                                )}
                                {activeTab === 1 && usersPosts.slice().sort((a, b) => b.viewsCount - a.viewsCount).map((obj, index) =>
                                    isPostsLoading ? (
                                        <Post key={index} isLoading={true}/>
                                    ) : (
                                        <Post
                                            id={obj._id}
                                            title={obj.title}
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
                            </Grid>
                        </Grid>
                    </div>
                </div>
            </div>
        );
    }}
