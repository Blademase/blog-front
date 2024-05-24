import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import { fetchRegister, selectIsAuth } from "../../redux/slices/auth";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "../../redux/axios";

import styles from "./Login.module.scss";

export const Registration = () => {
  const isAuth = useSelector(selectIsAuth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const host = "http://localhost:4444";

  const [imageUrl, setImageUrl] = React.useState("");
  const inputFileRef = React.useRef(null);
  const handleChangeFile = async (event) => {
    try {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append("image", file);
      const { data } = await axios.post("/upload", formData);
      setImageUrl(data.url);
      setValue("avatarUrl", data.url); // Set the value for avatarUrl field
    } catch (err) {
      console.log(err);
      // alert("Ошибка при загрузке файла");
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue, // Add setValue from useForm
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      password_confirm: "",
      avatarUrl: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (values) => {
    try {
      values.avatarUrl = imageUrl;
      const data = await dispatch(fetchRegister(values));
      if ("token" in data.payload) {
        window.localStorage.setItem("token", data.payload.token);
      }
      navigate("/");
    } catch (error) {
      console.error("Ошибка при регистрации:", error);
    }
  };

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Создание аккаунта
      </Typography>
      <div
        className={styles.avatar}
        onClick={() => inputFileRef.current.click()}
      >
        {imageUrl ? (
          <div style={{ width: "100px", height: "100px" }}>
            <img
              style={{
                width: "100%",
                height: "100px",
                objectFit: "cover",
                borderRadius: "50%",
              }}
              src={`${host}${imageUrl}`}
              alt=""
            />
          </div>
        ) : (
          <Avatar sx={{ width: 100, height: 100 }} />
        )}
      </div>
      <form onSubmit={handleSubmit(onSubmit)} style={{ position: "relative" }}>
        <TextField
          type="file"
          className={styles.field}
          ref={inputFileRef}
          onChange={handleChangeFile}
          fullWidth
          sx={{
            position: "absolute",
            top: "-110px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "100px",
            height: "100px",
            backgroundColor: "black",
            borderRadius: "50%",
            opacity: 0,
          }}
        />
        <TextField
          className={styles.field}
          type="text"
          error={Boolean(errors.fullName?.message)}
          helperText={errors.fullName?.message}
          {...register("fullName", { required: "укажите полное имя" })}
          label="Полное имя"
          fullWidth
        />
        <TextField
          className={styles.field}
          type="email"
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          {...register("email", { required: "укажите почту" })}
          label="E-Mail"
          fullWidth
        />
        <TextField
          className={styles.field}
          type="password"
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          {...register("password", { required: "укажите пароль" })}
          label="Пароль"
          fullWidth
        />
        <Button
          disabled={!isValid}
          type="submit"
          size="large"
          variant="contained"
          fullWidth
        >
          Зарегистрироваться
        </Button>
      </form>
    </Paper>
  );
};
