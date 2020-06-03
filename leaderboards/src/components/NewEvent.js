import React, { useState, useEffect, useContext, Fragment } from 'react'
import { GlobalContext } from './GlobalContext'
import { Fieldset, InlineFieldset, Label, Input, Legend, FormSubtitle, Radio, RadioLabel } from './styled/styled'

function NewEvent() {

    const { seasons, setSeasons, drivers, setDrivers } = useContext(GlobalContext)
    const [selectedSeason, setSelectedSeason] = useState({})
    const [noOfRounds, setNoOfRounds] = useState(0)
    const [trackName, setTrackName] = useState('')
    const [noOfHeats, setNoOfHeats] = useState(0)
    const [selectedDrivers, setSelectedDrivers] = useState([])

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
    
    const handleDriverCheck = e => {
        const arr = [...selectedDrivers]
        const val = parseInt(e.target.getAttribute('value'))
        const index = arr.indexOf(val)
        if(index > -1){
            arr.splice(index, 1)
            setSelectedDrivers(arr)
        } else {
            setSelectedDrivers([...selectedDrivers, val])
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
                    selectedDrivers
                })
            })
            .then(response => response.json())
    }

    return (
        <Fragment>
            <h2>Add a new event</h2>
            <form onSubmit={insertEvent}>
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
                    <Fieldset>
                        <Legend>Who is taking part?</Legend>
                        { 
                            drivers.map(driver => 
                            <div key={driver.id}>
                                <input type="checkbox" id={driver.id} value={driver.id} onChange={handleDriverCheck}></input>
                                <label htmlFor={driver.id}>{driver.first_name} {driver.last_name}</label>
                            </div>
                            )
                        }
                   </Fieldset>


                </InlineFieldset>
                <button type="submit">add event</button>
            </form>
        </Fragment>
    )
}

export default NewEvent