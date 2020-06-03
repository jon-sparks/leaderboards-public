import React, { useState, useContext } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import styled from 'styled-components'

import Navigation from './components/Navigation'

import Modal from './components/Modal'
import { Account } from './components/login/Accounts'
import { GlobalContext } from './components/GlobalContext'

import { Home, Drivers, Teams, Standings, Events, Error } from './components/navigation/Index'

import './stylesheets/App.css'

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-wrap: nowrap;
`



function App() {

  const globalState = useContext(GlobalContext)

  const [drivers, setDrivers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [events, setEvents] = useState([]);
  const [seasonStandings, setSeasonStandings] = useState([])
  const [teamStandings, setTeamStandings] = useState([])

  const driverHandler = (data) => {
    setDrivers(data)
  }
  const teamHandler = (data) => {
    setTeams(data)
  }
  const eventsHandler = (data) => {
    setEvents(data)
  }
  const standingsHandler = (data) => {
    setSeasonStandings(data)
  }
  const teamStandingsHandler = (data) => {
    setTeamStandings(data)
  }

  const addDriver = (e, data) => {
    e.preventDefault()
    setDrivers([...drivers, {
      first_name: data.firstName,
      last_name: data.lastName,
      category: data.category,
      team: data.team
    }])
  }
  const addTeam = (e, data) => {
    e.preventDefault()
    setTeams([...teams, {
      name: data.name
    }])
  }
  const removeDriverFromState = (data) => {
    const newDrivers = drivers.filter(driver => driver.id.toString() !== data)
    setDrivers(newDrivers)
  }
  const removeTeamFromState = (data) => {
    const newTeams = teams.filter(team => team.id.toString() !== data)
    setTeams(newTeams)
  }

  return (

    <Account>
      <BrowserRouter>
        <Wrapper id="wrapper">
          <Navigation />
          <Switch>
            <Route path="/" component={Home} exact />
            <Route path="/drivers" render={(props) => <Drivers {...props} driverHandler={driverHandler} addDriver={addDriver} removeDriverFromState={removeDriverFromState} drivers={drivers} teamHandler={teamHandler} teams={teams} />} exact />
            <Route path="/teams" render={(props) => <Teams {...props} teamHandler={teamHandler} addTeam={addTeam} removeTeamFromState={removeTeamFromState} teams={teams} drivers={drivers} />} exact />
            <Route path="/teams" component={Teams} exact />
            <Route path="/standings" render={(props) => <Standings {...props} eventsHandler={eventsHandler} events={events} standingsHandler={standingsHandler} standings={seasonStandings} teamStandingsHandler={teamStandingsHandler} teamStandings={teamStandings} />} exact />
            <Route path="/events" render={(props) => <Events {...props} />} exact />
            <Route component={Error} />
          </Switch>
        
          {globalState.modalOpen ? <Modal /> : ''}

        </Wrapper>
      </BrowserRouter>
    </Account>

  );
}

export default App;
