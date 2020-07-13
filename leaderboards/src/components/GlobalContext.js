import React, { useState, createContext } from 'react'

export const GlobalContext = createContext()

export const GlobalProvider = props => {

    const [modalOpen, setModalOpen] = useState(false)

    const [drivers, setDrivers] = useState([])
    const [driversLoading, setDriversLoading] = useState(false)
    const [teams, setTeams] = useState([])
    const [teamsLoading, setTeamsLoading] = useState(false)

    const [seasons, setSeasons] = useState([])
    
    const toggleModal = () => {
        setModalOpen(!modalOpen)
    }

    const addNewDriver = (e, data) => {
        e.preventDefault()
        setDrivers([...drivers, {
            first_name: data.firstName,
            last_name: data.lastName,
            category: data.category,
            team: data.team
        }])
    }

    const addNewTeam = (e, data) => {
        e.preventDefault()
        setTeams([...teams, {
          name: data.name
        }])
      }

    const removeDriverFromState = data => {
        const newDrivers = drivers.filter(driver => driver.id.toString() !== data)
        setDrivers(newDrivers)
    }

    const removeTeamFromState = data => {
        const newTeams = teams.filter(team => team.id.toString() !== data)
        setTeams(newTeams)
    }

    async function fetchDrivers() {
        setDriversLoading(true)
        await fetch(`/api/drivers`)
            .then(response => response.json())
            .then(data => setDrivers(data))
            .then(() => setDriversLoading(false))
    }

    async function fetchTeams() {
        setTeamsLoading(true)
        await fetch(`/api/teams`)
            .then(response => response.json())
            .then(data => setTeams(data))
            .then(() => setTeamsLoading(false))
    }

    
    async function fetchSeasons() {
        await fetch(`/api/seasons`)
            .then(response => response.json())
            .then(data => setSeasons(data))
    }

    return (
        <GlobalContext.Provider value={{ modalOpen, setModalOpen, toggleModal, seasons, setSeasons, fetchSeasons, drivers, driversLoading, addNewDriver, removeDriverFromState, setDrivers, fetchDrivers, teams, teamsLoading, setTeams, fetchTeams, addNewTeam, removeTeamFromState }}>
            {props.children}
        </GlobalContext.Provider>
    )
}