import CSS from 'csstype';
import { useState } from 'react';
import './App.css';
import { Elevator } from './Elevator';
import ElevatorDoors from './ElevatorDoors';
import ElevatorShaft from './ElevatorShaft';
import Floor from './Floor';
import { globals } from './globals';




// enum ElevatorDirection { UP = 1, DOWN }
export enum ElevatorDirection { UP = 1, DOWN };
export enum ElevatorStatus { MOVING = 1, ATFLOOR };

export interface elevatorState {
  elevatorNumber: number,
  direction?: ElevatorDirection,
  elevatorStatus: ElevatorStatus,
  fromFloor?: number,
  toFloor?: number,
  progress?: number
  atFloor?: number,
  key: number
}

export interface elevatorDoorState {
  elevatorShaftNumber: number,
  floor: number,
  open: boolean,
  onClick?: any,
  key: number
}
export interface state {
  elevatorState: Array<elevatorState>,
  elevatorDoorState: Array<elevatorDoorState>,
}
let numberOfElevatorDoors = globals.NUMBER_OF_ELEVATORS * globals.NUMBER_OF_FLOORS;
let initialState: state = {
  elevatorState: Array.from({ length: globals.NUMBER_OF_ELEVATORS }, (_x, i) => {
    return {
      elevatorNumber: i + 1,
      elevatorStatus: ElevatorStatus.ATFLOOR,
      atFloor: 1,
      key: generateNewKey()
    }
  }),
  elevatorDoorState: Array.from({ length: (numberOfElevatorDoors) }, (_x, i) => {
    return {
      elevatorShaftNumber: i % globals.NUMBER_OF_ELEVATORS + 1,
      floor: globals.NUMBER_OF_FLOORS - Math.floor(i / globals.NUMBER_OF_ELEVATORS),
      open: false,
      key: generateNewKey()
    }
  }),
};

const callElevator = (state: state, callingFloor: number, callingElevatorShaft: number, stateUpdateFunction: React.Dispatch<React.SetStateAction<state>>) => {

  let newState = Object.assign({}, state);
  let elevator = newState.elevatorState.find(es => es.elevatorNumber === callingElevatorShaft);
  if (callingFloor === elevator?.atFloor) {
    return;
  }
  let otherElevatorsInShaft = newState.elevatorDoorState.filter(ds => ds.elevatorShaftNumber === callingElevatorShaft && ds.floor !== callingFloor);
  otherElevatorsInShaft.forEach(a => a.open = false);
  let callingdoor = newState.elevatorDoorState.find(ds => ds.floor === callingFloor
    && ds.elevatorShaftNumber === callingElevatorShaft);

  if (elevator && elevator.elevatorStatus === ElevatorStatus.ATFLOOR) {

    let floorDifference = Math.abs(callingFloor - (elevator?.atFloor ?? 1));
    let moveDelay = floorDifference * 700;

    elevator.fromFloor = elevator.atFloor;
    elevator.atFloor = undefined;
    elevator.elevatorStatus = ElevatorStatus.MOVING;
    elevator.toFloor = callingFloor;
    elevator.direction = callingFloor > (elevator?.atFloor ?? 1) ? ElevatorDirection.UP : ElevatorDirection.DOWN;
    stateUpdateFunction(newState);
    setTimeout(() => {
      if (elevator) {
        elevator.atFloor = elevator.toFloor;
        elevator.direction = undefined;
        elevator.fromFloor = undefined;
        elevator.toFloor = undefined;
        elevator.elevatorStatus = ElevatorStatus.ATFLOOR;

        if (callingdoor) {
          callingdoor.open = true;
          setTimeout(() => {

            if (callingdoor) {
              callingdoor.open = false;
              // let newState = Object.assign({}, state);
              stateUpdateFunction(Object.assign({}, state));
            }


          }, moveDelay);
        }
        stateUpdateFunction(Object.assign({}, state));
      }
    }, moveDelay);
  }



}

const BaseGrid = () => {
  const [state, setState] = useState(initialState);
  console.log('generating basegrid');
  const gridSetup: CSS.Properties = {
    gridTemplateColumns: '2fr repeat(' + (globals.NUMBER_OF_ELEVATORS - 1).toString() + ', 2fr 1fr) 2fr 2fr',
    gridTemplateRows: '1fr repeat(' + globals.NUMBER_OF_FLOORS + ', 2fr) 1fr'
  };
  return (
    <div className="baseGrid" style={gridSetup}>
      {Array.from({ length: globals.NUMBER_OF_FLOORS }, (_, i) => <Floor floor={globals.NUMBER_OF_FLOORS - i} key={"floor" + i}></Floor>)}
      {Array.from({ length: state.elevatorState.length }, (_, i) => <ElevatorShaft
        elevatorNumber={state.elevatorState[i].elevatorNumber}
        elevatorStatus={state.elevatorState[i].elevatorStatus}
        direction={state.elevatorState[i].direction}
        fromFloor={state.elevatorState[i].fromFloor}
        toFloor={state.elevatorState[i].toFloor}
        atFloor={state.elevatorState[i].atFloor}
        progress={state.elevatorState[i].progress}
        key={state.elevatorState[i].key}
      ></ElevatorShaft>)}
      {Array.from({ length: globals.NUMBER_OF_ELEVATORS * globals.NUMBER_OF_FLOORS },
        (_, i) => {
          return <ElevatorDoors
            onClick={() => callElevator(state, state.elevatorDoorState[i].floor, state.elevatorDoorState[i].elevatorShaftNumber, setState)}
            elevatorShaftNumber={state.elevatorDoorState[i].elevatorShaftNumber}
            floor={state.elevatorDoorState[i].floor}
            open={state.elevatorDoorState[i].open}
            key={state.elevatorDoorState[i].key}
          ></ElevatorDoors>
        })}
      {Array.from({ length: globals.NUMBER_OF_ELEVATORS },
        (_, i) => {
          return <Elevator
            elevatorNumber={state.elevatorState[i].elevatorNumber}
            elevatorStatus={state.elevatorState[i].elevatorStatus}
            direction={state.elevatorState[i].direction}
            fromFloor={state.elevatorState[i].fromFloor}
            toFloor={state.elevatorState[i].toFloor}
            atFloor={state.elevatorState[i].atFloor}
            progress={state.elevatorState[i].progress}
            key={state.elevatorState[i].key}
          ></Elevator>
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
function generateNewKey(): number {
  return Math.floor(Math.random() * 20000);
}

