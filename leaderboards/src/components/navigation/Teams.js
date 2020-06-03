import React from 'react';
import TeamTable from '../TeamTable'
import { Pagewrap } from '../styled/styled';

function Teams(props) {
    return (
        <Pagewrap>
            <TeamTable
                teamHandler={props.teamHandler}
                addTeam={props.addTeam}
                removeTeamFromState={props.removeTeamFromState}
                teams={props.teams}
                drivers={props.drivers}
            />
        </Pagewrap>
    );
}

export default Teams;