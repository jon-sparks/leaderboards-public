import React, { useState, createContext } from 'react'

export const GlobalContext = createContext()

export const GlobalProvider = props => {

    const [modalOpen, setModalOpen] = useState(false)

    const [drivers, setDrivers] = useState([])
    const [seasons, setSeasons] = useState([])
    
    const toggleModal = () => {
        setModalOpen(!modalOpen)
    }

    return (
        <GlobalContext.Provider value={{ modalOpen, setModalOpen, toggleModal, seasons, setSeasons, drivers, setDrivers }}>
            {props.children}
        </GlobalContext.Provider>
    )
}