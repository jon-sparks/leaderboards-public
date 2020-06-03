import React, { useState, useEffect, useContext, Fragment } from 'react'
import { motion } from 'framer-motion'
import { Table, AddButton, FlexForm, FormRow, FormItem, slate } from './styled/styled'
import { AccountContext } from './login/Accounts'
import { GlobalContext } from './GlobalContext'

function DriverTable(props) {

    const { status } = useContext(AccountContext)
    const { drivers, setDrivers } = useContext(GlobalContext)

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        category: 'LW',
        team: 'No Team',
        teamName: ''
    })
    const [addDriver, setAddDriver] = useState(false)

    async function fetchDrivers() {
        await fetch(`/api/drivers`)
            .then(response => response.json())
            .then(data => {
            // props.driverHandler(data)
            setDrivers(data)
        })
    }

    async function fetchTeams() {
        await fetch(`/api/teams`)
            .then(response => response.json())
            .then(data => {
            props.teamHandler(data)
        })
    }
    
    useEffect(() => {
        if(props.drivers.length < 1){
            fetchDrivers() 
        }
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
            .then(() => fetchDrivers())
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
            .then(() => props.removeDriverFromState(driverId))
    }

    const handleAddDriver = () => {
        if(props.teams.length < 1){
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
                    <option>LW</option>
                    <option>HW</option>
                </select>
            </FormItem>
            <FormItem>
                <label htmlFor="team">Team</label>
                <select name="team" value={formData.team} onChange={handleInputChange}>
                    {
                        props.teams.map(team => <option key={team.id} value={team.id}>{team.name}</option>)
                    }
                </select>
            </FormItem>
        </FormRow>

        <button onClick={(e) => {props.addDriver(e, formData); insertDriver(e); handleAddDriver()}}>add driver</button>
    </FlexForm>
    

    return (
        <Fragment>

            <Table>
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Category</th>
                        <th>Team</th>
                        {status ? <th></th> : ''}
                    </tr>
                </thead>
                <tbody>
                    {
                        drivers.map((driver, index) => 
                        <motion.tr key={driver.id} whileHover={{color: slate, backgroundColor: '#dedede'}} positionTransition>
                            <td>{driver.first_name}</td>
                            <td>{driver.last_name}</td>
                            <td>{driver.category}</td>
                            <td>{driver.team ? driver.team : 'No team'}</td>
                            {status ?                             <td>
                                <button
                                    data-key={driver.id}
                                    data-fname={driver.first_name}
                                    data-lname={driver.last_name}
                                    onClick={(e) => handleDelete(e)}>
                                    Delete
                                </button>
                            </td> : ''}
                        </motion.tr>)
                    }
                </tbody>
            </Table>

            <AddButton onClick={handleAddDriver}>
                Add a driver
            </AddButton>
            
            {addDriver
                ? driverForm
                : ''
            }

        </Fragment>
    );
}
export default DriverTable;