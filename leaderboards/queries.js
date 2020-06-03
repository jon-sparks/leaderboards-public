require('dotenv').config()
var format = require('pg-format');
const { Pool, Client } = require('pg')
// const Pool = require('pg').Pool

const pool = new Pool()
const client = new Client()

//Selects
const getDrivers = (request, response) => {
  pool.query(`select d.id, d.first_name, d.last_name, d.category, t.name as team
  from "Drivers" as d
  left join "Teams" as t
  on d.team_id = t.ID
  where d.deleted_on is null
  order by d.category`, (error, results) => {
    if (error) {
      throw error
    }
    response.json(results.rows)
  })
}
const getTeams = (request, response) => {
  pool.query(`select * from "Teams"
  where deleted_on is null`, (error, results) => {
    if (error) {
      throw error
    }
    response.json(results.rows)
  })
}
const getSeasons = (request, response) => {
  const query = `select * from "Seasons"`

  pool.query(query, (error, results) => {
    if (error) {
      throw error
    }
    response.json(results.rows)
  })
}
const getEvents = (request, response) => {
  const query = `select e.id, e.round, e.track from "Events" as e
  left join "Seasons" as s
  on s.id = season_id
  where s.year = $1`

  const queryData = [request.params.year]

  pool.query(query, queryData, (error, results) => {
    if (error) {
      throw error
    }
    response.json(results.rows)
  })
}
const getRaces = (request, response) => {
  const query = `select r.id as race_id, r.is_final, r.heat from "Races" as r
  left join "Events" as e
  on r.event_id = e.id
  where e.id = $1
  order by r.heat`

  const queryData = [request.params.id]

  pool.query(query, queryData, (error, results) => {
    if (error) {
      throw error
    }
    response.json(results.rows)
  })
}
const getResults = (request, response) => {
  const query = `select * from "Results" as res
  left join "Races" as r
  on res.race_id = r.id
  left join "Drivers" as d
  on res.driver_id = d.id
  where r.id = $1 and d.deleted_on is null
  order by res.position asc`

  const queryData = [request.params.id]

  pool.query(query, queryData, (error, results) => {
    if (error) {
      throw error
    }
    response.json(results.rows)
  })
}
const getSeasonStandings = (request, response) => {
  const query = `select d.first_name, d.last_name, d.category, t.name as team_name, SUM((p.points->>res.position)::int) as score from "Results" as res
  left join "Races" as r
  on res.race_id = r.id
  left join "Drivers" as d
  on res.driver_id = d.id
  left join "Teams" as t
  on t.id = d.team_id
  left join "Events" as e
  on r.event_id = e.id
  left join "Points" as p
  on r.points_id = p.id
  left join "Seasons" as s
	on e.season_id = s.id
	where r.is_final is true and e.season_id = 1 and s.year = $1
  group by d.id, t.name
  order by score desc`

  const queryData = [request.params.year]

  pool.query(query, queryData, (error, results) => {
    if (error) {
      throw error
    }
    response.json(results.rows)
  })
}
const getTeamStandings = (request, response) => {
  const query = `with driver_scores as (
    select d.first_name, d.last_name, t.name as team_name, SUM((p.points->>res.position)::int) as score from "Results" as res
    left join "Races" as r
    on res.race_id = r.id
    left join "Drivers" as d
    on res.driver_id = d.id
    left join "Teams" as t
    on t.id = d.team_id
    left join "Events" as e
    on r.event_id = e.id
    left join "Points" as p
    on r.points_id = p.id
    left join "Seasons" as s
    on e.season_id = s.id
    where r.is_final is true and e.season_id = 1 and s.year = $1
    group by d.id, t.name
    order by score desc
  ) 
  select team_name, sum(score) from driver_scores
  group by team_name`

  const queryData = [request.params.year]

  pool.query(query, queryData, (error, results) => {
    if (error) {
      throw error
    }
    response.json(results.rows)
  })
}

//Inserts
const insertDriver = (req, res) => {
  const query = `INSERT INTO "Drivers"(first_name, last_name, category, team_id) VALUES($1, $2, $3, $4) RETURNING *;`
  const formData = [req.body.firstName, req.body.lastName, req.body.category, req.body.team]
  pool.query(query, formData, (err, res) => {
    if (err) {
      console.log(err.stack)
    } else {
      // console.log(res.rows[0])
    }
  })
  res.status(200).send(req.body);
}
const insertTeam = (req, res) => {
  const query = `INSERT INTO "Teams"(name) VALUES($1) RETURNING *;`
  const formData = [req.body.name]
  pool.query(query, formData, (err, res) => {
    if (err) {
      console.log(err.stack)
    } else {
      console.log(res.rows[0])
    }
  })
  res.status(200).send(req.body);
}
















const insertEvent = (req, res) => {



  pool.connect((err, client, done) => {
    const shouldAbort = err => {
      if (err) {
        console.error('Error in transaction', err.stack)
        client.query('ROLLBACK', err => {
          if (err) {
            console.error('Error rolling back client', err.stack)
          }
          // release the client back to the pool
          done()
        })
      }
      return !!err
    }

    const insertEventSql = `
  INSERT INTO "Events" (track, driver_ids, season_id, round) VALUES ($1, $2, $3, $4)
  RETURNING id as new_event_id`

    // BEGIN transaction
    client.query('BEGIN', err => {

      const formData = [req.body.trackName, req.body.selectedDrivers, req.body.selectedSeason.id, req.body.noOfRounds];
      const heats = req.body.noOfHeats;
      let newEventId;
      console.log(formData)

      // INSERT the Event
      client.query(insertEventSql, formData, (err, res) => {
        console.log('.........insert event.........')
        newEventId = res.rows[0].new_event_id
        console.log(res)
        if (err) {
          console.log(err)
        }

        // Prepare the Race data, using the event ID from above
        const raceData = []

        for (let i = 1; i <= heats; i++) {
          raceData.push([newEventId, false, i])
        }

        const insertRaceSql = format(`INSERT INTO "Races" (event_id, is_final, heat) VALUES %L`, raceData)

        // INSERT the Race
        client.query(insertRaceSql, (err, res) => {
          console.log('..........insertRaceSql.............')
          console.log(res)
          if (err) {
            console.log(err)
          }

          // COMMIT the data for the transaction
          client.query('COMMIT', err => {
            if (err) {
              console.error('Error committing transaction', err.stack)
            }
            done()
            
          })
        })
      })
    });
  })
  res.status(200).send(req.body)
}












//Deletes
const deleteDriver = (req, res) => {
  const query = `UPDATE "Drivers"
  SET deleted_on = CURRENT_DATE
  where id = $1`
  const driverData = [req.body.id]
  console.log(driverData)
  pool.query(query, driverData, (err, res) => {
    if (err) {
      console.log(err.stack)
    } else {
      // console.log(res.rows[0])
    }
  })
  res.status(200).send(req.body);
}
const deleteTeam = (req, res) => {
  const query = `UPDATE "Teams"
  SET deleted_on = CURRENT_DATE
  where id = $1;`
  const teamData = [req.body.id]
  console.log(teamData)
  pool.query(query, teamData, (err, res) => {
    if (err) {
      console.log(err.stack)
    } else {
      // console.log(res.rows[0])
    }
  })
  res.status(200).send(req.body);
}


module.exports = {
  getDrivers,
  getTeams,
  getEvents,
  getSeasons,
  getRaces,
  getResults,
  getSeasonStandings,
  getTeamStandings,
  insertDriver,
  insertTeam,
  insertEvent,
  deleteDriver,
  deleteTeam
}
