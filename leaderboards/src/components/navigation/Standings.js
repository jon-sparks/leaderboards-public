import React from 'react';
import StandingsTable from '../StandingsTable'
import { Pagewrap } from '../styled/styled';

function Standings(props) {
    return (
        <Pagewrap>
            <StandingsTable events={props.events} eventsHandler={props.eventsHandler} standingsHandler={props.standingsHandler} standings={props.standings} teamStandingsHandler={props.teamStandingsHandler} teamStandings={props.teamStandings}></StandingsTable>
        </Pagewrap>
    );
}

export default Standings;