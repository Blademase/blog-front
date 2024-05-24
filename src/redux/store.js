import { configureStore } from "@reduxjs/toolkit";
import { postsReducer } from "./slices/posts";
import { authReducer } from "./slices/auth";
import languageReducer from "./slices/language"; // Импорт вашего languageReducer

const store = configureStore({
  reducer: {
    posts: postsReducer,
    auth: authReducer,
    language: languageReducer, // Добавление languageReducer в reducer
    // Другие редукторы здесь
  },
});

export default store;
