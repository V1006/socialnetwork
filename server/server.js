const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const multer = require("multer");
const uidSafe = require("uid-safe");
require("dotenv").config();
const s3upload = require("./s3");
const { PORT = 3001, SESSION_SECRET, AWS_BUCKET } = process.env;
const {
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
} = require("../db.js");
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

// middleware

// END POINTS

// friendship endpoints

function getFriendshipStatus(friendship, currentUser) {
    if (!friendship) {
        return "NO_FRIENDSHIP";
    }
    if (!friendship.accepted && friendship.sender_id === currentUser) {
        return "OUTGOING_FRIENDSHIP";
    }
    if (!friendship.accepted && friendship.recipient_id === currentUser) {
        return "INCOMING_FRIENDSHIP";
    }
    if (friendship.accepted) {
        return "ACCEPTED_FRIENDSHIP";
    }
}
app.get("/api/friendships/:user_id", async (request, response) => {
    const currentUser = request.session.user_id;
    const friendRequestUser = request.params.user_id;
    // console.log("currentUser", currentUser);
    // console.log("friendRequestUser", friendRequestUser);
    try {
        const friendship = await getFriendship(currentUser, friendRequestUser);
        const status = getFriendshipStatus(friendship, currentUser);
        // console.log("FRIEND STATUS", friendship);
        response.json(status);
    } catch (error) {
        console.log(error);
        response.json(null);
    }
});

app.post("/api/friendships/:user_id", async (request, response) => {
    const currentUser = request.session.user_id;
    const friendRequestUser = request.params.user_id;
    try {
        const friendship = await getFriendship(currentUser, friendRequestUser);
        const currentStatus = getFriendshipStatus(friendship, currentUser);
        let status;

        if (currentStatus === "NO_FRIENDSHIP") {
            await requestFriendship(currentUser, friendRequestUser);
            status = "OUTGOING_FRIENDSHIP";
        }

        if (currentStatus === "INCOMING_FRIENDSHIP") {
            await acceptFriendship(currentUser, friendRequestUser);
            status = "ACCEPTED_FRIENDSHIP";
        }

        if (
            currentStatus === "ACCEPTED_FRIENDSHIP" ||
            currentStatus === "OUTGOING_FRIENDSHIP"
        ) {
            await deleteFriendship(currentUser, friendRequestUser);
            status = "NO_FRIENDSHIP";
        }

        response.json(status);
    } catch (error) {
        console.log(error);
        response.json(null);
    }
});

// preview image
app.get("/api/preview", async (request, response) => {
    try {
        const previewImg = await getImgPreview(request.query.q);
        if (!previewImg) {
            response.json(null);
        }
        response.json(previewImg);
    } catch (error) {
        console.log(error);
        response.json(null);
    }
});

// check if email exists

app.get("/api/email", async (request, response) => {
    try {
        const email = await getEmail(request.query.q);
        if (!email) {
            // is there a better solution?
            response.json(null);
        }
        response.json(email);
    } catch (error) {
        console.log(error);
        response.json(null);
    }
});

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

// update bio

app.put("/api/users/me/bio", async (request, response) => {
    try {
        const updatedBio = await updateBio({
            ...request.body,
            id: request.session.user_id,
        });
        response.json(updatedBio);
    } catch (error) {
        console.log(error);
        response.json(null);
    }
});

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

    response.json(loggedUser);
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

// finding user endpoint

app.get("/api/users", async (request, response) => {
    try {
        const users = await getUsers(request.query.q);
        response.json(users);
    } catch (error) {
        console.log(error);
        response.json(null);
    }
});

// getting single user

app.get("/api/user/:otherUserId", async (request, response) => {
    const { otherUserId } = request.params;
    try {
        const user = await getUserById(otherUserId);
        response.json(user);
    } catch (error) {
        console.log(error);
        response.json(null);
    }
});

// logout endpoint
app.get("/api/logout", (request, response) => {
    request.session = null;
    response.redirect("/");
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(PORT, function () {
    console.log(`Express server listening on port ${PORT}`);
});
