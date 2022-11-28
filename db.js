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

module.exports = {
    createUser
};