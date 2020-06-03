import React from 'react';
import DriverTable from '../DriverTable'
import { Pagewrap } from '../styled/styled'

function Drivers(props) {
    
    return (
        <Pagewrap>
            <DriverTable
                driverHandler={props.driverHandler}
                addDriver={props.addDriver}
                removeDriverFromState={props.removeDriverFromState}
                drivers={props.drivers}
                teamHandler={props.teamHandler}
                teams={props.teams}
            />
        </Pagewrap>
    );
}

export default Drivers;