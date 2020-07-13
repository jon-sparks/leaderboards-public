import React from 'react'
import { slate, blue, EmptyRaceDiv } from './styled/styled'

function EmptyRace({ year, round, track, heat, raceHandler, handleModal, index }){

    const seasonColour = season => {
        return {
            '2019':slate,
            '2020':blue,
            '2021':'green',
            '2022':'yellow'
        }[season] || 'red'
    }


    const roundCols = [null, '#FFF', '#FFFAE5', '#FFEFE2', '#FFE0E8', '#EEE4FF', '#E3F3FF', '#F4FEDC', '#ECF9E4', '#E4F2E9', '#C3DFFB']
    const roundColour = round => roundCols[round]

    return(

        <EmptyRaceDiv  onClick={ () => {raceHandler(index); handleModal()} }
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.9 }}
            positionTransition
            style={{boxShadow:`0px 3px 10px -5px rgba(0,0,0,0.3), inset 0 -3px 0 0 ${seasonColour(year)}`, background:`${roundColour(round)}`}}
        >
            <h2>{year}</h2>
            <h3>Round {round}</h3>
            <h3>{track}</h3>
            <h3>{heat ? 'Heat ' + heat : 'Final'}</h3>
        </EmptyRaceDiv>

    )
}

export default EmptyRace