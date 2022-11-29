const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const multer = require("multer");
const uidSafe = require("uid-safe");
const s3upload = require("./s3");
require("dotenv").config();
const { PORT = 3001, SESSION_SECRET, AWS_BUCKET } = process.env;
const { createUser, login, getUserById, createImage } = require("../db.js");
const cookieSession = require("cookie-session");

app.use(compression());
app.use(express.json());

app.use(express.static(path.join(__dirname, "..", "client", "public")));

// handling the uploads with multer and uid-safe
const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, path.join(__dirname, "uploads"));
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

// end

// additional middleware
app.use(
    cookieSession({
        secret: SESSION_SECRET,
        maxAge: 1000 * 60 * 60 * 24 * 90,
        sameSite: true,
    })
);
//

////// general setup over //////

// end points

// upload image
app.post(
    "/api/image",
    uploader.single("image"),
    s3upload,
    async (request, response) => {
        const img_url = `https://s3.amazonaws.com/${AWS_BUCKET}/${request.file.filename}`;
        try {
            const newImage = await createImage({
                img_url,
                id: request.session.user_id,
            });
            // console.log("NEW IMAGE", newImage); // new image is undefined why?
            response.json(newImage);
        } catch (error) {
            console.log(`Error uploading image`, error);
        }
    }
);

app.post("/api/register", async (request, response) => {
    try {
        const userRegistration = await createUser(request.body);
        request.session.user_id = userRegistration.id;
        response.json({ success: true });
    } catch (error) {
        console.log(error, "Something went wrong");
        response.json({ success: false });
    }
});

app.get("/api/users/me", async (request, response) => {
    if (!request.session.user_id) {
        response.json(null);
        return;
    }
    const loggedUser = await getUserById(request.session.user_id);

    response.json({
        id: loggedUser.id,
        first_name: loggedUser.first_name,
        last_name: loggedUser.last_name,
        img_url: loggedUser.img_url,
    });
});

// login endpoints

app.post("/api/login", async (request, response) => {
    try {
        const foundUser = await login(request.body);
        if (!foundUser) {
            // ?? getting the error log
            throw new Error();
        }
        request.session.user_id = foundUser.id;
        response.json({ success: true });
    } catch (error) {
        console.log("error during login", error);
        response.json({ success: false });
        // response.status(404).json("something went wrong");
    }
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(PORT, function () {
    console.log(`Express server listening on port ${PORT}`);
});
