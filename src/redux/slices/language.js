// redux/slices/language.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    language: "ru", // Предположим, что по умолчанию язык - английский ("en")
};

const languageSlice = createSlice({
    name: "language",
    initialState,
    reducers: {
        setLanguageHandler(state, action) {
            localStorage.setItem("selectedLanguage", action.payload)
            console.log(action.payload, "payload")
            state.language = localStorage.getItem("selectedLanguage");
        },
    },
});

export const { setLanguageHandler } = languageSlice.actions;
export const selectLanguage = (state) => state.language.language;

export default languageSlice.reducer;
