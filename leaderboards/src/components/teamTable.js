import React, { useState, useEffect, useContext, Fragment } from 'react'
import Loader from 'react-loader-spinner'
import { Table, AddButton, FlexForm, FormItem, FlexRow, TableWrapper, blue } from './styled/styled'
import { AccountContext } from './login/Accounts'
import { GlobalContext } from './GlobalContext'

function TeamTable(props) {

    const { status } = useContext(AccountContext)

    const { teams, teamsLoading, addNewTeam, removeTeamFromState, fetchTeams } = useContext(GlobalContext)

    const [formData, setFormData] = useState({
        name: ''
    })
    const [addTeam, setAddTeam] = useState(false)

    useEffect(() => {
        if(teams.length < 1){
            fetchTeams() 
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
            .then(() => removeTeamFromState(teamId))
    }

    const handleAddTeam = () => {
        if(teams.length < 1){
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


        <AddButton onClick={(e) => {addNewTeam(e, formData); insertTeam(e); handleAddTeam()}}>add team</AddButton>
    </FlexForm>
    

    return (
        <Fragment>

            <FlexRow>
                <TableWrapper>
                    <Table>
                        <thead>
                            <tr>
                                <th>Team name</th>
                                <th>Race wins</th>
                                {status && <th></th>}
                            </tr>
                        </thead>
                        {
                            teamsLoading ?
                            <tbody>
                                <tr>
                                    <td colSpan="5">
                                        <Loader
                                            type="Bars"
                                            color={blue}
                                            height={60}
                                            width={80}
                                            style={{textAlign:'center',padding:'50px'}}
                                        /> 
                                    </td>
                                </tr>
                            </tbody> :
                            <tbody>
                                {
                                    teams.map((team, index) => 
                                    <tr key={team.id}>
                                        <td>{team.name}</td>
                                        <td style={{textAlign:'center'}}>{team.total_wins ? team.total_wins : '0'}</td>
                                        {
                                            status &&
                                            <td>
                                                <button
                                                    data-key={team.id}
                                                    data-name={team.name}
                                                    onClick={(e) => handleDelete(e)}>
                                                    Delete
                                                </button> 
                                            </td>
                                        }

                                    </tr>)
                                }
                            </tbody>
                        }

                    </Table>
                </TableWrapper>
            </FlexRow>
            

            {
                status &&
                <AddButton onClick={handleAddTeam}>Add a team</AddButton>
            }
            
            {
                addTeam &&
                teamForm
            }

        </Fragment>
    );
}
export default TeamTable;