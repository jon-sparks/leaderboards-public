import React, { useContext, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components'

import { GlobalContext } from './GlobalContext'
import { AccountContext } from './login/Accounts'

const Nav = styled.nav`
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 300px;
    min-height: 100vh;
    background: linear-gradient(0deg, rgba(42,52,73,1) 0%, rgba(53,67,93,1) 100%);
    box-shadow: 0px 0px 17px -12px rgba(0,0,0,0.3);
    z-index: 1;
    font-family: exo;
    font-weight: bold;
    font-style: italic;

    button {
        font-family: exo;
        font-weight: bold;
        font-style: italic
    }

    ul {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
            box-shadow: inset 0px -1px 0px 0px #00000054, 0 1px 0 0 #ffffff1a;

            &:first-of-type {
                box-shadow: 0 -1px 0 0 #00000054, inset 0px 1px 0px 0px #ffffff1a, inset 0px -1px 0px 0px #00000054, 0 1px 0 0 #ffffff1a;
            }

            button {
                width: 100%;
                cursor: pointer;
            }

            a, button {
                position: relative;
                display: flex;
                align-items: center;
                padding: 15px;
                color: white;
                transition: all ease 0.3s;
                background: none;
                border: none;
                font-size: 16px;

                &::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    right: 0;
                    height: calc(100% - 1px);
                    width: 0;
                    background: rgba(80,207,224,1);
                    transition: all ease 0.3s;
                }

                &:hover,
                &:focus {
                    background: #2f3c54;
                }

                &.active {
                    background: #2f3c54;

                    &::after {
                        width: 4px;
                    }

                    svg {

                        path {
                            fill: rgba(80,207,224,1);
                        }
                    }
                }

                svg {
                    margin-right: 15px;
                    width: 25px;

                    path {
                        fill: white;
                        transition: all ease 0.3s;
                    }
                }
            }
        }
    }
`

const NavLogo = styled.a`
    width: 80%;
    margin: 20px auto;

    img {
        width: 100%;
    }
`


function Navigation() {

    const globalState = useContext(GlobalContext) 
    const { getSession, status } = useContext(AccountContext)

    useEffect(() => {
        getSession()
        // .then(setStatus(true))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Nav>
            <NavLogo href="https://www.rapikart.co.uk/">
                <img src={require('../images/logo.png')} alt="rapikart logo" />
            </NavLogo>
            <ul>
                {/* <li>
                    <NavLink to="/" exact>                        
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path d="M256 152.96L79.894 288.469v181.549h141.507V336.973h75.175v133.045h135.531V288.469z"/>
                            <path d="M439.482 183.132V90.307h-74.166v35.77L256 41.982 0 238.919l35.339 45.936L256 115.062l220.662 169.794L512 238.92z"/>
                        </svg>
                        Home
                    </NavLink>
                </li> */}
                <li>
                    <NavLink to="/" exact>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path d="M497 36.953h-65.703c.238-7.277.371-14.598.371-21.953 0-8.285-6.719-15-15-15H95.336c-8.285 0-15 6.715-15 15 0 7.355.129 14.676.367 21.953H15c-8.285 0-15 6.715-15 15 0 67.211 17.566 130.621 49.46 178.555 31.528 47.387 73.524 74.566 118.888 77.21 10.285 11.192 21.16 20.317 32.484 27.278v66.668h-25.164c-30.422 0-55.168 24.75-55.168 55.168v25.164h-1.066c-8.286 0-15 6.719-15 15 0 8.285 6.714 15 15 15h273.132c8.286 0 15-6.715 15-15 0-8.281-6.714-15-15-15H391.5v-25.164c0-30.418-24.75-55.168-55.168-55.168h-25.164v-66.668c11.324-6.96 22.195-16.086 32.48-27.277 45.368-2.645 87.36-29.824 118.891-77.211C494.434 182.574 512 119.164 512 51.953c0-8.285-6.719-15-15-15zM74.437 213.891c-26.308-39.54-41.765-91.246-44.12-146.938h52.062c5.41 68.461 21.48 131.738 46.598 181.973 4 8 8.183 15.554 12.523 22.676-24.95-9.422-48.04-29.118-67.063-57.711zm363.125 0C418.54 242.484 395.45 262.18 370.5 271.6c4.344-7.12 8.523-14.675 12.523-22.675 25.118-50.235 41.184-113.512 46.598-181.973h52.063c-2.356 55.692-17.813 107.399-44.122 146.938zm0 0" />
                        </svg>
                        Standings
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/drivers">
                        <svg viewBox="0 0 511.976 511.976" width="512" xmlns="http://www.w3.org/2000/svg">
                            <path d="M318.923 274.675l-18.169 30.048h208.877a230.717 230.717 0 002.345-30.048zM355.652 213.932l-18.589 30.742h173.364c-5.98-51.646-28.991-99.453-66.31-136.772C400.343 64.128 342.142 40.02 280.235 40.02h-.838c-46.667 0-91.731 13.87-130.321 40.11-32.707 22.24-58.856 52.073-76.515 87.074zM282.613 334.722l-18.154 30.023H0l15.08 107.21h380.516l3.54-2.101c33.749-20.032 62.02-48.545 81.757-82.454a228.823 228.823 0 0022.355-52.679H282.613zM247.541 334.746l59.517-98.429-246.757-40.73L5.288 334.746z"/>
                        </svg>
                        Drivers
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/teams">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 511.999 511.999">
                            <path d="M438.09 273.32h-39.596c4.036 11.05 6.241 22.975 6.241 35.404v149.65c0 5.182-.902 10.156-2.543 14.782h65.461c24.453 0 44.346-19.894 44.346-44.346v-81.581c.001-40.753-33.155-73.909-73.909-73.909zM107.265 308.725c0-12.43 2.205-24.354 6.241-35.404H73.91c-40.754 0-73.91 33.156-73.91 73.91v81.581c0 24.452 19.893 44.346 44.346 44.346h65.462a44.144 44.144 0 01-2.543-14.783v-149.65zM301.261 234.815h-90.522c-40.754 0-73.91 33.156-73.91 73.91v149.65c0 8.163 6.618 14.782 14.782 14.782h208.778c8.164 0 14.782-6.618 14.782-14.782v-149.65c0-40.754-33.156-73.91-73.91-73.91zM256 38.84c-49.012 0-88.886 39.874-88.886 88.887 0 33.245 18.349 62.28 45.447 77.524 12.853 7.23 27.671 11.362 43.439 11.362s30.586-4.132 43.439-11.362c27.099-15.244 45.447-44.28 45.447-77.524 0-49.012-39.874-88.887-88.886-88.887zM99.918 121.689c-36.655 0-66.475 29.82-66.475 66.475 0 36.655 29.82 66.475 66.475 66.475a66.095 66.095 0 0026.195-5.388c13.906-5.987 25.372-16.585 32.467-29.86a66.05 66.05 0 007.813-31.227c0-36.654-29.82-66.475-66.475-66.475zM412.082 121.689c-36.655 0-66.475 29.82-66.475 66.475a66.045 66.045 0 007.813 31.227c7.095 13.276 18.561 23.874 32.467 29.86a66.095 66.095 0 0026.195 5.388c36.655 0 66.475-29.82 66.475-66.475 0-36.655-29.82-66.475-66.475-66.475z"/>
                        </svg>
                        Teams
                    </NavLink>
                </li>
                {
                    status &&
                    <li>
                        <NavLink to="/events">
                            <svg viewBox="0 0 512 512" width="512pt" xmlns="http://www.w3.org/2000/svg">
                                <path d="M448 64h-21.332V21.332C426.668 9.559 417.109 0 405.332 0H384c-11.777 0-21.332 9.559-21.332 21.332V64H149.332V21.332C149.332 9.559 139.777 0 128 0h-21.332C94.891 0 85.332 9.559 85.332 21.332V64H64C28.715 64 0 92.715 0 128v320c0 35.285 28.715 64 64 64h384c35.285 0 64-28.715 64-64V128c0-35.285-28.715-64-64-64zm21.332 384c0 11.754-9.578 21.332-21.332 21.332H64c-11.754 0-21.332-9.578-21.332-21.332V214.187h426.664zm0 0"/>
                            </svg>
                            Events
                        </NavLink>
                    </li>
                }

                <li>
                    <button onClick={globalState.toggleModal}>
                    <svg viewBox="0 0 512 512" fill="white" xmlns="http://www.w3.org/2000/svg">
                        <path d="M431.964 435.333c-.921-58.994-19.3-112.636-51.977-151.474C347.5 245.258 303.472 224 256 224s-91.5 21.258-123.987 59.859C99.367 322.656 81 376.223 80.04 435.144 98.5 444.391 174.89 480 256 480c87.708 0 158.845-35.4 175.964-44.667z"/>
                        <circle cx="256" cy="120" r="88"/>
                    </svg>
                        {status ? 'Log out' : 'Log in'}
                    </button>
                </li>
            </ul>
        </Nav>
    );
}
export default Navigation;
