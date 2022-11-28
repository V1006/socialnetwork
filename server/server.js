const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const { PORT = 3001, SESSION_SECRET } = process.env;
const {createUser} = require("../db.js")
const cookieSession = require("cookie-session");
require("dotenv").config();

console.log("sesstion secret",SESSION_SECRET)

app.use(compression());
app.use (express.json())

app.use(express.static(path.join(__dirname, "..", "client", "public")));


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

app.post("/api/register", async (request, response) => {
    try {
        const userRegistration = await createUser(request.body);
        request.session.user_id = userRegistration.id;

        
    } catch (error) {
        console.log(error,"Something went wrong")
    }
   
});


app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(PORT, function () {
    console.log(`Express server listening on port ${PORT}`);
});
