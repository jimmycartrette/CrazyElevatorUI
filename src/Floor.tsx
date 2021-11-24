
import CSS from 'csstype';
import './Floor.css';
import { globals } from './globals';

type FloorState = {
    floor: number
}

const Floor = (floorState: FloorState) => {
    const gridPlacement: CSS.Properties = {
        gridArea: (globals.NUMBER_OF_FLOORS - floorState.floor + 2).toString() + '/2/' + (globals.NUMBER_OF_FLOORS - floorState.floor + 2).toString() + '/' + ((globals.NUMBER_OF_ELEVATORS * 2) + 1).toString(),
    }

    return (
        <div className="floor" style={gridPlacement}>
        </div>
    );
}

export default Floor;
