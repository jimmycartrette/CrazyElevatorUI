import CSS from 'csstype';
import { useEffect, useState } from 'react';
import './App.css';
import { Elevator } from './Elevator';
import ElevatorDoors from './ElevatorDoors';
import ElevatorShaft from './ElevatorShaft';
import Floor from './Floor';
import { globals } from './globals';
import PowerButton from './PowerButton';
import { wrapGrid } from 'animate-css-grid';
import React from 'react';

// enum ElevatorDirection { UP = 1, DOWN }
export enum ElevatorDirection { UP = 1, DOWN };
export enum ElevatorStatus { MOVING = 1, ATFLOOR };
export const MOVE_DELAY = 4000;

export interface elevatorState {
  elevatorNumber: number,
  direction?: ElevatorDirection,
  elevatorStatus: ElevatorStatus,
  fromFloor?: number,
  toFloor?: number,
  progress?: number,
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
  if (callingFloor === elevator?.atFloor && elevator?.elevatorStatus === ElevatorStatus.ATFLOOR) {
    return;
  }

  if (elevator && elevator.elevatorStatus === ElevatorStatus.ATFLOOR) {
    let otherElevatorsInShaft = newState.elevatorDoorState.filter(ds => ds.elevatorShaftNumber === callingElevatorShaft && ds.floor !== callingFloor);
    otherElevatorsInShaft.forEach(a => a.open = false);
    elevator.fromFloor = elevator.atFloor;
    elevator.toFloor = callingFloor;
    elevator.direction = elevator.fromFloor as number < elevator.toFloor ? ElevatorDirection.UP : ElevatorDirection.DOWN;
    stateUpdateFunction(newState);
    moveFloor(stateUpdateFunction, newState, callingFloor, callingElevatorShaft);
  }
}
function moveFloor(stateUpdateFunction: React.Dispatch<React.SetStateAction<state>>, state: state, callingFloor: number, callingElevatorShaft: number) {
  let newState = Object.assign({}, state);
  let callingdoor = newState.elevatorDoorState.find(ds => ds.floor === callingFloor
    && ds.elevatorShaftNumber === callingElevatorShaft) as elevatorDoorState;
  let elevator = newState.elevatorState.find(es => es.elevatorNumber === callingElevatorShaft) as elevatorState;
  let floorDifference = Math.abs(callingFloor - (elevator?.atFloor ?? 1));

  if (floorDifference === 0 && callingdoor) {
    elevator.direction = undefined;
    elevator.fromFloor = undefined;
    elevator.atFloor = elevator.toFloor;
    elevator.toFloor = undefined;
    elevator.elevatorStatus = ElevatorStatus.ATFLOOR;
    stateUpdateFunction(newState);
    setTimeout(() => {
      if (callingdoor) {
        callingdoor.open = true;
        stateUpdateFunction(Object.assign({}, newState));
        setTimeout(() => {
          if (callingdoor) {
            callingdoor.open = false;
            stateUpdateFunction(Object.assign({}, newState));
          }
        }, MOVE_DELAY);
      }
    }, MOVE_DELAY);
    return;
  }

  setTimeout(() => {
    elevator.atFloor = elevator.atFloor as number + (elevator.direction === ElevatorDirection.UP ? 1 : -1);
    elevator.elevatorStatus = ElevatorStatus.MOVING;
    stateUpdateFunction(Object.assign({}, newState));
    moveFloor(stateUpdateFunction, newState, callingFloor, callingElevatorShaft);
  }, MOVE_DELAY);
}
export interface webPubSubConnection {
  connectionString: string | null,
  hubName: string,
  connection?: WebSocket
}
let initialWPSConnection: webPubSubConnection = {
  connectionString: null,
  hubName: "elevator"
}


const BaseGrid = () => {
  let animateHandles: { unwrapGrid?: any, forceGridAnimation?: Function } = {};
  const gridRef = React.useRef(null);
  useEffect(() => {
    if (gridRef.current) {
      const easingType = 'linear';
      // eslint-disable-next-line react-hooks/exhaustive-deps
      animateHandles = wrapGrid(gridRef.current, { easing: easingType, duration: MOVE_DELAY });
      setForceGridAnimation(() => animateHandles.forceGridAnimation as Function);
    }
  }, []);
  useEffect(() => {
    if (gridRef.current && forceGridAnimation) {
      forceGridAnimation();
    }
  });
  const initforceGridAnimation: Function = () => { };
  const [state, setState] = useState(initialState);
  const [forceGridAnimation, setForceGridAnimation] = useState(initforceGridAnimation);
  const [, setWpsConnection] = useState(initialWPSConnection);
  useEffect(() => {
    fetch("https://crazyelevatorwebpubsubtokengenerator.azurewebsites.net/api/elevatorWebPubSubTokenGenerator?id=jimmy")
      .then(res => res.json())
      .then(
        (result) => {

          const serviceClient = new WebSocket(result.url, 'json.webpubsub.azure.v1');
          addMessageProcessor(serviceClient, setState);
          setWpsConnection(preconn => {
            return { ...preconn, connectionString: result.url, connection: serviceClient }
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.log("something broke");
        }
      )
  }, [])
  const gridSetup: CSS.Properties = {
    gridTemplateColumns: '2fr repeat(' + (globals.NUMBER_OF_ELEVATORS - 1).toString() + ', 2fr 1fr) 2fr 2fr',
    gridTemplateRows: '1fr repeat(' + globals.NUMBER_OF_FLOORS + ', 2fr) 1fr'
  };
  return (
    <div className="baseGrid" style={gridSetup} ref={gridRef}>
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
    <><PowerButton></PowerButton><BaseGrid></BaseGrid></>
  );
}

export default App;


function addMessageProcessor(serviceClient: WebSocket, setState: React.Dispatch<React.SetStateAction<state>>) {
  serviceClient.onmessage = evt => {
    var data = JSON.parse(evt.data);
    switch (data.type) {
      case "message":
        setState(existing => {

          if (data.data["elevatorUpdate"]) {
            let newState = Object.assign({}, existing);
            let elevator = newState.elevatorState.find(es => es.elevatorNumber === parseInt(data.data["elevatorUpdate"].id)) as elevatorState;
            elevator.atFloor = data.data["elevatorUpdate"].atFloor;
            elevator.elevatorStatus = data.data["elevatorUpdate"].elevator_status;
            if (data.data["elevatorUpdate"]["primary_elevator_queue"]) { console.warn("Elevator " + elevator.elevatorNumber + " at " + elevator.atFloor + (data.data["elevatorUpdate"]["primary_elevator_queue"]["toFloor"] ? " going to " + data.data["elevatorUpdate"]["primary_elevator_queue"]["toFloor"] : "") + (data.data["elevatorUpdate"]["secondary_elevator_queue"]["toFloor"] ? " then going to " + data.data["elevatorUpdate"]["secondary_elevator_queue"]["toFloor"] : "")); }

            data.data["doorsUpdate"].forEach((door: elevatorDoorState) => {
              let thisdoor = newState.elevatorDoorState.find(ed => ed.elevatorShaftNumber === door.elevatorShaftNumber && ed.floor === door.floor) as elevatorDoorState;
              thisdoor.open = door.open;
            });

            return newState;
          } else {
            return data.data as state;
          }
        }
        );
        break;
    }

  };
}

function generateNewKey(): number {
  return Math.floor(Math.random() * 20000);
}

