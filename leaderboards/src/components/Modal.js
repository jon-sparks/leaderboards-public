import React, {useState, useContext} from 'react'
import Signup from './login/Signup'
import Login from './login/Login'
import { StyledModal } from './styled/styled'
import { AccountContext } from './login/Accounts'
import { GlobalContext } from './GlobalContext'

function Modal() {

    const globalState = useContext(GlobalContext)
    const { authenticate, getSession, logout, status, setStatus, user } = useContext(AccountContext)


    
    return (
        <StyledModal>
            <div>
                <div className="top">
                    <img src={require('../images/signin.jpg')} alt="" />
                    {status ? <h3>Welcome, {user}</h3> : <h3>Please sign in</h3>}
                    
                </div>
                <div className="bottom">
                    {/* <Signup></Signup> */}
                    <Login></Login>
                </div>
                <button className="modal-close" onClick={globalState.toggleModal}>
                    <svg viewBox="0 0 365.696 365.696" xmlns="http://www.w3.org/2000/svg"><path d="M243.188 182.86L356.32 69.726c12.5-12.5 12.5-32.766 0-45.247L341.238 9.398c-12.504-12.503-32.77-12.503-45.25 0L182.86 122.528 69.727 9.374c-12.5-12.5-32.766-12.5-45.247 0L9.375 24.457c-12.5 12.504-12.5 32.77 0 45.25l113.152 113.152L9.398 295.99c-12.503 12.503-12.503 32.769 0 45.25L24.48 356.32c12.5 12.5 32.766 12.5 45.247 0l113.132-113.132L295.99 356.32c12.503 12.5 32.769 12.5 45.25 0l15.081-15.082c12.5-12.504 12.5-32.77 0-45.25zm0 0"/></svg>
                </button>
            </div>
        </StyledModal>
    )
}
export default Modal