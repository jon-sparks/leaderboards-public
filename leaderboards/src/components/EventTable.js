import React, { useState, useEffect, Fragment } from 'react'
import { AnimatePresence } from 'framer-motion'
import { EmptyRaceContainer, ExoH2, AddButton, blue } from './styled/styled'
import RaceModal from './RaceModal'
import NewEvent from './NewEvent'
import EmptyRace from './EmptyRace'

import Loader from 'react-loader-spinner'

function EventTable(props) {

    const [loading, setLoading] = useState(false)

    const [emptyRaces, setEmptyRaces] = useState([])
    const [selectedRace, setSelectedRace] = useState({})
    const [modalOpen, setModalOpen] = useState(false)
    const [newEventToggle, setNewEventToggle] = useState(false)

    async function fetchEmptyRaces() {
        setLoading(true)
        await fetch(`/api/empty-races`)
            .then(response => response.json())
            .then(data => setEmptyRaces(data))
            .then(() => setLoading(false))
    }

    const raceHandler = index => {
        setSelectedRace(emptyRaces[index])
    }

    const handleModal = () => {
        setModalOpen(!modalOpen)
    }

    const removeUpdatedRace = (selectedRace) => {
        const arr = [...emptyRaces]
        const newArr = arr.filter(race => race.race_id !== selectedRace)
        setEmptyRaces(newArr)
    }

    useEffect(() => {
        fetchEmptyRaces()
    }, [])

    return (
        <Fragment>
            <ExoH2> { (emptyRaces.length > 0) ? 'These races have no results yet' : (loading ? 'Loading Events...' : 'All races are up to date') } </ExoH2>

            { loading
                ? <Loader
                    type="Bars"
                    color={blue}
                    height={60}
                    width={80}
                    style={{textAlign:'center',padding:'50px'}}
                    />
                : 
                  <AnimatePresence>
                    <EmptyRaceContainer initial={{opacity: 0, y: -100}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: 100}}>
                        {emptyRaces.map((race, index) =>
                            // <button key={race.race_id} onClick={ () => {raceHandler(index); handleModal()} }>{race.year} - Round {race.round} - {race.track} - {race.heat ? 'Heat ' + race.heat : 'Final'}</button>
                            <EmptyRace year={race.year} round={race.round} track={race.track} heat={race.heat} raceHandler={raceHandler} handleModal={handleModal} index={index} key={race.race_id}/>
                        )}
                    </EmptyRaceContainer>
                  </AnimatePresence>
            }

            <AddButton onClick={() => setNewEventToggle(!newEventToggle)}>{newEventToggle ? 'Close' : 'Add an event'}</AddButton>

            {
                newEventToggle &&
                <NewEvent fetchEmptyRaces={fetchEmptyRaces} setNewEventToggle={setNewEventToggle} />
            }
            

            <AnimatePresence>
                {modalOpen && (
                    <RaceModal handleModal={handleModal} raceData={selectedRace} removeUpdatedRace={removeUpdatedRace} />
                )}
            </AnimatePresence>

        </Fragment>
    );
}
export default EventTable;