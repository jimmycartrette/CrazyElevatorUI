import './ElevatorDoors.css';
import { globals } from './globals';
import CSS from 'csstype';
import { ElevatorDirection, elevatorDoorState } from "./ElevatorDirection";


type Props = {
    elevatorDirection: ElevatorDirection;
    elevatorAtFloor: number;
}
const Indicator: React.FC<Props> = ({ elevatorDirection, elevatorAtFloor }) => {
    return (

        <div className="topindicator">
            <div className={"indicator upindicator " + (elevatorDirection === ElevatorDirection.UP ? 'upindicatoron' : '')}></div>
            <div className={"indicator downindicator " + (elevatorDirection === ElevatorDirection.DOWN ? 'downindicatoron' : '')}></div>
            <span className="textindicator">{elevatorAtFloor}</span>
        </div >
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
            <span>
                <Indicator elevatorDirection={state.elevatorDirection} elevatorAtFloor={state.elevatorAtFloor} ></Indicator>
                <div className="doors">
                    <div className={"door left metal linear " + (state.open ? 'dooropenleft' : '')}></div>
                    <div className={"door right metal linear " + (state.open ? 'dooropenright' : '')}></div>
                </div>
            </span>
        </div >
    );

}

export default ElevatorDoors;