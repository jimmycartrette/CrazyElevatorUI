import CSS from 'csstype';
import './ElevatorShaft.css';
import { globals } from "./globals";
import { elevatorState } from "./App";


const ElevatorShaft = (state: elevatorState) => {
    const gridPlacement: CSS.Properties = {
        gridArea: '2/'
            + (state.elevatorNumber * 2).toString()
            + '/' + ((globals.NUMBER_OF_FLOORS) + 2).toString() +
            '/' + (state.elevatorNumber * 2).toString(),
        zIndex: 20,
        justifySelf: "center"

    }
    return (
        <div style={gridPlacement}>
            <span className="elevatorshaft">

            </span>
        </div>
    );
}



export default ElevatorShaft;