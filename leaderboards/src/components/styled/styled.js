import styled from 'styled-components';

const blue = 'rgba(80,207,224,1)';
export const slate = 'rgba(53,67,93,1)';

export const Table = styled.table`
border-collapse: collapse;
overflow: hidden;
background: white;
box-shadow: 0 0 9px -5px rgba(0,0,0,0.3);
margin-bottom: 30px;

    thead {
        background: ${slate};
        color: white;
        text-align: left;

        tr {
            box-shadow: 0px 0px 15px -6px rgba(0,0,0,0.75);

            th {
                padding: 10px 20px;
            }
        }
    }
    tbody {

        tr {
            border-bottom: solid 1px lightgrey;
            td {
                padding: 10px 20px;
            }

            &:last-of-type {
                border-bottom: none;
            }
        }
    }
`

export const Pagewrap = styled.div`
    position: relative;
    flex-grow: 1;
    padding: 50px;
    background: #f8f8f8;
`

export const Ico = styled.img`
    width: 20px;
`

export const FlexForm = styled.form`
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 40px 0;
    max-width: 300px;
`

export const FormRow = styled.div`
    display: flex;

    > div {
        width: calc(50% - 10px);
    }
`

export const FormItem = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    margin: 0 5px 20px 5px;

    label {
        font-size: 13px;
        font-weight: bold;
        margin-bottom: 5px;
    }

    input,
    select {
        padding: 10px;
        border: 1px solid ${blue};
    }
`

export const AddButton = styled.button`
    background: none;
    border: none;
    font-size: 18px;
    padding: 20px;
    cursor: pointer;

    &::before {
        content: '+';
        margin-right: 10px;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        width: 25px;
        height: 25px;
        border-radius: 50%;
        color: white;
        background: rgba(80, 207, 224, 1);
    }
`

export const InlineList = styled.ul`
    position: relative;
    display: flex;
    flex-direction: row;
    padding: 0;
    list-style: none;
`

export const ToggleButton = styled.button`
    position: relative;
    border: none;
    background: none;
    padding: 10px 20px;
    cursor: pointer;

    &:focus {
        outline: none;
    }

    &.active {
        border-bottom: solid 2px #50cfe0;
    }
`

export const StyledModal = styled.div`
    position: fixed;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.3);
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;

    > div {
        position: relative;
        overflow: hidden;
        background: white;
        border-radius: 15px;
        box-shadow: 0 5px 10px -5px rgba(0,0,0,0.3);
        display: flex;
        flex-direction: column;

        .modal-close {
            position: absolute;
            top: 20px;
            right: 20px;
            background: none;
            border: none;
            cursor: pointer;

            svg {
                width: 20px;
                fill: white;
            }
        }
    }
    .top {
        position: relative;
        height: 167px;

        &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: ${slate};
            mix-blend-mode: color;
        }

        img {
            position: relative;
            height: 100%;
            width: 100%;
            object-fit: cover;
        }
        h3 {
            position: absolute;
            bottom: 20px;
            left: 20px;
            color: white;
        }
    }
    .bottom {
        position: relative;
        padding: 30px;
    }
`

export const LoginForm = styled.form`
    position: relative;
    display: flex;
    flex-direction: column;

    > div {
        position: relative;
        display: flex;
        flex-direction: column;

        input {
            border: none;
            box-shadow: 0 2px 0 0 ${slate};
            padding: 10px;
            margin: 4px 0;
        }
    }
    button {
        margin-top: 20px;
        padding: 10px;
        border: none;
        background: ${blue};
        cursor: pointer;
        color: white;
        font-size: 16px;
    }
`

export const SeasonSelect = styled.select`
    font-family: Exo;
    font-style: italic;
    min-width: 180px;
    position: relative;
    /* appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none; */
    padding: 10px 10px 10px 0;
    font-size: 50px;
    font-weight: bold;
    border: none;
    background: none;
    margin-right: 25px;
    outline: none;
    color: ${slate};

    option {
        background: ${slate};
        font-size: 25px;
        color: white;
    }
`

export const RoundSelect = styled.select`
    font-family: Exo;
    font-style: italic;
    font-size: 30px;
    font-weight: bold;
    padding-right: 20px;
    outline: none;
    border: none;
    background: none;
    color: ${slate};
`

export const FlexRow = styled.div`
    position: relative;
    display: flex;
    flex-direction: row;
    margin: 0 -10px 30px -10px;

    > * {
        margin: 0 10px;
    }
`

export const TableTitle = styled.h2`
    font-family: Exo;
    font-style: italic;
    font-size: 25px;
    font-weight: bold;
    color: ${slate};
    text-transform: uppercase;
`

export const Fieldset = styled.fieldset`
    padding: 0;
    margin: 0;
    border: 0;
`
export const InlineFieldset = styled(Fieldset)`
    display: inline-block;
    vertical-align: top;
    padding: 25px;
    padding-left: 0;
`

export const Label = styled.label`
    display: block;
    margin-top: 10px;
    font-family: exo;
    font-style: italic;
    color: ${slate};
    font-weight: bold;
    font-size: 20px;
`

export const Legend = styled(Label)``

export const Input = styled.input`
    padding: 10px;
    border: 1px solid ${blue};
`

export const FormSubtitle = styled.h3`
    font-family: exo;
    font-style: italic;
    color: ${slate};
    font-weight: bold;
    font-size: 28px;
    margin-bottom: 10px;
`

export const Radio = styled.input`
    margin-bottom: 15px;
    font-size: 18px;
`
export const RadioLabel = styled.label`
    font-family: exo;
    font-weight: bold;
    font-style: italic;
    font-size: 20px;
    color: ${slate};
    padding: 10px;
`