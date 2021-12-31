import CSS from 'csstype';
import { useEffect, useState } from 'react';
import './App.css';
import { Elevator } from './Elevator';
import ElevatorDoors from './ElevatorDoors';
import ElevatorShaft from './ElevatorShaft';
import Floor from './Floor';
import { globals } from './globals';
import { wrapGrid } from 'animate-css-grid';
import React from 'react';
import { state, ElevatorStatus, ElevatorDirection, MOVE_DELAY } from './ElevatorDirection';
import callElevator from './services/callElevator';
import ConnectToWebPubSub from './services/ConnectToWebPubSub';
import { GetInitialElevatorState } from './services/GetInitialElevatorState';

let numberOfElevatorDoors = globals.NUMBER_OF_ELEVATORS * globals.NUMBER_OF_FLOORS;
let initialState: state = {
  elevatorState: Array.from({ length: globals.NUMBER_OF_ELEVATORS }, (_x, i) => {
    return {
      elevatorNumber: i + 1,
      elevatorStatus: ElevatorStatus.ATFLOOR,
      atFloor: 1
    }
  }),
  elevatorDoorState: Array.from({ length: (numberOfElevatorDoors) }, (_x, i) => {
    return {
      elevatorShaftNumber: Math.floor(i / globals.NUMBER_OF_FLOORS) + 1,
      floor: i % globals.NUMBER_OF_FLOORS + 1,
      elevatorAtFloor: 1,
      elevatorDirection: ElevatorDirection.NONE,
      open: false
    }
  }),
};

interface ContextState {
}
let contextState: ContextState = {};
const Context = React.createContext<ContextState | null>(null);

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
    ConnectToWebPubSub(setState, setWpsConnection);
  }, []);
  useEffect(() => {
    GetInitialElevatorState(setState);
  }, []);
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
        key={300 + i}
      ></ElevatorShaft>)}
      {Array.from({ length: globals.NUMBER_OF_ELEVATORS * globals.NUMBER_OF_FLOORS },
        (_, i) => {
          return <ElevatorDoors
            onClick={() => callElevator(state, state.elevatorDoorState[i].floor, state.elevatorDoorState[i].elevatorShaftNumber, setState)}
            elevatorShaftNumber={state.elevatorDoorState[i].elevatorShaftNumber}
            floor={state.elevatorDoorState[i].floor}
            open={state.elevatorDoorState[i].open}
            key={100 + i}
            elevatorAtFloor={state.elevatorDoorState[i].elevatorAtFloor}
            elevatorDirection={state.elevatorDoorState[i].elevatorDirection}></ElevatorDoors>
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
            key={200 + i}
          ></Elevator>
        })}
    </div>
  );
}



const App = () => {
  useEffect(() => {
    document.title = "CraAzY ELevAtoR";
  }
    , [])
  return (
    <Context.Provider value={contextState}><BaseGrid></BaseGrid></Context.Provider>

  );
}

export default App;


