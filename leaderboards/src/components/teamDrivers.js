import React, { useState, useEffect, Fragment } from 'react';
function TeamDrivers(props) {

    const [teamDrivers, setTeamDrivers] = useState([]);

    async function fetchTeamDrivers() {
        const response = await fetch('/api/team-drivers')
            .then(response => response.json())
            .then(data => {
            setTeamDrivers(data)
        })
    }
    
    useEffect(() => {
        fetchTeamDrivers()
    }, [])

    return (
        <Fragment>
            <h2>{props.query} info</h2>
            <ul>
                {
                    teamDrivers.map((team) => <li key={team.id}>{team.name}</li>)
                }
            </ul>
        </Fragment>
    );
}
export default TeamDrivers;