import React from 'react';
import DriverTable from '../DriverTable'
import { Pagewrap } from '../styled/styled'

function Drivers(props) {
    
    return (
        <Pagewrap>
            <DriverTable
                teamHandler={props.teamHandler}
                teams={props.teams}
            />
        </Pagewrap>
    );
}

export default Drivers;