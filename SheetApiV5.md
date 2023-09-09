```javascript
const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
const { format } = require("date-fns");
const { utcToZonedTime, zonedTimeToUtc } = require('date-fns-tz');

const app = express();
app.use(cors());
app.use(express.json());


// Load the service account credentials JSON file
const credentials = require('./pesquisa-doutorado-98136-ee201f423535.json');

// Authorize using the service account credentials
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

app.post('/update-google-sheet', async (req, res) => {
    const inputData = req.body;

    const saoPauloTimeZone = 'America/Sao_Paulo';
    const currentDate = new Date();
    const saoPauloDate = utcToZonedTime(currentDate, saoPauloTimeZone);
  
    const formattedDate = format(saoPauloDate, "MMMM dd, yyyy");
    const formattedTime = format(saoPauloDate, "HH:mm:ss");

    // Convert inputData into a 2D array, but this time vertically
const values = [];

// Helper function to add data vertically
const addDataVertically = (data, maxLength) => {
    for (let i = 0; i < maxLength; i++) {
        // Check if data[i] exists or if it's a 0/false value; otherwise use placeholder
        const value = (data[i] !== undefined || data[i] === 0 || data[i] === false) ? data[i] : "ㅤ";
        
        if (values[i]) {
            values[i].push(value);
        } else {
            values[i] = [value];
        }
    }
};

// Find the maximum length of all forms data
const maxLength = Math.max(
    1 + Object.values(inputData.formDemografico).length,
    1 + (inputData.formQuest1Fem ? inputData.formQuest1Fem.length : 0),
    1 + (inputData.formQuest2Fem ? inputData.formQuest2Fem.length : 0),
    1 + (inputData.formQuest3Fem ? inputData.formQuest3Fem.length : 0),
    1 + (inputData.formQuest1Mas ? inputData.formQuest1Mas.length : 0),
    1 + (inputData.formQuest2Mas ? inputData.formQuest2Mas.length : 0),
    1 + (inputData.formQuest3Mas ? inputData.formQuest3Mas.length : 0),
    1 + (inputData.formSatisfacao ? inputData.formSatisfacao.length : 0),
    1 + (inputData.formSignificado ? inputData.formSignificado.length : 0),
    1 + (inputData.tracos ? inputData.tracos.length : 0)
);

addDataVertically([`${formattedDate},${formattedTime}`], maxLength);
addDataVertically(["𝐃𝐞𝐦𝐨𝐠𝐫𝐚𝐟𝐢𝐜𝐨", ...Object.values(inputData.formDemografico)], maxLength);

// Convert other form data into arrays and push them into values array vertically
const forms = [
    { data: inputData.formQuest1Fem, label: "𝐐𝐮𝐞𝐬𝐭𝟏 𝐅𝐞𝐦" },
    { data: inputData.formQuest2Fem, label: "𝐐𝐮𝐞𝐬𝐭𝟐 𝐅𝐞𝐦" },
    { data: inputData.formQuest3Fem, label: "𝐐𝐮𝐞𝐬𝐭𝟑 𝐅𝐞𝐦" },
    { data: inputData.formQuest1Mas, label: "𝐐𝐮𝐞𝐬𝐭𝟏 𝐌𝐚𝐬" },
    { data: inputData.formQuest2Mas, label: "𝐐𝐮𝐞𝐬𝐭𝟐 𝐌𝐚𝐬" },
    { data: inputData.formQuest3Mas, label: "𝐐𝐮𝐞𝐬𝐭𝟑 𝐌𝐚𝐬" },
    { data: inputData.formSatisfacao, label: "𝐒𝐚𝐭𝐢𝐬𝐟𝐚𝐜𝐚𝐨" },
    { data: inputData.formSignificado, label: "𝐒𝐢𝐠𝐧𝐢𝐟𝐢𝐜𝐚𝐝𝐨" },
    { data: inputData.tracos, label: "𝐓𝐫𝐚𝐜𝐨𝐬" }
];


forms.forEach(form => {
    if (form.data) {
        addDataVertically([form.label, ...form.data], maxLength);
    } else {
        addDataVertically([form.label], maxLength); // Only label will be added if data doesn't exist
    }
});

    // Spacing
    for (let i = 0; i < 3; i++) {
        addDataVertically(["ㅤ", "ㅤ", "ㅤ", "ㅤ", "ㅤ", "ㅤ", "ㅤ", "ㅤ", "ㅤ", "ㅤ", "ㅤ", "ㅤ", "ㅤ", "ㅤ", "ㅤ", "ㅤ", "ㅤ", "ㅤ", "ㅤ", "ㅤ", "ㅤ", "ㅤ", "ㅤ", "ㅤ", "ㅤ", "ㅤ"]);
    }

    // Initialize the Google Sheets API
    const sheets = google.sheets({ version: 'v4', auth });

    // Update the Google Sheet
    try {
        await sheets.spreadsheets.values.append({
            spreadsheetId: '1VC73YIaqhOhAjQ8k-EgkSS9GgcbFGKKPjjwv3jWk3eE',
            range: 'A1', // Specify the sheet name
            valueInputOption: 'RAW',
            resource: { values },
        });
        res.status(200).json({ message: 'Data updated in Google Sheet.' });
    } catch (error) {
        console.error('Error updating Google Sheet:', error);
        res.status(500).json({ error: 'An error occurred while updating Google Sheet.' });
    }
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

```