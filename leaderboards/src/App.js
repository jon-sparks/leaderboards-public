import React, { useState, useContext } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import styled from 'styled-components'

import Navigation from './components/Navigation'
import ProtectedRoute from './components/ProtectedRoute'

import Modal from './components/Modal'
import { GlobalContext } from './components/GlobalContext'

import { Drivers, Teams, Standings, Events, Error } from './components/navigation/Index'

import './stylesheets/App.css'
import { AnimatePresence } from 'framer-motion'

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-wrap: nowrap;
`



function App() {

  const { modalOpen } = useContext(GlobalContext)

  const [events, setEvents] = useState([]);
  const [seasonStandings, setSeasonStandings] = useState([])
  const [teamStandings, setTeamStandings] = useState([])

  const eventsHandler = (data) => {
    setEvents(data)
  }
  const standingsHandler = (data) => {
    setSeasonStandings(data)
  }
  const teamStandingsHandler = (data) => {
    setTeamStandings(data)
  }

  return (

      <BrowserRouter>
        <Wrapper id="wrapper">
          <Navigation />
          <Switch>
            {/* <Route path="/" component={Home} exact /> */}
            <Route path="/" render={(props) => <Standings {...props} eventsHandler={eventsHandler} events={events} standingsHandler={standingsHandler} standings={seasonStandings} teamStandingsHandler={teamStandingsHandler} teamStandings={teamStandings} />} exact />
            <Route path="/drivers" render={(props) => <Drivers {...props} />} exact />
            <Route path="/teams" render={(props) => <Teams {...props} />} exact />
            <ProtectedRoute path="/events" component={Events} exact />
            <Route component={Error} />
          </Switch>
          <AnimatePresence>
            { modalOpen && 
              <Modal /> }
          </AnimatePresence>

        </Wrapper>
      </BrowserRouter>


  );
}

export default App;
