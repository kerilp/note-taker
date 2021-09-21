const express = require('express');
const { v4: uuidv4 } = require('uuid');
const {
    readFromFile,
    readAndAppend,
    writeToFile,
  } = require('../helpers/fsUtils');

const app = express();

// GET Route for retrieving all the notes
app.get('/notes', (req, res) => {
    console.info(`${req.method} request received for note`);
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

app.delete('/notes/:id', (req, res) => {
    const noteId = req.params.id;
    readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      const result = json.filter((note) => note.id !== noteId);
      writeToFile('./db/db.json', result);

      console.info(`Item ${noteId} has been deleted`);
      res.json(`Item ${noteId} has been deleted`);
    });
});

// POST Route for a new note
app.post('/notes', (req, res) => {
    console.info(`${req.method} request received to add a note`);

    const { title, text } = req.body;

    if (req.body) {
        const newNote = {
            title,
            text,
            id: uuidv4(),
        };

        readAndAppend(newNote, './db/db.json');
        const response = {
            status: 'success',
            body: newNote,
          };
      
          res.json(response);
        } else {
          res.json('Error in posting note');
        }
});

module.exports = app;