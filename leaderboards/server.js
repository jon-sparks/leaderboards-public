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

const renderJsonData = (data, response) => 
  response.json(data)

const renderSuccess = (_, response) => 
  response.status(201).end()

const queryDb = (fn, renderFn = renderJsonData) => 
  (request, response) =>
    fn({...request.params, ...request.body})
      .then(({rows}) => renderFn(rows, response))
      .catch(error => response.status(500).send(error))

app.get('/api/drivers', queryDb(db.getDrivers))
app.get('/api/teams', queryDb(db.getTeams))
app.get('/api/seasons', queryDb(db.getSeasons))
app.get('/api/events/:year', queryDb(db.getEvents))
app.get('/api/races/:id', queryDb(db.getRaces))
app.get('/api/results/:id', queryDb(db.getResults))
app.get('/api/season-standings/:year', queryDb(db.getSeasonStandings))
app.get('/api/team-standings/:year', queryDb(db.getTeamStandings))
app.get('/api/empty-races', queryDb(db.getEmptyRaces))
app.get('/api/race-drivers/:id', queryDb(db.getRaceDrivers))
app.post('/api/insert-positions', queryDb(db.insertRaceResults))
app.post('/api/insert-driver', queryDb(db.insertDriver))
app.post('/api/insert-team', queryDb(db.insertTeam))
app.post('/api/insert-event', db.insertEvent)
app.put('/api/delete-driver', queryDb(db.deleteDriver))
app.put('/api/delete-team', queryDb(db.deleteTeam))

app.listen(process.env.PORT || 8081);


