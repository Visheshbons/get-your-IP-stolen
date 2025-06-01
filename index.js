// Imports required data
import { app, port, portForward, paswrdPgLoadCount, DatabaseLoadCount, LoginLoadCount, testingBoolean, login, getDateAndTime, users, express, SHA1 } from './appConfig.js';
import chalk from 'chalk';
import cookieParser from 'cookie-parser';

// Quickly sets up cookies and static files
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

// Sets up miscellaneous variables
let logon = login;
let PPLC = paswrdPgLoadCount;
let LLC = LoginLoadCount;

// Handles the "/login" request
app.post("/login", (req, res) => {
    console.time("Loading time");
    logon = false;
    users.forEach((_user, index) => {
        if (!logon) {
            console.log(`Checking username and password... ` + chalk.dim(`(${_user.user})`));
            if (SHA1(req.body.username) == _user.user && SHA1(req.body.password) == _user.pass) {
                console.log(`User: ${chalk.green(_user.user)} successfully logged in!`);
                res.cookie(`username`, SHA1(req.body.username));
                console.log(`Cookie set!`);
                console.timeEnd("Loading time");
                console.log(``);
                res.status(100).redirect("/database");
                logon = true;
            }
        }
    });

    if ((req.body.username == "rickroll me" && req.body.password == "please") && !logon) {
        // check for easter egg
        res.redirect("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
        console.log(`User rickrolled successfully.`);
        console.log(chalk.italic(getDateAndTime()));
        console.timeEnd("Loading time");
        console.log(``);
        return;
    } else if (!logon){
        res.status(401).redirect("/");
        console.log(chalk.bgRed.yellowBright("ALERT:") + chalk.yellow(` Attempted login with username "${req.body.username}" and password "${req.body.password}".`));
        console.timeEnd("Loading time");
    }
    console.log(`Encryped Username: ${SHA1(req.body.username)}`)
    console.log(`Encrypted Password: ${SHA1(req.body.password)}`)
});

// Renders the home page at "/"
app.get("/", (req, res) => {
    res.status(200).render("index.ejs", {
        userNum: PPLC,
        testing: testingBoolean,
        terminalDate: getDateAndTime(),
    });

    console.log(`Home page loaded. (${PPLC})`);
    console.log(chalk.italic(getDateAndTime()));
    console.log(``);
    PPLC++;
});

// Renders "/database"
app.get("/database", (req, res) => {
    let authed = false;
    console.time("Anti Brute Force");
    users.forEach((_user, index) => {
        if (req.cookies.username == _user.user) {
            authed = true;
            res.status(200).json([
                {
                    username: 'Demo User 1',
                    email: 'demo1@example.com',
                    age: 25,
                    country: 'USA',
                    lastLogin: '2023-10-01',
                    status: 'active'
                },
                {
                    username: 'Demo User 2',
                    email: 'demo2@example.com',
                    age: 30,
                    country: 'Canada',
                    lastLogin: '2023-09-30',
                    status: 'inactive'
                },
                {
                    username: 'Demo User 3',
                    email: 'demo3@example.com',
                    age: 28,
                    country: 'UK',
                    lastLogin: '2023-09-29',
                    status: 'active'
                }
            ]);
            console.log(`Database loaded. (${DatabaseLoadCount})`);
            console.log(chalk.italic(getDateAndTime()));
            console.log("");
            DatabaseLoadCount++;
            console.timeEnd("Anti Brute Force");
        }
    });
    if (!authed) {
        res.status(402).send("<center><pre>402: Unauthorized - Brute force attempt detected.</pre></center>");
        console.log(chalk.bgRed.yellowBright("ALERT:") + chalk.yellow(" 402 Unauthorized brute force attempt on /database."));
        console.timeEnd("Time loading");
    }
});

// listen to port
app.listen(port, () => {
    // log server start
    console.log(`Server running on port ` + chalk.green(port) + `.`);
    console.log(``);

    // log date and time
    console.log(`Time of start: ${getDateAndTime()}`);
    console.log(``);

    // log website info
    console.log(`Go to ` + chalk.dim(`http://localhost:${port}`) + ` to view the website.`);
    if (portForward) {
        console.log(`Go to ${chalk.dim(`https://p9npwlmh-${port}.aue.devtunnels.ms/`)} to view the website.`);
    };
    console.log(``);

    // log server commands
    console.log(`Type "rs" to restart the server.`);
    console.log(`Press CTRL + C to kill the server.`);
    console.log(``);

    // log info usage log details
    console.log(`The page loadings will be logged underneath.`)
    console.log(``);
    console.log(``);
});

app.use((req, res, next) => {
    console.log(chalk.bgRed.yellowBright("ALERT:") + chalk.yellow(` 404 Not Found: ${req.originalUrl}`));
    res.status(404).send("404 Not Found");
});

// This code is dedicated to Alexandra Lee.
// As always, this code is free to use, modify, and distribute as you wish.
// No copyright exists.