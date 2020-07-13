import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { RaceModalDiv, DriverWrapper, AddButton, ModalClose } from './styled/styled'

function RaceModal({ handleModal, raceData, removeUpdatedRace }) {

    const [drivers, setDrivers] = useState([])
    const [positions, setPositions] = useState([])
    
    async function fetchRaceDrivers(eventId) {
        await fetch(`/api/race-drivers/${eventId}`)
            .then(response => response.json())
            .then(data => setDrivers(data))
    }

    const insertPositions = () => {
        fetch(`/api/insert-positions`,
            {
                method:'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(positions)
            })
            .then(response => response.json())
    }

    const uray = []
    const handlePositions = (e, pos) => {
        uray[pos - 1] = [raceData.race_id, parseInt(e.currentTarget.value), pos]
        console.log(uray)
    }
    const savePositions = () => {
        setPositions(uray)
        handleModal()
    }

    const outputDrivers = () => {

        let arr = []
        
        for(let i = 1; i <= drivers[0].first_names.length; i++){
            arr.push(
                <div key={i}>
                    <span>{i}</span>
                    <select onChange={e => handlePositions(e, i)}>
                        <option>N/A</option>
                        {drivers[0].first_names.map((name, index) =>
                            <option key={index} value={drivers[0].driver_ids[index]}>{name} {drivers[0].last_names[index]}</option>
                        )}
                    </select>
                </div>
            )
        }
            
        return arr

    }

    useEffect(() => {
        fetchRaceDrivers(raceData.event_id)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if(positions.length){
            insertPositions()
            removeUpdatedRace(raceData.race_id)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [positions])

    return (
        
            <RaceModalDiv initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
                <motion.div initial={{y: '-100vh'}} animate={{y: 0}} exit={{y: '100vh'}}>
                    <div>
                        <h2>{raceData.year} - Round {raceData.round}</h2>
                    </div>
                    <div>
                        <h3>{raceData.track} - {raceData.heat ? 'Heat ' + raceData.heat : 'Final'}</h3>
                    </div>

                    <DriverWrapper>
                        {drivers[0] ? outputDrivers() : ''}
                    </DriverWrapper>
                    

                    <AddButton onClick={savePositions}>Save results</AddButton>

                    <ModalClose onClick={handleModal} />

                </motion.div>
            </RaceModalDiv>
    )
}
export default RaceModal