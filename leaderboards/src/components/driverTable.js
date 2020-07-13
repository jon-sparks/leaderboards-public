import React, { useState, useEffect, useContext, Fragment } from 'react'
import Loader from 'react-loader-spinner'
import { motion } from 'framer-motion'
import { Table, AddButton, FlexForm, FormRow, FormItem, TableWrapper, FlexRow, blue } from './styled/styled'
import { AccountContext } from './login/Accounts'
import { GlobalContext } from './GlobalContext'

function DriverTable(props) {

    const { status } = useContext(AccountContext)
    const { drivers, driversLoading, removeDriverFromState, fetchDrivers, teams, teamsLoading, setTeams } = useContext(GlobalContext)

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        category: 'LW',
        team: 'No Team'
    })
    const [addDriver, setAddDriver] = useState(false)

    async function fetchTeams() {
        await fetch(`/api/teams`)
            .then(response => response.json())
            .then(data => setTeams(data))
    }
    
    useEffect(() => {
        if(drivers.length < 1){
            fetchDrivers() 
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleInputChange = e => {
        const {name, value} = e.target
        setFormData({...formData, [name]: value})
    }

    const insertDriver = (e) => {
        e.preventDefault()
        fetch(`/api/insert-driver`,
            {
                method:'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(() => setTimeout(() => {
                fetchDrivers()
            }, 500))
    }

    const deleteDriver = (driverId) => {
        fetch(`/api/delete-driver`,
            {
                method:'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({"id":driverId})
            })
            .then(response => response.json())
            .then(() => removeDriverFromState(driverId))
    }

    const handleAddDriver = () => {
        if(teams.length < 1){
            fetchTeams()
        }
        setAddDriver(addDriver ? false : true)
    }

    const handleDelete = (e) => {
        const conf = window.confirm(`Are you sure you want to delete ${e.currentTarget.dataset.fname} ${e.currentTarget.dataset.lname}?`)
        const driverId = e.currentTarget.dataset.key
        console.log(driverId)
        if (conf) {
            deleteDriver(driverId)
        } else {
            console.log('not deleted')
        }
    }

    const driverForm = 
    <FlexForm>

        <FormRow>
            <FormItem>
                <label htmlFor="firstName">First Name</label>
                <input type="text" placeholder="..." name="firstName" value={formData.firstName} onChange={handleInputChange}></input>
            </FormItem>
            <FormItem>
                <label htmlFor="lastName">Last Name</label>
                <input type="text" placeholder="..." name="lastName" value={formData.lastName} onChange={handleInputChange}></input>
            </FormItem>
        </FormRow>

        <FormRow>
            <FormItem>
                <label htmlFor="category">Weight Category</label>
                <select name="category" value={formData.category} onChange={handleInputChange}>
                    <option>HW</option>
                    <option>LW</option>
                </select>
            </FormItem>
            <FormItem>
                <label htmlFor="team">Team</label>
                <select name="team" value={formData.team} onChange={handleInputChange}>
                    <option>Select team</option>
                    {
                        teams.map(team => <option key={team.id} value={team.id}>{team.name}</option>)
                    }
                </select>
            </FormItem>
        </FormRow>

        <AddButton onClick={(e) => { insertDriver(e); handleAddDriver()}}>Add driver</AddButton>
    </FlexForm>
    

    return (
        <Fragment>

            <FlexRow>
                <TableWrapper>
                    <Table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Team</th>
                                <th>Race wins</th>
                                {status && <th></th>}
                            </tr>
                        </thead>
                        {
                            driversLoading ? 
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
                                    drivers &&
                                    drivers.map((driver, index) => 
                                    <motion.tr key={driver.id} positionTransition>
                                        <td>{driver.first_name} {driver.last_name}</td>
                                        <td>{driver.category}</td>
                                        <td>{driver.team ? driver.team : 'No team'}</td>
                                        <td style={{textAlign:'center'}}>{driver.total_wins ? driver.total_wins : '0'}</td>
                                        {
                                            status &&
                                            <td>
                                                <button
                                                    data-key={driver.id}
                                                    data-fname={driver.first_name}
                                                    data-lname={driver.last_name}
                                                    onClick={(e) => handleDelete(e)}>
                                                    Delete
                                                </button>
                                            </td>
                                        }
                                    </motion.tr>)
                                }
                            </tbody>
                        }

                    </Table>
                </TableWrapper>
            </FlexRow>
            
            {
                status &&
                <AddButton onClick={handleAddDriver}>
                    Add a driver
                </AddButton>
            }

            
            {addDriver
                ? driverForm
                : ''
            }

        </Fragment>
    );
}
export default DriverTable;