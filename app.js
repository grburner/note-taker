const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const PORT = process.env.PORT || 3001;

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
        let resObj = JSON.parse(data)
        console.log(resObj['records'])
        res.send(resObj['records'])
    });
});

app.post('/api/notes', async (req, res) => {
    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
        let recordObj = JSON.parse(data)
        let thisRecord = { "title": req.body.title, "text": req.body.text, "id": getLastId(recordObj['records'])}
        recordObj['records'].push(thisRecord)
        let dataToWrite = JSON.stringify(recordObj)
        fs.writeFileSync('./db/db.json', dataToWrite)
    });
    res.end()
});

app.delete('/api/notes/:id', (req, res) => {
    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
        let recordObj = JSON.parse(data)
        let splicePos 
        for ( i = 0; i < recordObj.records.length; i++ ) {
            if ( parseInt(req.params.id) === recordObj.records[i].id ) {
                splicePos = i 
            }
        }
        recordObj.records.splice(splicePos, 1)
        fs.writeFile('./db/db.json', JSON.stringify(recordObj), 'utf-8', (err) => {
            if (err) throw err;
            console.log('file saved')
        });
    });
    res.end()
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'))
});

app.get('/notes', (req, res) => {
    console.log(req.body)
    res.sendFile(path.join(__dirname + '/public/notes.html'))
})

app.listen(PORT, () => {
    console.log('The app is running')
});

let getLastId = (json) => {
    console.log(json.length + 1)
    return json.length + 1
}