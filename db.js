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
    `, // why returning ?
        [img_url, id]
    );
    return result.rows[0];
}

module.exports = {
    createUser,
    login,
    getUserById,
    createImage,
};
