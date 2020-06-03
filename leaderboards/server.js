const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const app = express();
const db = require('./queries')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}))
app.use(express.static(path.join(__dirname, 'static')));

app.get('/api/drivers', db.getDrivers)
app.get('/api/teams', db.getTeams)
app.get('/api/seasons', db.getSeasons)
app.get('/api/events/:year', db.getEvents)
app.get('/api/races/:id', db.getRaces)
app.get('/api/results/:id', db.getResults)
app.get('/api/season-standings/:year', db.getSeasonStandings)
app.get('/api/team-standings/:year', db.getTeamStandings)
app.post('/api/insert-driver', db.insertDriver)
app.post('/api/insert-team', db.insertTeam)
app.post('/api/insert-event', db.insertEvent)
app.put('/api/delete-driver', db.deleteDriver)
app.put('/api/delete-team', db.deleteTeam)

app.listen(process.env.PORT || 8081);