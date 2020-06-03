import React, { useState, useEffect, useContext, Fragment } from 'react'
import { Table, AddButton, FlexForm, FormRow, FormItem } from './styled/styled'
import { AccountContext } from './login/Accounts'

function TeamTable(props) {

    const accountState = useContext(AccountContext)

    const [formData, setFormData] = useState({
        name: ''
    })
    const [addTeam, setAddTeam] = useState(false)

    // async function fetchDrivers() {
    //     await fetch(`/api/drivers`)
    //         .then(response => response.json())
    //         .then(data => {
    //         props.driverHandler(data)
    //     })
    // }

    async function fetchTeams() {
        await fetch(`/api/teams`)
            .then(response => response.json())
            .then(data => {
            props.teamHandler(data)
        })
    }
    
    useEffect(() => {
        if(props.teams.length < 1){
            fetchTeams() 
        }
    }, [])

    const handleInputChange = e => {
        const {name, value} = e.target
        setFormData({...formData, [name]: value})
    }

    const insertTeam = (e) => {
        e.preventDefault()
        fetch(`/api/insert-team`,
            {
                method:'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
    }

    const deleteTeam = (teamId) => {
        fetch(`/api/delete-team`,
            {
                method:'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({"id":teamId})
            })
            .then(response => response.json())
            .then(() => props.removeTeamFromState(teamId))
    }

    const handleAddTeam = () => {
        if(props.teams.length < 1){
            fetchTeams()
        }
        setAddTeam(addTeam ? false : true)
    }

    const handleDelete = (e) => {
        const conf = window.confirm(`Are you sure you want to delete the team ${e.currentTarget.dataset.name}?`)
        const teamId = e.currentTarget.dataset.key
        console.log(teamId)
        if (conf) {
            deleteTeam(teamId)
        } else {
            console.log('not deleted')
        }
    }

    const teamForm = 
    <FlexForm>

        <FormItem>
            <label htmlFor="name">Name</label>
            <input type="text" placeholder="..." name="name" value={formData.name} onChange={handleInputChange}></input>
        </FormItem>


        <button onClick={(e) => {props.addTeam(e, formData); insertTeam(e); handleAddTeam()}}>add team</button>
    </FlexForm>
    

    return (
        <Fragment>

            <Table>
                <thead>
                    <tr>
                        <th>Team name</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        props.teams.map((team, index) => 
                        <tr key={team.id}>
                            <td>{team.name}</td>
                            <td>
                                <button
                                    data-key={team.id}
                                    data-name={team.name}
                                    onClick={(e) => handleDelete(e)}>
                                    Delete
                                </button> 
                            </td>
                        </tr>)
                    }
                </tbody>
            </Table>

            {accountState.status ? <AddButton onClick={handleAddTeam}>Add a team</AddButton> : ''}


            
            {addTeam
                ? teamForm
                : ''
            }

        </Fragment>
    );
}
export default TeamTable;