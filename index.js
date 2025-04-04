// server.js
const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const app = express();
const PORT = 3000;

// MongoDB URI and Target Database/Collection Configuration
const mongoUri = 'mongodb+srv://zedprevido:hehe@freedomwall.2o3h1.mongodb.net/?retryWrites=true&w=majority&appName=Freedomwall';  // Replace with your MongoDB URI
const dbName = 'Freedomwall';
const collectionName = 'messages';

let db, messagesCollection;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Connect to MongoDB and specify the database/collection
async function connectToMongoDB() {
  try {
    const client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();

    // Specify target database and collection
    db = client.db(dbName);
    messagesCollection = db.collection(collectionName);

    console.log(`Connected to MongoDB database: ${dbName}, collection: ${collectionName}`);
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

// Route to get all messages
app.get('/messages', async (req, res) => {
  try {
    const messages = await messagesCollection.find().toArray();
    res.json(messages.map(({ to, message }) => ({ to, message })));
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch messages.' });
  }
});

// Route to add a new message
app.post('/messages', async (req, res) => {
  const { to, message } = req.body;
  if (to && message && message.trim().length > 0) {
    try {
      await messagesCollection.insertOne({ to, message });
      res.status(201).json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to post message.' });
    }
  } else {
    res.status(400).json({ success: false, message: 'Both "To" and "Message" fields are required.' });
  }
});

 
// Start the server after connecting to MongoDB
connectToMongoDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
