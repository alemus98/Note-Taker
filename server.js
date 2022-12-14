// required imports
const express = require('express');
const fs = require('fs');
const path = require('path');

// these are the server ports
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));


// this is the GET request function
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'db/db.json'), err => {
        if (err) throw err;
    });
});

// this is the POST request function
app.post('/api/notes', (req, res) => {
    const newNoteData = req.body; 

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) throw err; 
        const updatedNoteData = JSON.parse(data);
        let uniqueId = (updatedNoteData.length).toString();
        newNoteData.id = uniqueId;
        updatedNoteData.push(newNoteData);
        fs.writeFile('./db/db.json', JSON.stringify(updatedNoteData), err => {
            if (err) throw err;
        });
    });

    res.sendStatus(200);

});

// this deletes noted from json
app.delete('/api/notes/:id', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) throw err;
        let notesData = JSON.parse(data);
        const notesId = req.params.id;
        let newNotesId = 0;

        notesData = notesData.filter(currNote => {
            return currNote.id != notesId;
        });

        for (currNote of notesData) {
            currNote.id = newNotesId.toString();
            newNotesId++;
        }

        fs.writeFile('./db/db.json', JSON.stringify(notesData), 'utf8', (err, data) =>{
            if (err) throw err;
        });

        res.json(notesData);
    });
});

// this is the app listening
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);