import React, { FC } from 'react';
import './App.css';

// enum ElevatorDirection { UP = 1, DOWN }
enum DoorsStatus { OPEN = 1, CLOSED }

type ElevatorShaftState = {
  floor: number
}

const ElevatorShaft = () => {
  const [elevatorFloor, setElevatorFloor] = React.useState(1);
  return (
    <button className="elevatorshaft" onClick={() => elevatorFloor === 3 ? setElevatorFloor(1) : setElevatorFloor(elevatorFloor + 1)}>
      <ElevatorContainer floor={elevatorFloor} ></ElevatorContainer>
    </button>
  );
}

const Floor = () => {
  return (
    <div className="floor">

    </div>
  );
}

const ElevatorContainer: FC<ElevatorShaftState> = ({ floor }) => {
  // const [direction, setDirection] = React.useState(ElevatorDirection.UP);
  // setDirection(direction);
  return (<div className={"elevatorcontainer floor" + floor.toString()}>
    <Indicator></Indicator>
    <Elevator floor={floor}></Elevator>
  </div>);
}

const Indicator = () => {
  return (

    <div className="topindicator metal">
      <div className="indicator upindicator"></div>
      <div className="indicator downindicator"></div>
    </div>
  );

}

const Elevator: FC<ElevatorShaftState> = ({ floor }) => {
  const [doorsStatus, setDoorsStatus] = React.useState(DoorsStatus.CLOSED);
  return (

    <button className="elevator " onClick={() => { setDoorsStatus(doorsStatus === DoorsStatus.CLOSED ? DoorsStatus.OPEN : DoorsStatus.CLOSED); }} >
      <span className="doors">
        <div className="insideelevator">

          <div className="box">

            <div className="box__face box__face--back">
              <div className="lightcone lightcone1"></div><div className="lightcone lightcone2"></div><div className="lightcone lightcone3"></div>
            </div>
            <div className="box__face box__face--right"></div>
            <div className="box__face box__face--left"></div>
            <div className="box__face box__face--top"><span className="downlight downlight1"></span><span className="downlight downlight2"></span><span className="downlight downlight3"></span></div>
            <div className="box__face box__face--bottom"></div>
          </div>
        </div>
        <div className={"door left metal linear " + (doorsStatus === DoorsStatus.OPEN ? 'dooropenleft' : '')}></div>
        <div className={"door right metal linear " + (doorsStatus === DoorsStatus.OPEN ? 'dooropenright' : '')}></div>
      </span>
    </button>


  );
}

const App = () => {
  return (
    <div>
      <div className="shaftholder">
        <ElevatorShaft></ElevatorShaft>
        <ElevatorShaft></ElevatorShaft>
        <ElevatorShaft></ElevatorShaft>
      </div>
      <Floor></Floor>
      <Floor></Floor>
      <Floor></Floor>
    </div>
  );
}

export default App;
