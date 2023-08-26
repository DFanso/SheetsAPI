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
  const { values } = req.body; // Access the 'values' key directly
  console.log(values);

  // Initialize the Google Sheets API
  const sheets = google.sheets({ version: 'v4', auth });

  // Update the Google Sheet
  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: '1VC73YIaqhOhAjQ8k-EgkSS9GgcbFGKKPjjwv3jWk3eE',
      range: 'A1', // Specify the sheet name, not the entire range
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
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