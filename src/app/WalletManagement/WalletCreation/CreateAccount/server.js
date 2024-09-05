const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3002;
const saltsFilePath = path.join(__dirname, 'salt.json');
app.use(cors());
app.use(bodyParser.json());

// Endpoint to get or create salt
app.post('/getSalt', (req, res) => {
  const { sub, jwt } = req.body;

  if (!sub || !jwt) {
    return res.status(400).send('Invalid request');
  }

  // Read the salts from the file
  fs.readFile(saltsFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading salts file');
    }

    const salts = JSON.parse(data);
    let userSalt = salts[sub];

    if (!userSalt) {
      // Generate a new salt
      userSalt = Math.floor(Math.random() * 1000000000000000);
      salts[sub] = userSalt;

      // Save the updated salts back to the file
      fs.writeFile(saltsFilePath, JSON.stringify(salts, null, 2), 'utf8', (err) => {
        if (err) {
          return res.status(500).send('Error writing salts file');
        }

        res.json({ salt: userSalt });
      });
    } else {
      res.json({ salt: userSalt });
    }
  });
});

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:${PORT}");
});