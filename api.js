const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

app.post('/update-google-sheet', (req, res) => {
  const receivedData = req.body;

  // Transform received data into the desired format
  const transformedData = {
    values: Object.keys(receivedData).map(key => {
      const value = receivedData[key];
      return Array.isArray(value) ? value : [value];
    })
  };

  console.log('Transformed data:', JSON.stringify(transformedData, null, 2));

  // Respond with a simple message
  res.json({ message: 'Data received and transformed successfully' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
