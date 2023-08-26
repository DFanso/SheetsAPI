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
  const maxColumns = Math.max(...nonNullValues.map(row => row.length));

  // Generate a random color
  const getRandomColor = () => ({
    red: Math.random(),
    green: Math.random(),
    blue: Math.random(),
  });

  // Initialize the Google Sheets API
  const sheets = google.sheets({ version: 'v4', auth });

  // Update the Google Sheet
  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: '1VC73YIaqhOhAjQ8k-EgkSS9GgcbFGKKPjjwv3jWk3eE',
      range: 'A1:N1', // Specify the sheet name
      valueInputOption: 'RAW',
      resource: { values },
    });
    
    // Get the total number of rows and columns
  const numRows = values.length;
  const numColumns = values[0].length;

  // Set cell colors individually
  for (let rowIdx = 1; rowIdx <= numRows; rowIdx++) {
    for (let colIdx = 1; colIdx <= numColumns; colIdx++) {
      const color = getRandomColor();

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: '1VC73YIaqhOhAjQ8k-EgkSS9GgcbFGKKPjjwv3jWk3eE',
      resource: {
        requests: [
          {
            updateCells: {
              rows: [
                {
                  values: [
                    {
                      userEnteredFormat: {
                        backgroundColorStyle: {
                          rgbColor: color,
                        },
                      },
                    },
                  ],
                },
              ],
              fields: 'userEnteredFormat.backgroundColorStyle',
              range: {
                sheetId: 0,
                startRowIndex: rowIdx - 1,
                endRowIndex: rowIdx,
                startColumnIndex: colIdx - 1,
                endColumnIndex: colIdx,
              },
            },
          },
        ],
      },
    });
  }
}
  

    
    
    

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