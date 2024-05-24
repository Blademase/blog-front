import React from "react";
import styles from "./UserInfo.module.scss";
const host = "http://localhost:4444";

export const UserInfo = ({ avatarUrl, fullName, additionalText }) => {
    const containerStyle = avatarUrl ? styles.rootWithAvatar : styles.rootWithoutAvatar;


    return (
        <div className={containerStyle}>
            {avatarUrl && (
                <img
                    className={styles.avatar}
                    src={`${host}${avatarUrl}`}
                    alt={fullName}
                />
            )}
            <div className={styles.userDetails}>
                <span className={styles.userName}>{fullName}</span>
                <span className={styles.additional}>{additionalText}</span>
            </div>
        </div>
    );
};
