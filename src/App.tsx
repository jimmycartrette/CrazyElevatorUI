import CSS from 'csstype';
import './App.css';
import ElevatorDoors from './ElevatorDoors';
import ElevatorShaft from './ElevatorShaft';
import Floor from './Floor';
import { globals } from './globals';




// enum ElevatorDirection { UP = 1, DOWN }


const BaseGrid = () => {
  const gridSetup: CSS.Properties = {
    gridTemplateColumns: '2fr repeat(' + globals.NUMBER_OF_ELEVATORS + ', 2fr 1fr) 2fr',
    gridTemplateRows: '5fr repeat(' + globals.NUMBER_OF_FLOORS + ', 20fr) 5fr'
  };
  return (
    <div className="baseGrid" style={gridSetup}>
      {Array.from({ length: globals.NUMBER_OF_FLOORS }, (_, i) => <Floor floor={globals.NUMBER_OF_FLOORS - i} key={"floor" + i}></Floor>)}
      {Array.from({ length: globals.NUMBER_OF_ELEVATORS }, (_, i) => <ElevatorShaft elevatorShaftNumber={i + 1} key={"shaft" + i}></ElevatorShaft>)}
      {Array.from({ length: globals.NUMBER_OF_ELEVATORS * globals.NUMBER_OF_FLOORS },
        (_, i) => {
          return <ElevatorDoors elevatorShaftNumber={i % globals.NUMBER_OF_ELEVATORS + 1}
            floor={globals.NUMBER_OF_FLOORS - Math.floor(i / globals.NUMBER_OF_FLOORS)} key={"doors" + i}></ElevatorDoors>;
        })}
    </div>
  );
}



const App = () => {
  return (
    <BaseGrid></BaseGrid>
  );
}

export default App;
