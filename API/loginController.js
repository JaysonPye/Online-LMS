//Handles login as well as changing of password

const { google } = require('googleapis');
const sheets = google.sheets('v4');
const path = require('path');
const credentialsPath = path.join(__dirname, '..', 'credentials.json');
const credentials = require(credentialsPath);
const jwt = require('jsonwebtoken');

//Can edit this to get the sheetid for passwords
const sheetID = 'sheetid';


//call authentication here
const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  // fetch user data from the Google Sheet
async function getUserData(login) {
    const client = await auth.getClient();
    const response = await sheets.spreadsheets.values.get({
        auth: client,
        spreadsheetId: sheetID,
        range: range,
    });
    const rows = response.data.values;

    // find the user by login (email)
    const user = rows.find(row => row[1] === login);
    return user;
}
  //Login logic
  async function login(req, res){
    const { login, password} = req.body;

    try {
        // Fetch user data from the Google Sheet
        const user = await getUserData(login);
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        // Compare hashed password
        const hashedPassword = user[2]; // Assuming password hash is in column C
        if (hashedPassword !== hashPassword(password)) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        // If username and password match, login successful
        const token = jwt.sign({
        username: user[1], name: user[0],
        //TODO ADD SECRET KEY IN ENV
        }, 'supersecretkey', { expiresIn: '1h' }); 
        res.status(200).json({ message: 'Login successful', token});
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// use bcrypt to hash pw
async function hashPassword(password) {
    try {
        // salt
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);

        // Hash using salt
        const hashedPassword = await bcrypt.hash(password, salt);

        return hashedPassword;
    } catch (error) {
        console.error('Error hashing password:', error);
        throw new Error('Error hashing password');
    }
}
async function changePassword(req, res){
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const user = jwt.user;



}

module.exports {
    login, changePassword
};