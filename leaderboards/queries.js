require('dotenv').config()
var format = require('pg-format');
const { Pool, Client } = require('pg')
// const Pool = require('pg').Pool

const pool = new Pool()
const client = new Client()

//Selects
const getDrivers = _ => 
  pool.query(`select d.id, d.first_name, d.last_name, d.category, d.deleted_on, t.name as team,
	SUM(
		CASE 
			WHEN res.position = 1 THEN 1
		ELSE 
			null 
		END
	) as total_wins 
  from "Drivers" as d
  left join "Teams" as t
  on d.team_id = t.ID
  left join "Results" as res
  on d.id = res.driver_id
  where d.deleted_on is null
  group by d.id, t.name
  order by d.category`)

const getTeams = _ => 
  pool.query(`select t.name as name, t.id, SUM(
		CASE 
			WHEN res.position = 1 THEN 1
		ELSE 
			null 
		END
	) as total_wins 
  from "Teams" as t
  left join "Drivers" as d
  on t.id = d.team_id
  left join "Results" as res
  on d.id = res.driver_id
  where t.deleted_on is null
  group by t.name, t.id`)

const getSeasons = _ => 
  pool.query(`select * from "Seasons"`)

const getEvents = ({year}) => {
  const query = `select e.id, e.round, e.track from "Events" as e
  left join "Seasons" as s
  on s.id = season_id
  where s.year = $1`

  return pool.query(query, [year]) 
}

const getRaces = ({id}) => {
  const query = `select r.id as race_id, r.is_final, r.heat from "Races" as r
  left join "Events" as e
  on r.event_id = e.id
  where e.id = $1
  order by r.heat`

  return pool.query(query, [id])
}
const getResults = ({id}) => {
  const query = `select d.first_name, d.last_name, d.category, t.name as team_name, r.is_final, r.heat, res.position, res.id from "Results" as res
  left join "Races" as r
  on res.race_id = r.id
  left join "Drivers" as d
  on res.driver_id = d.id
  left join "Teams" as t
  on d.team_id = t.id
  where r.id = $1 and d.deleted_on is null
  order by res.position asc`

  return pool.query(query, [id])
}
const getSeasonStandings = ({year}) => {
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
	where r.is_final is true and s.year = $1
  group by d.id, t.name
  order by score desc`

  return pool.query(query, [year])
}
const getTeamStandings = ({year}) => {
  // Initial query
  // const query = `with driver_scores as (
  //   select d.first_name, d.last_name, t.name as team_name, SUM((p.points->>res.position)::int) as score from "Results" as res
  //   left join "Races" as r
  //   on res.race_id = r.id
  //   left join "Drivers" as d
  //   on res.driver_id = d.id
  //   left join "Teams" as t
  //   on t.id = d.team_id
  //   left join "Events" as e
  //   on r.event_id = e.id
  //   left join "Points" as p
  //   on r.points_id = p.id
  //   left join "Seasons" as s
  //   on e.season_id = s.id
  //   where r.is_final is true and s.year = $1 and t.deleted_on is null
  //   group by d.id, t.name
  //   order by score desc
  // ) 
  // select team_name, sum(score) from driver_scores
  // group by team_name
  // order by sum desc`

  // New query
  const query = `with ranked_teams as (
    select rank_filter.* from (
      with driver_scores as (
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
        where r.is_final is true and s.year = $1 and t.deleted_on is null
        group by d.id, t.name
        order by score desc
      )
      select score, team_name,
        rank() OVER(
          partition by team_name
          order by score desc
        )
      from driver_scores
    ) rank_filter WHERE RANK < 4
  )
  select team_name, sum(score) from ranked_teams
  group by team_name
  order by sum desc`

  return pool.query(query, [year])
}
const getEmptyRaces = _ => 
  pool.query(`select e.id as event_id, e.track, e.season_id, e.round, s.year, r.id as race_id, r.is_final, r.heat as heat, res.id as results_id from "Events" as e
  left join "Seasons" as s
  on e.season_id = s.id
  left join "Races" as r
  on e.id = r.event_id
  left join "Results" as res
  on r.id = res.race_id
  where res.id is null
  order by s.year asc, round asc, heat asc`)

const getRaceDrivers = ({id}) => {
  const query = `select e.driver_ids, e.id as event_id, array_agg(d.first_name) as first_names, array_agg(d.last_name) as last_names from "Events" as e
  left join "Drivers" as d
  on d.id = any(e.driver_ids)
  where e.id = $1
  group by event_id`

  return pool.query(query, [id])
}

//Inserts
const insertDriver = ({firstName, lastName, category, team}) => {
  const data = [firstName, lastName, category, team]
  const query = `INSERT INTO "Drivers"(first_name, last_name, category, team_id) VALUES($1, $2, $3, $4) RETURNING *;`
  return pool.query(query, data)
}

const insertTeam = ({name}) => {
  const query = `INSERT INTO "Teams"(name) VALUES($1) RETURNING *;`
  return pool.query(query, [name])
}

const insertRaceResults = data => {
  console.log(Object.values(data))
  const query = format(`INSERT INTO "Results"(race_id, driver_id, position) VALUES %L`, Object.values(data))
  console.log(query)
  return pool.query(query)
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
  INSERT INTO "Events" (track, driver_ids, season_id, round, date) VALUES ($1, $2, $3, $4, $5)
  RETURNING id as new_event_id`

    // BEGIN transaction
    client.query('BEGIN', err => {

      const formData = [req.body.trackName, req.body.selectedDrivers, req.body.selectedSeason.id, req.body.noOfRounds, req.body.date];
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
        const raceData = [[newEventId, true, null, 1]]

        for (let i = 1; i <= heats; i++) {
          raceData.push([newEventId, false, i, 1])
        }

        const insertRaceSql = format(`INSERT INTO "Races" (event_id, is_final, heat, points_id) VALUES %L`, raceData)

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
const deleteDriver = ({id}) => {
  const query = `UPDATE "Drivers"
  SET deleted_on = CURRENT_DATE
  where id = $1`
  return pool.query(query, [id])
}
const deleteTeam = ({id}) => {
  const query = `UPDATE "Teams"
  SET deleted_on = CURRENT_DATE
  where id = $1;`
  return pool.query(query, [id])
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
  getEmptyRaces,
  getRaceDrivers,
  insertRaceResults,
  insertDriver,
  insertTeam,
  insertEvent,
  deleteDriver,
  deleteTeam
}
