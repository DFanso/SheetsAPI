const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
const { format } = require("date-fns");
const { utcToZonedTime, zonedTimeToUtc } = require('date-fns-tz');
const fs = require('fs').promises;

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
    // Initialize the Google Sheets API
    const sheets = google.sheets({ version: 'v4', auth });

    let lastPersonNumber = 0;
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: '1VC73YIaqhOhAjQ8k-EgkSS9GgcbFGKKPjjwv3jWk3eE',
            range: 'Z1',
        });
        
        const cellValue = response.data.values ? response.data.values[0][0] : "Person0";
        lastPersonNumber = parseInt(cellValue.replace('Person', ''));

        // Check for NaN and reset to 0 if needed
        if (isNaN(lastPersonNumber)) {
            lastPersonNumber = 0;
        }
    } catch (error) {
        console.log('Could not read last person number, defaulting to 0');
    }

    // Increment the "Person" identifier
    const newPerson = `Person${lastPersonNumber + 1}`;

    // Update the last "Person" identifier in the reserved cell (Z1)
    await sheets.spreadsheets.values.update({
        spreadsheetId: '1VC73YIaqhOhAjQ8k-EgkSS9GgcbFGKKPjjwv3jWk3eE',
        range: 'Z1',
        valueInputOption: 'RAW',
        resource: { values: [[newPerson]] },
    });

    // Convert inputData into a single array (horizontal)
    const values = [newPerson];
   

    // Add demographic form data
    values.push(...Object.values(inputData.formDemografico));

    // Add other form data
    const forms = [
        { data: inputData.formQuest1Fem, label: 'formQuest1Fem' },
        { data: inputData.formQuest2Fem, label: 'formQuest2Fem' },
        { data: inputData.formQuest3Fem, label: 'formQuest3Fem' },
        { data: inputData.formQuest1Mas, label: 'formQuest1Mas' },
        { data: inputData.formQuest2Mas, label: 'formQuest2Mas' },
        { data: inputData.formQuest3Mas, label: 'formQuest3Mas' },
        { data: inputData.formSatisfacao, label: 'formSatisfacao' },
        { data: inputData.formSignificado, label: 'formSignificado' },
        { data: inputData.tracos, label: 'tracos' }
    ];
    
    forms.forEach(form => {
        if (form.data && form.data.length > 0) {  // Check if data exists and is not empty
            values.push(...form.data);
        }
    });

    

    // Update the Google Sheet
    try {
        await sheets.spreadsheets.values.append({
            spreadsheetId: '1VC73YIaqhOhAjQ8k-EgkSS9GgcbFGKKPjjwv3jWk3eE',
            range: 'A1', // Specify the sheet name and starting cell
            valueInputOption: 'RAW',
            resource: { values: [values] }, // Wrap in another array to make it a 2D array
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
