import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Grid from "@mui/material/Grid";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, fetchTags } from "../redux/slices/posts";
import { Post } from "../components/Post";
import { TagsBlock } from "../components/TagsBlock";
import { CommentsBlock } from "../components/CommentsBlock";

export const TagsPage = () => {
  const { tag } = useParams(); // Получаем параметр из URL
  const dispatch = useDispatch();
  const { posts, tags } = useSelector((state) => state.posts);
  const isPostsLoading = posts.status === "loading";
  const isTagsLoading = tags.status === "loading";
  const [filteredPosts, setFilteredPosts] = useState([]);
  const lang = useSelector((state) => state.language.language);
  let loading="";
  if (lang==="en") {loading="Searching..."}
  if (lang==="ru") {loading="Поиск..."}
  if (lang==="kg") {loading="Издөө..."}
  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchTags());
  }, [dispatch]);

  // Функция для фильтрации постов по выбранному тегу
  useEffect(() => {
    if (tag) {
      const filtered = posts.items.filter((post) =>
        post.tags.includes(tag)
      );
      setFilteredPosts(filtered);
    } else {
      setFilteredPosts(posts.items);
    }
  }, [posts.items, tag]);

  return (
    <Grid container spacing={4}>
      <Grid xs={8} item>
        {isPostsLoading ? (
          <p>{loading}</p>
        ) : (
          filteredPosts.map((post) => (
            <Post
              key={post._id}
              id={post._id}
              title={post.title}
              imageUrl={post.imageUrl}
              user={post.user}
              createdAt={post.createdAt}
              viewsCount={post.viewsCount}
              commentsCount={post.commentsCount}
              tags={post.tags}
              isEditable={post.isEditable}
            />
          ))
        )}
      </Grid>
      <Grid xs={4} item>
        <TagsBlock items={tags.items} isLoading={isTagsLoading} />
        <CommentsBlock items={[]} isLoading={true} />
      </Grid>
    </Grid>
  );
};
