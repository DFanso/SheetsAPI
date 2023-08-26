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

// Define an API endpoint to update the Google Sheet
app.post('/update-google-sheet', async (req, res) => {
  const inputData = req.body;
  //console.log(req.body)

  const saoPauloTimeZone = 'America/Sao_Paulo';
  const currentDate = new Date();
  const saoPauloDate = utcToZonedTime(currentDate, saoPauloTimeZone);
  
  const formattedDate = format(saoPauloDate, "MMMM dd, yyyy");
  const formattedTime = format(saoPauloDate, "HH:mm:ss");

console.log(formattedDate,formattedTime)

  // Convert inputData into a 2D array
  const values = [];

  values.push(
    [`${formattedDate},${formattedTime}`]
  );


  // Convert the formDemografico data into an array
  const formDemograficoRow = Object.values(inputData.formDemografico);

  formDemograficoRow.unshift("𝐃𝐞𝐦𝐨𝐠𝐫𝐚𝐟𝐢𝐜𝐨");
  values.push(formDemograficoRow);


  // Convert other form data into arrays and push them into values array
  
  if (inputData.formQuest1Fem) {
    const modifiedFormQuest1Fem = [...inputData.formQuest1Fem]; 
    modifiedFormQuest1Fem.unshift("𝐐𝐮𝐞𝐬𝐭𝟏 𝐅𝐞𝐦"); 
  
    values.push(modifiedFormQuest1Fem);
  }

  if (inputData.formQuest2Fem) {
    const modifiedFormQuest2Fem = [...inputData.formQuest2Fem];
    modifiedFormQuest2Fem.unshift("𝐐𝐮𝐞𝐬𝐭𝟐 𝐅𝐞𝐦"); 
  
    values.push(modifiedFormQuest2Fem);
  }
  
  if (inputData.formQuest3Fem) {
    const modifiedFormQuest3Fem = [...inputData.formQuest3Fem];
    modifiedFormQuest3Fem.unshift("𝐐𝐮𝐞𝐬𝐭𝟑 𝐅𝐞𝐦"); 
  
    values.push(modifiedFormQuest3Fem);
  }
  
  if (inputData.formQuest1Mas) {
    const modifiedFormQuest1Mas = [...inputData.formQuest1Mas];
    modifiedFormQuest1Mas.unshift("𝐐𝐮𝐞𝐬𝐭𝟏 𝐌𝐚𝐬"); 
  
    values.push(modifiedFormQuest1Mas);
  }
  
  if (inputData.formQuest2Mas) {
    const modifiedFormQuest2Mas = [...inputData.formQuest2Mas];
    modifiedFormQuest2Mas.unshift(" 𝐐𝐮𝐞𝐬𝐭𝟐 𝐌𝐚𝐬"); 
  
    values.push(modifiedFormQuest2Mas);
  }
  
  if (inputData.formQuest3Mas) {
    const modifiedFormQuest3Mas = [...inputData.formQuest3Mas];
    modifiedFormQuest3Mas.unshift("𝐐𝐮𝐞𝐬𝐭𝟑 𝐌𝐚𝐬"); 
  
    values.push(modifiedFormQuest3Mas);
  }
  
  if (inputData.formSatisfacao) {
    const modifiedFormSatisfacao = [...inputData.formSatisfacao];
    modifiedFormSatisfacao.unshift("𝐒𝐚𝐭𝐢𝐬𝐟𝐚𝐜𝐚𝐨"); 
  
    values.push(modifiedFormSatisfacao);
  }
  
  if (inputData.formSignificado) {
    const modifiedFormSignificado = [...inputData.formSignificado];
    modifiedFormSignificado.unshift("𝐒𝐢𝐠𝐧𝐢𝐟𝐢𝐜𝐚𝐝𝐨"); 
  
    values.push(modifiedFormSignificado);
  }
  
  if (inputData.tracos) {
    const modifiedTracos = [...inputData.tracos];
    modifiedTracos.unshift("𝐓𝐫𝐚𝐜𝐨𝐬"); 
  
    values.push(modifiedTracos);
  }
  



  // values.push(
  //   ["ㅤ","ㅤ","ㅤ","ㅤ","ㅤ","ㅤ","ㅤ","ㅤ"]
  // );
  values.push(
    ["ㅤ","ㅤ","ㅤ","ㅤ","ㅤ","ㅤ","ㅤ","ㅤ","ㅤ","ㅤ","ㅤ","ㅤ","ㅤ","ㅤ","ㅤ","ㅤ","ㅤ","ㅤ","ㅤ","ㅤ","ㅤ","ㅤ","ㅤ","ㅤ","ㅤ","ㅤ"]
  );
  values.push(
    ["ㅤ","ㅤ","ㅤ","ㅤ","ㅤ","ㅤ","ㅤ","ㅤ","ㅤ","ㅤ","ㅤ","ㅤ","ㅤ","ㅤ","ㅤ","ㅤ","ㅤ","ㅤ","ㅤ","ㅤ","ㅤ","ㅤ","ㅤ","ㅤ","ㅤ","ㅤ"]
  );
  values.push(
    ["ㅤ","ㅤ","ㅤ","ㅤ","ㅤ","ㅤ","ㅤ","ㅤ","ㅤ","ㅤ","ㅤ","ㅤ","ㅤ","ㅤ","ㅤ","ㅤ","ㅤ","ㅤ","ㅤ","ㅤ","ㅤ","ㅤ","ㅤ","ㅤ","ㅤ","ㅤ"]
  );

  

  // console.log(values);
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
