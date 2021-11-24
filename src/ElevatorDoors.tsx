import './ElevatorDoors.css';
import { globals } from './globals';
import CSS from 'csstype';
import { elevatorDoorState } from "./App";


const Indicator = () => {
    return (

        <div className="topindicator metal">
            <div className="indicator upindicator upindicatoron"></div>
            <div className="indicator downindicator downindicatoron"></div>
        </div>
    );

}

const ElevatorDoors = (state: elevatorDoorState) => {
    const gridPlacement: CSS.Properties = {
        gridArea: (globals.NUMBER_OF_FLOORS - state.floor + 2).toString() + '/'
            + (state.elevatorShaftNumber * 2).toString() +
            '/' + (globals.NUMBER_OF_FLOORS - state.floor + 2).toString()
            + '/' + (state.elevatorShaftNumber * 2).toString(),
        zIndex: 100
    }

    // .find(d => d.floor === 1 && d.elevatorShaftNumber === 1));

    return (
        <div style={gridPlacement} className="doorsholder" onClick={() => {
            state.onClick()
        }}>
            <Indicator></Indicator>
            <div className="doors">
                <div className={"door left metal linear " + (state.open ? 'dooropenleft' : '')}></div>
                <div className={"door right metal linear " + (state.open ? 'dooropenright' : '')}></div>
            </div>
        </div >
    );

}

export default ElevatorDoors;