import React, { useState, useEffect, useContext, Fragment } from 'react'
import { Table, InlineList, ToggleButton, SeasonSelect, RoundSelect, FlexRow, TableTitle } from './styled/styled'
import { Events } from './navigation/Index'
import Trophy from './icons/Trophy'
import { GlobalContext } from './GlobalContext'

function EventTable(props) {

    const [loading, setLoading] = useState(false)

    const {seasons, setSeasons} = useContext(GlobalContext)
    const [selectedSeason, setSelectedSeason] = useState(`${new Date().getFullYear()}`)
    const [selectedRound, setSelectedRound] = useState('1')
    const [selectedRace, setSelectedRace] = useState('1')

    const [events, setEvents] = useState([])
    const [rounds, setRounds] = useState([])
    const [results, setResults] = useState([])

    //For underlining the active race button
    const [activeRace, setActiveRace] = useState(-1)

    async function fetchSeasons() {
        await fetch(`/api/seasons`)
            .then(response => response.json())
            .then(data => setSeasons(data))
    }
    async function fetchEvents(year) {
        await fetch(`/api/events/${parseInt(year)}`)
            .then(response => response.json())
            .then(data => setEvents(data))
    }
    async function fetchRaces(id) {
        await fetch(`/api/races/${parseInt(id)}`)
            .then(response => response.json())
            .then(data => setRounds(data))
    }
    async function fetchResults(id) {
        await fetch(`/api/results/${parseInt(id)}`)
            .then(response => response.json())
            .then(data => setResults(data))
    }


    async function fetchSeasonStandings(year) {
        setLoading(true)
        await fetch(`/api/season-standings/${parseInt(year)}`)
            .then(response => response.json())
            .then(data => props.standingsHandler(data))
            .then(setLoading(false))
    }
    async function fetchTeamStandings(year) {
        await fetch(`/api/team-standings/${parseInt(year)}`)
            .then(response => response.json())
            .then(data => props.teamStandingsHandler(data))
    }
    
    useEffect(() => {
        if(seasons.length < 1) {
            fetchSeasons() 
        }

    }, [])
    useEffect(() => {
        fetchEvents(selectedSeason)
        fetchSeasonStandings(selectedSeason)
        fetchTeamStandings(selectedSeason)
    }, [selectedSeason])
    useEffect(() => {
        fetchRaces(selectedRound)
    }, [selectedRound])
    useEffect(() => {
        fetchResults(selectedRace)
    }, [selectedRace])

    const handleSeasonSelect = (e) => {
        setSelectedSeason(e.currentTarget.value)
        setActiveRace(-1)
    }
    const handleRoundSelect = (e) => {
        setSelectedRound(e.currentTarget.value)
        setActiveRace(-1)
    }
    const handleRaceSelect = (id) => {
        // console.log(id)
        setSelectedRace(id)
    }

    //Determine points for table
    const hPoints = [null, 10, 8, 7, 6, 5, 4, 3, 2, 1, 0]
    const heatPoints = pos => hPoints[pos]
   
    //Determine points for table
    const fPoints = [null, 60, 56, 54, 52, 50, 48, 46, 44, 42, 40, 38, 36, 34, 32, 30, 28, 26]
    const finalPoints = pos => fPoints[pos]

    const trophies = [
        {colour: '#FFD100', size: 25},
        {colour: '#C0C0C0', size: 22},
        {colour: '#B08D57', size: 19}
    ]
    const pickTrophy = idx => trophies[idx]

    return (
        <Fragment>

            
                <SeasonSelect onChange={handleSeasonSelect}>
                {
                    seasons.map((season, index) => 
                        <option key={season.id}>{season.year}</option>
                    )
                }
                </SeasonSelect>

                <FlexRow>
                <div>
                    <TableTitle>Heavy weight Driver Standings</TableTitle>
                    <Table>
                        <thead>
                            <tr>
                                <th>Pos.</th>
                                <th>Driver</th>
                                <th>Team</th>
                                <th>Total Points</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            props.standings.filter(standing => standing.category === 'HW').map((standing, index) => 
                                <tr key={index}>
                                    <td>{index < 3 ? <Trophy colour={pickTrophy(index).colour} size={pickTrophy(index).size} /> : index + 1}</td>
                                    <td>{standing.first_name} {standing.last_name}</td>
                                    <td>{standing.team_name}</td>
                                    <td>{standing.score}</td>
                                </tr>
                            )
                        }
                        </tbody>
                    </Table>
                </div>
                
                <div>
                    <TableTitle>Light weight Driver Standings</TableTitle>
                    <Table>
                        <thead>
                            <tr>
                                <th>Pos.</th>
                                <th>Driver</th>
                                <th>Team</th>
                                <th>Total Points</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            props.standings.filter(standing => standing.category === 'LW').map((standing, index) => 
                                <tr key={index}>
                                    <td>{index < 3 ? <Trophy colour={pickTrophy(index).colour} size={pickTrophy(index).size} /> : index + 1}</td>
                                    <td>{standing.first_name} {standing.last_name}</td>
                                    <td>{standing.team_name}</td>
                                    <td>{standing.score}</td>
                                </tr>
                            )
                        }
                        </tbody>
                    </Table>
                </div>
                </FlexRow>

                <FlexRow>
                    <div>
                        <TableTitle>Full Driver Standings</TableTitle>
                        <Table>
                            <thead>
                                <tr>
                                    <th>Pos.</th>
                                    <th>Driver</th>
                                    <th>Team</th>
                                    <th>Total Points</th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                props.standings.map((standing, index) => 
                                    <tr key={index}>
                                        <td>{index < 3 ? <Trophy colour={pickTrophy(index).colour} size={pickTrophy(index).size} /> : index + 1}</td>
                                        <td>{standing.first_name} {standing.last_name}</td>
                                        <td>{standing.team_name}</td>
                                        <td>{standing.score}</td>
                                    </tr>
                                )
                            }
                            </tbody>
                        </Table>
                    </div>

                    <div>
                        <TableTitle>Team Standings</TableTitle>
                        <Table>
                            <thead>
                                <tr>
                                    <th>Pos.</th>
                                    <th>Team</th>
                                    <th>Total Points</th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                props.teamStandings.map((teamStanding, index) => 
                                    <tr key={index}>
                                        <td>{index < 3 ? <Trophy colour={pickTrophy(index).colour} size={pickTrophy(index).size} /> : index + 1}</td>
                                        <td>{teamStanding.team_name}</td>
                                        <td>{teamStanding.sum}</td>
                                    </tr>
                                )
                            }
                            </tbody>
                        </Table>
                    </div>
                    
                </FlexRow>
                

                

                <RoundSelect onChange={handleRoundSelect} >
                    {
                        events.map((event, index) => 
                            <option key={event.id} value={event.round}>Round {event.round} - {event.track}</option>
                        )
                    }
                </RoundSelect>

                <InlineList>
                {
                    rounds.map((round, index) => 
                        <li key={round.race_id}>
                            <ToggleButton className={activeRace === index ? 'active' : ''} onClick={(e) => {
                                handleRaceSelect(round.race_id)
                                setActiveRace(index)
                            }
                        }>{round.heat ? `Heat ${round.heat}` : `Final`}</ToggleButton>
                        </li>
                    )
                }
                </InlineList>

                <Table>
                    <thead>
                        <tr>
                            <th>Pos.</th>
                            <th>Driver</th>
                            <th>Category</th>
                            <th>Points</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        results.map((result, index) => 
                            <tr key={result.id}>
                                <td>{index < 3 ? <Trophy colour={pickTrophy(index).colour} size={pickTrophy(index).size} /> : index + 1}</td>
                                <td>{result.first_name} {result.last_name}</td>
                                <td>{result.category}</td>
                                <td>{ result.is_final ? finalPoints(result.position) : heatPoints(result.position) }</td>
                            </tr>
                        )
                    }
                    </tbody>
                </Table>

                
            

        </Fragment>
    );
}
export default EventTable;