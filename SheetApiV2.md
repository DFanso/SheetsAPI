```javascript
const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');

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

// Define an API endpoint to update the Google Sheet
app.post('/update-google-sheet', async (req, res) => {
  const inputData = req.body;

  // Convert your inputData into a 2D array
  const values = [];

  // Convert the formDemografico data into an array
  const formDemograficoRow = Object.values(inputData.formDemografico);
  values.push(formDemograficoRow);

  // Convert other form data into arrays and push them into values array
  values.push(inputData.formQuest1Fem);
  values.push(inputData.formQuest2Fem);
  values.push(inputData.formQuest2Fem);

  values.push(inputData.formQuest1Mas);
  values.push(inputData.formQuest2Mas);
  values.push(inputData.formQuest3Mas);

  values.push(inputData.formSatisfacao);
  values.push(inputData.formSignificado);

  values.push(inputData.tracos);

  console.log(values);
  const nonNullValues = values.map(row => (row ? row.filter(value => value !== null) : []));

  // Generate a random color
  const randomColor = {
    red: Math.random(),
    green: Math.random(),
    blue: Math.random(),
  };

  // Initialize the Google Sheets API
  const sheets = google.sheets({ version: 'v4', auth });

  // Update the Google Sheet
  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: '1VC73YIaqhOhAjQ8k-EgkSS9GgcbFGKKPjjwv3jWk3eE',
      range: 'B1', // Specify the sheet name
      valueInputOption: 'RAW',
      resource: { values },
    });
    

    // Set cell color using batchUpdate
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: '1VC73YIaqhOhAjQ8k-EgkSS9GgcbFGKKPjjwv3jWk3eE',
      resource: {
        requests: [
          {
            updateCells: {
              range: {
                sheetId: 0, // Replace with your sheet's ID
                startRowIndex: 1,    // Start from row 2 (assuming row 1 is for headers)
                endRowIndex: 1 + nonNullValues.length, // End at the last row of your appended values
                startColumnIndex: 0, // Start from the first column
                endColumnIndex: nonNullValues[0].length, // End at the last column
              },
              rows: nonNullValues.map(row => ({
                values: row.map(cellValue => ({
                  userEnteredFormat: {
                    backgroundColorStyle: {
                      rgbColor: {
                        red: randomColor.red,
                        green: randomColor.green,
                        blue: randomColor.blue,
                      },
                    },
                  },
                })),
              })),
              fields: 'userEnteredFormat.backgroundColorStyle',
            },
          },
        ],
      },
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