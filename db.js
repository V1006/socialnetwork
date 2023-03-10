/// setup ///
const spicedPg = require("spiced-pg");
const { hash, genSalt, compare } = require("bcryptjs");

const { DATABASE_USERNAME, DATABASE_PASSWORD } = process.env;
const DATABASE_NAME = "socialnetwork";

const db = spicedPg(
    `postgres:${DATABASE_USERNAME}:${DATABASE_PASSWORD}@localhost:5432/${DATABASE_NAME}`
);

// hashing password

async function hashPassword(password) {
    const salt = await genSalt();
    return hash(password, salt);
}

// creating account
async function createUser({ first_name, last_name, email, password }) {
    const password_hash = await hashPassword(password);
    const result = await db.query(
        `INSERT INTO users (first_name, last_name, email, password_hash)
        VALUES ($1, $2, $3, $4) RETURNING *
    `,
        [first_name, last_name, email, password_hash]
    );
    return result.rows[0];
}

// login into account

async function getUserByEmail(email) {
    const result = await db.query(
        `
    SELECT * FROM users WHERE email = $1
    `,
        [email]
    );
    return result.rows[0];
}
async function login({ email, password }) {
    const foundUser = await getUserByEmail(email);
    if (!foundUser) {
        return null;
    }
    const match = await compare(password, foundUser.password_hash);
    if (!match) {
        return null;
    }
    return foundUser;
}

// getting user by ID

async function getUserById(id) {
    const result = await db.query(
        `
        SELECT * FROM users WHERE id = $1
    `,
        [id]
    );
    return result.rows[0];
}

//add the new image info to the user

async function createImage({ img_url, id }) {
    const result = await db.query(
        `
    UPDATE users SET img_url = $1
    WHERE id = $2 RETURNING img_url
    `,
        [img_url, id]
    );
    return result.rows[0];
}

// update user bio

async function updateBio({ bio, id }) {
    const result = await db.query(
        `
        UPDATE users SET bio = $1
        WHERE id = $2 RETURNING bio
    `,
        [bio, id]
    );
    return result.rows[0];
}

// get user by search

async function getUsers(searchQuery) {
    if (!searchQuery) {
        /*         const result = await db.query(`
            SELECT * FROM users ORDER BY id DESC LIMIT 3
        `);
        return result.rows; */
        return null;
    }
    const result = await db.query(
        `
            SELECT * FROM users WHERE first_name ILIKE $1
        `,
        [searchQuery + "%"]
    );
    return result.rows;
}

// get img by email

async function getImgPreview(email) {
    const result = await db.query(
        `
        SELECT img_url FROM users WHERE email = $1
    `,
        [email]
    );
    return result.rows[0];
}

// get email if exist

async function getEmail(email) {
    const result = await db.query(
        `
        SELECT email FROM users WHERE email = $1 
    `,
        [email]
    );
    return result.rows[0];
}

// checking friendship status

async function getFriendship(currentUser, friendRequestUser) {
    const result = await db.query(
        `
        SELECT sender_id, recipient_id, accepted FROM friendships
        WHERE sender_id = $1 AND recipient_id = $2 
        OR sender_id = $2 AND recipient_id = $1
    `,
        [currentUser, friendRequestUser]
    );
    return result.rows[0];
}

async function requestFriendship(currentUser, friendRequestUser) {
    const result = await db.query(
        `
        INSERT INTO friendships (sender_id, recipient_id)
        VALUES ($1, $2) RETURNING *
    `,
        [currentUser, friendRequestUser]
    );
    return result.rows[0];
}

async function acceptFriendship(currentUser, friendRequestUser) {
    const result = await db.query(
        `
        UPDATE friendships SET accepted = true
        WHERE sender_id = $1 AND recipient_id = $2 RETURNING *
    `,
        [friendRequestUser, currentUser]
    );
    return result.rows[0];
}

async function deleteFriendship(currentUser, friendRequestUser) {
    const result = await db.query(
        `
        DELETE FROM friendships WHERE sender_id = $1 AND recipient_id = $2
        OR sender_id = $2 AND recipient_id = $1
     `,
        [currentUser, friendRequestUser]
    );
    return result.rows[0];
}

async function getFriendships(id) {
    const results = await db.query(
        `SELECT friendships.accepted,
        friendships.sender_id,
        friendships.recipient_id,
        users.id AS user_id,
        users.first_name, users.last_name, users.img_url
        FROM friendships JOIN users
        ON (users.id = friendships.sender_id AND friendships.recipient_id = $1)
        OR (users.id = friendships.recipient_id AND friendships.sender_id = $1 AND accepted = true)`,
        [id]
    );
    return results.rows;
}

async function getChatMsg(senderId, recipientId) {
    const result = await db.query(
        `
        SELECT chat.id, chat.sender_id, chat.recipient_id, chat.msg,
        users.first_name, users.last_name, users.img_url
        FROM chat JOIN users
        ON (users.id = chat.sender_id) WHERE 
        ((chat.sender_id = $1 AND chat.recipient_id = $2) OR (chat.sender_id = $2 AND chat.recipient_id = $1)) 
    `,
        [senderId, recipientId]
    );
    return result.rows;
}

async function getLastMsg(id) {
    const result = await db.query(
        `
        SELECT * FROM chat WHERE (sender_id = $1 OR recipient_id = $1) 
        ORDER BY id DESC
    `,
        [id]
    );
    return result.rows[0];
}

async function createMsg(sender_id, recipient_id, msg) {
    const result = await db.query(
        `
        INSERT INTO chat (sender_id, recipient_id, msg)
        VALUES ($1, $2, $3) RETURNING *
    `,
        [sender_id, recipient_id, msg]
    );
    return result.rows[0];
}

async function getPodcastByName(pod_name) {
    const result = await db.query(
        `
        SELECT * FROM podcast WHERE pod_name = $1
    `,
        [pod_name]
    );
    return result.rows[0];
}

async function getPods(searchQuery) {
    if (!searchQuery) {
        return null;
    }
    const result = await db.query(
        `
            SELECT * FROM podcast WHERE pod_name ILIKE $1
        `,
        [searchQuery + "%"]
    );
    return result.rows;
}

module.exports = {
    createUser,
    login,
    getUserById,
    createImage,
    updateBio,
    getUsers,
    getImgPreview,
    getEmail,
    getFriendship,
    requestFriendship,
    acceptFriendship,
    deleteFriendship,
    getFriendships,
    getChatMsg,
    createMsg,
    getLastMsg,
    getPodcastByName,
    getPods,
};
