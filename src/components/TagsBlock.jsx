import TagIcon from "@mui/icons-material/Tag";
import React from "react";
import Chip from "@mui/material/Chip";
import { SideBlock } from "./SideBlock";
import { useParams } from "react-router-dom";
import {useSelector} from "react-redux";

export const TagsBlock = ({ items, isLoading = true }) => {
    let { tag } = useParams();
    const lang = useSelector((state) => state.language.language);
let title="";
    if (lang==="en") {title="Tags"}
    if (lang==="ru") {title="Тэги"}
    if (lang==="kg") {title="Тэгдер"}

    return (
        <SideBlock title={title}>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
                {(isLoading ? items.slice(0, 15) : items).map((name, i) => (
                    <Chip
                        key={i}
                        style={{margin: "0 0 10px 10px"}}
                        label={name?.replace(/^#/, "")}
                        clickable={!isLoading}
                        component="a"
                        href={`/tags/${name?.replace(/^#/, "")}`}
                        color={name === tag ? "primary" : "default"} // Выделение выбранного тега
                    />
                ))}
            </div>
        </SideBlock>
    );
};

