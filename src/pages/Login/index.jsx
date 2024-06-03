import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import styles from "./Login.module.scss";
import { fetchAuth, selectIsAuth } from "../../redux/slices/auth";
import { useNavigate } from "react-router-dom";
import {Helmet} from "react-helmet";

export const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isFetching, setIsFetching] = useState(false); // Добавляем локальное состояние для отслеживания выполнения запроса

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = async (values) => {
    try {
      setIsFetching(true); // Устанавливаем флаг выполнения запроса в true перед отправкой запроса
      const data = await dispatch(fetchAuth(values));

      if ("token" in data.payload) {
        window.localStorage.setItem("token", data.payload.token);
        navigate("/");
      }
    } catch (error) {
      console.error("Ошибка при авторизации:", error);
    } finally {
      setIsFetching(false); // Устанавливаем флаг выполнения запроса в false после получения ответа
    }
  };

  const handleFormSubmit = (data) => {
    onSubmit(data);
    setFormSubmitted(true);
  };

  return (
      <Paper classes={{ root: styles.root }}>
        <Helmet>
          <title>Авторизация</title>
        </Helmet>
        <Typography classes={{ root: styles.title }} variant="h5">
          Вход в аккаунт
        </Typography>



        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <TextField
              className={styles.field}
              label="E-Mail"
              type="email"
              error={Boolean(errors.email?.message)}
              helperText={errors.email?.message}
              {...register("email", { required: "Укажите почту" })}
              fullWidth
          />
          <TextField
              className={styles.field}
              label="Пароль"
              type="password"
              error={Boolean(errors.password?.message)}
              helperText={errors.password?.message}
              {...register("password", { required: "Укажите пароль" })}
              fullWidth
          />
          <Button
              type="submit"
              size="large"
              variant="contained"
              fullWidth
              disabled={isFetching} // Делаем кнопку недоступной во время выполнения запроса
          >
            {isFetching ? "Вход..." : "Войти"} {/* Изменяем текст кнопки во время выполнения запроса */}
          </Button>
        </form>
      </Paper>
  );
};
