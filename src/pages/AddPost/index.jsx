import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import SimpleMDE from "react-simplemde-editor";
import { useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "../../redux/axios";
import "easymde/dist/easymde.min.css";
import styles from "./AddPost.module.scss";
import { selectIsAuth } from "../../redux/slices/auth";
import ButtonGroup from "@mui/material/ButtonGroup";
import ErrorModal from "./ErrorModal"; // Импортируем модальное окно

export const AddPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isAuth = useSelector(selectIsAuth);
    const isEditing = Boolean(id);
    const [selectedLang, setSelectedLang] = useState("RU");
    const [isLoading, setIsLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const [title, setTitle] = useState({ EN: "", RU: "", KG: "" });
    const [text, setText] = useState({ EN: "", RU: "", KG: "" });
    const [tags, setTags] = useState([]);
    const inputFileRef = useRef(null);
    const lang = useSelector((state) => state.language.language);
    const [logoutModalOpen, setLogoutModalOpen] = useState(false);
    const handleLogoutModalOpen = () => {
        setLogoutModalOpen(true);
    };
    const handleLogoutModalClose = () => {
        setLogoutModalOpen(false);
    };

    const [error, setError] = useState(null); // Состояние для ошибки
    const [errorModalOpen, setErrorModalOpen] = useState(false); // Состояние для отображения модального окна

    const handleErrorModalClose = () => {
        setErrorModalOpen(false);
    };

    const handleChangeFile = async (event) => {
        try {
            const file = event.target.files[0];
            const formData = new FormData();
            formData.append("image", file);
            const { data } = await axios.post("/upload", formData);
            setImageUrl(data.url);
        } catch (err) {
            console.log(err);
            setError(err.response?.data);
            setErrorModalOpen(true);
        }
    };

    const onClickRemoveImage = () => {
        setImageUrl("");
    };

    const onChange = useCallback((value) => {
        setText((prevText) => ({ ...prevText, [selectedLang]: value }));
    }, [selectedLang]);

    const onSubmit = async () => {
        try {
            setIsLoading(true);

            const fields = {
                info_ru: {
                    title: title.RU,
                    text: text.RU,
                },
                info_kg: {
                    title: title.KG,
                    text: text.KG,
                },
                info_en: {
                    title: title.EN,
                    text: text.EN,
                },
                imageUrl,
                tags: tags.join(","),
            };

            const { data } = isEditing
                ? await axios.patch(`/posts/${id}`, fields)
                : await axios.post("/posts", fields);

            const _id = isEditing ? id : data._id;

            navigate(`/post/${_id}`);
        } catch (err) {
            console.warn(err);
            setError(err.response?.data);
            setErrorModalOpen(true);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            axios.get(`/posts/${id}`).then(({ data }) => {
                setTitle({
                    EN: data.info_en.title,
                    RU: data.info_ru.title,
                    KG: data.info_kg.title,
                });
                setText({
                    EN: data.info_en.text,
                    RU: data.info_ru.text,
                    KG: data.info_kg.text,
                });
                setImageUrl(data.imageUrl);
                setTags(data.tags);
            }).catch((err) => {
                console.warn(err);
            });
        }
    }, [id]);

    const options = useMemo(() => ({
        spellChecker: false,
        maxHeight: "400px",
        autofocus: true,
        placeholder: selectedLang === "RU" ? 'Текст' :
            selectedLang === "EN" ? 'Text' :
                selectedLang === "KG" ? 'Текст' :
                    '',
        status: false,
        autosave: {
            enabled: true,
            delay: 1000,
        },
    }), [selectedLang]);

    if (!window.localStorage.getItem("token") && !isAuth) {
        return <Navigate to="/" />;
    }

    const handleAddTag = (tag) => {
        if (tag && tag !== "#" && !tags.includes(tag)) {
            setTags([...tags, tag]);
        }
    };

    const handleDeleteTag = (tagToDelete) => {
        setTags(tags.filter((tag) => tag !== tagToDelete));
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && e.target.value.trim() !== "#" && e.target.value.trim() !== "") {
            handleAddTag(e.target.value.trim());
            e.target.value = "";
        }
    };

    const handleLangClick = (lang) => {
        setSelectedLang(lang);
    }

    let BtnRu = "";
    let BtnKg = "";
    let BtnEn = "";
    let BtnPrewiev = "";
    let Tags = "";
    let BtnSave = "";
    let BtnCancel = "";
    let Prewiev = "";
    let BtnPublish = "";
    let BtnDelete = "";

    if (selectedLang === "EN") {
        BtnRu = "РУ";
        BtnKg = "КГ";
        BtnEn = "EN";
        BtnPrewiev = "Article image";
        Prewiev = "Article title";
        Tags = "Tags";
        BtnSave = "Save";
        BtnPublish = "Publish";
        BtnCancel = "Cancel";
        BtnDelete = "Delete";
    }
    if (selectedLang === "RU") {
        BtnRu = "РУ";
        BtnKg = "КГ";
        BtnEn = "EN";
        BtnPrewiev = "Изображение статьи";
        Prewiev = "Заголовок статьи";
        Tags = "Тэги";
        BtnSave = "Сохранить";
        BtnPublish = "Опубликовать";
        BtnCancel = "Отмена";
        BtnDelete = "Удалить";
    }
    if (selectedLang === "KG") {
        BtnRu = "РУ";
        BtnKg = "КГ";
        BtnEn = "EN";
        BtnPrewiev = "Макаланын сүрөтү";
        Prewiev = "Макаланын аталышы";
        Tags = "Тегдер";
        BtnSave = "Сактоо";
        BtnPublish = "Жарыялоо";
        BtnCancel = "Жокко чыгаруу";
        BtnDelete = "Өчүрүү";
    }

    return (
        <Paper style={{ padding: 30 }}>
            <div className="LanguageSelector">
                <ButtonGroup variant="outlined" aria-label="Basic Tags group">
                    <Button
                        onClick={() => handleLangClick("EN")}
                        style={{
                            backgroundColor: selectedLang === "EN" ? "#4361ee" : "transparent",
                            color: selectedLang === "EN" ? "white" : "black",
                            fontWeight: selectedLang === "EN" ? "bold" : "normal",
                        }}
                    >
                        {BtnEn}
                    </Button>
                    <Button
                        onClick={() => handleLangClick("RU")}
                        style={{
                            backgroundColor: selectedLang === "RU" ? "#4361ee" : "transparent",
                            color: selectedLang === "RU" ? "white" : "black",
                            fontWeight: selectedLang === "RU" ? "bold" : "normal",
                        }}
                    >
                        {BtnRu}
                    </Button>
                    <Button
                        onClick={() => handleLangClick("KG")}
                        style={{
                            backgroundColor: selectedLang === "KG" ? "#4361ee" : "transparent",
                            color: selectedLang === "KG" ? "white" : "black",
                            fontWeight: selectedLang === "KG" ? "bold" : "normal",
                        }}
                    >
                        {BtnKg}
                    </Button>
                </ButtonGroup>
            </div>

            <Button
                onClick={() => inputFileRef.current.click()}
                variant="outlined"
                size="large"
                sx={{ marginTop: '10px' }}
            >
                {BtnPrewiev}
            </Button>
            {imageUrl && (
                <>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={onClickRemoveImage}
                        style={{ marginBottom: '8px' }}
                        sx={{
                            marginLeft: '10px',
                            height: '41px',
                            marginTop: '17px'
                        }}
                    >
                        {BtnDelete}
                    </Button>

                    <img
                        className={styles.image}
                        src={`http://localhost:4444${imageUrl}`}
                        alt="Uploaded"
                    />
                </>
            )}
            <input
                type="file"
                ref={inputFileRef}
                onChange={handleChangeFile}
                hidden
            />

            <br /><br />

            <TextField
                classes={{ root: styles.title }}
                variant="standard"
                placeholder={Prewiev}
                fullWidth
                value={title[selectedLang]}
                onChange={(e) => setTitle((prevTitle) => ({ ...prevTitle, [selectedLang]: e.target.value }))}
            />
            <TextField
                classes={{ root: styles.tags }}
                variant="standard"
                placeholder={Tags}
                fullWidth
                onKeyPress={handleKeyPress}
                style={{ marginBottom: "8px" }}
                InputProps={{ startAdornment: "#" }}
            />
            <div>
                {tags.map((tag, index) => (
                    <Chip
                        key={tag}
                        label={tag}
                        onDelete={() => handleDeleteTag(tag)}
                        className={styles.chip}
                        style={{ marginLeft: index !== 0 ? '10px' : '0' }}
                    />
                ))}
            </div>
            <SimpleMDE
                className={styles.editor}
                value={text[selectedLang]}
                onChange={onChange}
                options={options}
            />
            <div className={styles.buttons}>
                <Button onClick={onSubmit} size="large" variant="contained">
                    {isEditing ? BtnSave : BtnPublish}
                </Button>
                <a href="/">
                    <Button size="large">{BtnCancel}</Button>
                </a>
            </div>
            <ErrorModal error={error} onClose={() => setError(null)} />
        </Paper>
    );
};
