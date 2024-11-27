import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory database (using arrays)
let users = [];
let accounts = [];
let sessions = [];

// Helper function to generate a one-time password (OTP)
function generateOTP() {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString();
}

// Routes

// POST: Create a new user and account
app.post("/users", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send("Username and password are required");
    }

    const newUser = {
        id: users.length + 1,
        username,
        password,
    };

    const userId = newUser.id;
    users.push(newUser);

    const newAccount = {
        userId,
        amount: 0,
    };
    accounts.push(newAccount);

    res.status(201).send({
        message: "User and account created successfully",
        userId,
    });
});

// POST: Log in a user and generate a one-time password (OTP)
app.post("/sessions", (req, res) => {
    const { username, password } = req.body;

    const user = users.find(
        (u) => u.username === username && u.password === password
    );

    if (!user) {
        return res.status(401).send("Invalid username or password");
    }

    const token = generateOTP();

    const newSession = {
        userId: user.id,
        token,
    };

    sessions.push(newSession);

    res.status(200).send({ message: "Login successful", token });
});

// GET: Fetch account details
app.get("/account", (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.status(400).send("Token is required");
    }

    const session = sessions.find((s) => s.token === token);

    if (!session) {
        return res.status(401).send("Invalid or expired token");
    }

    const account = accounts.find((a) => a.userId === session.userId);

    if (!account) {
        return res.status(404).send("Account not found");
    }

    res.status(200).send({ account });
});

// POST: Fetch account balance
app.post("/me/accounts", (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).send("Token is required");
    }

    const session = sessions.find((s) => s.token === token);

    if (!session) {
        return res.status(401).send("Invalid or expired token");
    }

    const account = accounts.find((a) => a.userId === session.userId);

    if (!account) {
        return res.status(404).send("Account not found");
    }

    res.status(200).send({ balance: account.amount });
});

// POST: Deposit money into the account
app.post("/me/accounts/transactions", (req, res) => {
    const { token, amount } = req.body;

    if (!amount || amount <= 0) {
        return res.status(400).send("Invalid amount");
    }

    const session = sessions.find((s) => s.token === token);

    if (!session) {
        return res.status(401).send("Invalid or expired token");
    }

    const account = accounts.find((a) => a.userId === session.userId);

    if (!account) {
        return res.status(404).send("Account not found");
    }

    // Update account balance
    account.amount += amount;

    res.status(200).send({
        message: "Deposit successful",
        balance: account.amount,
    });
});

// Start the server
const port = 3001;
app.listen(port, () => {
    console.log(`Bank backend is running at http://localhost:${port}`);
});
