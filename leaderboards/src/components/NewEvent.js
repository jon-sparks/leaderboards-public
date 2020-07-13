import React, { useState, useEffect, useContext, Fragment } from 'react'
import { GlobalContext } from './GlobalContext'
import { InlineFieldset, Label, Input, FormSubtitle, Radio, RadioLabel, DriverCheckbox, EventForm, AddButton } from './styled/styled'

function NewEvent({ fetchEmptyRaces, setNewEventToggle }) {

    const { seasons, fetchSeasons, drivers, fetchDrivers } = useContext(GlobalContext)
    const [selectedSeason, setSelectedSeason] = useState({})
    const [noOfRounds, setNoOfRounds] = useState(0)
    const [trackName, setTrackName] = useState('')
    const [noOfHeats, setNoOfHeats] = useState(0)
    const [selectedDrivers, setSelectedDrivers] = useState([])
    const [date, setDate] = useState(null)

    useEffect(() => {
        if(drivers.length < 1){
            fetchDrivers()
        }
        if(seasons.length < 1){
            fetchSeasons()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleSeason = e => {
        setSelectedSeason(
            {
                id: e.target.getAttribute('data-id'),
                year: e.target.getAttribute('value')
            }
        )
    }

    const handleTrack = e => setTrackName(e.target.value)
    const handleRounds = e => setNoOfRounds(e.target.value)
    const handleHeats = e => setNoOfHeats(e.target.value)
    const handleDate = e => setDate(e.target.value)
    
    const handleDriverCheck = e => {
        const arr = [...selectedDrivers]
        const val = parseInt(e.target.getAttribute('value'))
        const index = arr.indexOf(val)
        if(index > -1){
            arr.splice(index, 1)
            setSelectedDrivers(arr.sort())
        } else {
            const preArr = [...selectedDrivers, val]
            setSelectedDrivers(preArr.sort())
        }
        
    }

    const insertEvent = (e) => {
        e.preventDefault()
        fetch(`/api/insert-event`,
            {
                method:'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    selectedSeason,
                    trackName,
                    noOfRounds,
                    noOfHeats,
                    selectedDrivers,
                    date
                })
            })
            .then(response => response.json())
            .then(() => {
                setTimeout(() => {
                    fetchEmptyRaces()
                }, 1500)
            })
            .then(() => setNewEventToggle(false))
    }

    return (
        <Fragment>
            <EventForm onSubmit={insertEvent}>
                <InlineFieldset>
                    <FormSubtitle>Season</FormSubtitle>
                    { 
                        seasons.map((season, index) => 
                            <div key={season.id} onChange={handleSeason}>
                                <Radio type="radio" name="season" id={season.year} data-id={season.id} value={season.year} />
                                <RadioLabel htmlFor={season.year}>{season.year}</RadioLabel>
                            </div>
                        )
                    }
                </InlineFieldset>
                <InlineFieldset>
                    <FormSubtitle>Round</FormSubtitle>
                    <Label htmlFor="roundno">Round no.</Label>
                    <Input id="roundno" type="number" placeholder="0" onChange={handleRounds} />
                    <Label htmlFor="trackname">Track name</Label>
                    <Input id="trackname" type="text" placeholder="eg. Llandow" onChange={handleTrack} />
                    <Label htmlFor="rounds">Number of heats</Label>
                    <Input id="rounds" type="number" min="0" max="20" placeholder="0" onChange={handleHeats} />
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" type="date" onChange={handleDate} />

                </InlineFieldset>
                <InlineFieldset>
                    <FormSubtitle>Drivers</FormSubtitle>
                    { 
                        drivers.map(driver => 
                        <DriverCheckbox key={driver.id}>
                            <input type="checkbox" id={driver.id} value={driver.id} onChange={handleDriverCheck}></input>
                            <label htmlFor={driver.id}>{driver.first_name} {driver.last_name}</label>
                        </DriverCheckbox>
                        )
                    }
                </InlineFieldset>
                <AddButton type="submit" onClick={(e) => insertEvent(e)}>Save event</AddButton>
            </EventForm>
        </Fragment>
    )
}

export default NewEvent