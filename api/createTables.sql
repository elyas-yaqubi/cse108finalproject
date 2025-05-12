-- User table
CREATE TABLE user (
    u_userId integer PRIMARY KEY AUTOINCREMENT,
    u_username VARCHAR(50) UNIQUE NOT NULL,
    u_password VARCHAR(255) NOT NULL,
    u_firstName VARCHAR(50),
    u_lastName VARCHAR(50),
    u_bio TEXT DEFAULT 'No Bio Created',
    u_followerCnt integer DEFAULT 0,
    u_followingCnt integer DEFAULT 0,
    u_postCnt integer DEFAULT 0
);

-- User Posts
CREATE TABLE userPosts (
    up_postId integer PRIMARY KEY AUTOINCREMENT,
    up_userId integer NOT NULL,
    up_body TEXT,
    up_likeCnt integer DEFAULT 0,
    up_commentCnt integer DEFAULT 0,
    up_creationDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (up_userId) REFERENCES user(u_userId)
);

-- Post Comments
CREATE TABLE postComments (
    pc_commentId integer PRIMARY KEY AUTOINCREMENT,
    pc_postId integer NOT NULL,
    pc_userId integer NOT NULL,
    pc_body TEXT,
    pc_creationDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pc_postId) REFERENCES userPosts(up_postId),
    FOREIGN KEY (pc_userId) REFERENCES user(u_userId)
);

-- Follows
CREATE TABLE follows (
    f_userId integer NOT NULL,
    f_followingId integer NOT NULL,
    PRIMARY KEY (f_userId, f_followingId),
    FOREIGN KEY (f_userId) REFERENCES user(u_userId),
    FOREIGN KEY (f_followingId) REFERENCES user(u_userId)
);

-- Saved Posts
CREATE TABLE savedPosts (
    sp_userId integer NOT NULL,
    sp_postId integer NOT NULL,
    PRIMARY KEY (sp_userId, sp_postId),
    FOREIGN KEY (sp_userId) REFERENCES user(u_userId),
    FOREIGN KEY (sp_postId) REFERENCES userPosts(up_postId)
);

CREATE TABLE images (
    i_imgId integer PRIMARY KEY,
    i_userId integer,
    i_postId integer,
    i_image blob,
    FOREIGN KEY (i_userId) REFERENCES user(u_userId),
    FOREIGN KEY (i_postId) REFERENCES userPosts(up_postId)
);

CREATE TABLE profilePictures (
    pp_pictureId integer PRIMARY KEY AUTOINCREMENT,
    pp_userId integer UNIQUE,
    pp_image blob,
    FOREIGN KEY (pp_userId) REFERENCES user(u_userId)
);

INSERT INTO user (u_username, u_password, u_firstName, u_lastName) VALUES ('username', 'password', 'John', 'Doe');

DELETE FROM user;
DELETE FROM userPosts;
DELETE FROM postComments;
DELETE FROM follows;
DELETE FROM savedPosts;
DELETE FROM images;
DELETE FROM profilePictures;