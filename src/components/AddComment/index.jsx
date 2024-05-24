import React, { useState } from "react";
import { useSelector } from "react-redux";
import styles from "./AddComment.module.scss";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { user } from "../../redux/slices/auth";
import axios from "../../redux/axios";
import CircularProgress from "@mui/material/CircularProgress";

const AddComment = ({ postId, setComments }) => {
  const us = useSelector(user);
  const [commentText, setCommentText] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const handleCommentChange = (e) => {
    setCommentText(e.target.value);
  };
  const lang = useSelector((state) => state.language.language);

  const handleSubmitComment = async () => {
    setIsLoading(true); // Set loading state to true when the button is clicked
    try {
      const obj = {
        postId: postId,
        text: commentText,
        userId: us._id,
      };
      const response = await axios.post(`/posts/${postId}/comments`, obj);
      const newComment = response.data;

      setCommentText("");

      // Обновление состояния комментариев
      setComments((prevComments) => [...prevComments, newComment]);
    } catch (error) {
      console.error("Ошибка при создании комментария:", error);
    } finally {
      setIsLoading(false); // Reset loading state when the request is complete
    }
  };

  let commentLabel = "";
  let send = "";
  let sending = "";
  if (lang === "en") {
    commentLabel = "Write a comment";
    send = "Send";
    sending = "Posting";
  }
  if (lang === "kg") {
    commentLabel = "Комментарий жазуу";
    send = "Жөнөтүү";
    sending = "Жарыялоо";
  }
  if (lang === "ru") {
    commentLabel = "Написать комментарий";
    send = "Отправить";
    sending = "Постим ваш комментарий";
  }

  let srcOfImage = "http://localhost:4444";

  return (
      <div className={styles.root}>
        <Avatar classes={{ root: styles.avatar }} src={srcOfImage + us.avatarUrl} />
        <div className={styles.form}>
          <TextField
              label={commentLabel}
              variant="outlined"
              maxRows={10}
              multiline
              fullWidth
              value={commentText}
              onChange={handleCommentChange}
          />
          <Button variant="contained" onClick={handleSubmitComment} disabled={isLoading}>
            {isLoading ? sending : send}
          </Button>
        </div>
      </div>
  );
};

export default AddComment;
