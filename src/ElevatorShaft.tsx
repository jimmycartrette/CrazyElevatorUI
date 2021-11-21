import React from "react";
import { FC } from "react";
import CSS from 'csstype';
import './ElevatorShaft.css';
import { globals } from "./globals";

type ElevatorShaftState = {
    elevatorShaftNumber: number
}
type ElevatorState = {
    floor: number,
}



const ElevatorShaft = (elevatorShaftState: ElevatorShaftState) => {
    const gridPlacement: CSS.Properties = {
        gridArea: '2/'
            + (elevatorShaftState.elevatorShaftNumber * 2).toString()
            + '/' + ((globals.NUMBER_OF_FLOORS) + 2).toString() +
            '/' + (elevatorShaftState.elevatorShaftNumber * 2).toString(),
        zIndex: 20,
        justifySelf: "center"

    }
    const [elevatorFloor, setElevatorFloor] = React.useState(1);
    return (
        <div style={gridPlacement}>
            <button className="elevatorshaft" onClick={() => elevatorFloor === 3 ? setElevatorFloor(1) : setElevatorFloor(elevatorFloor + 1)} >
                <ElevatorContainer floor={elevatorFloor}></ElevatorContainer>
            </button>
        </div>
    );
}

const ElevatorContainer: FC<ElevatorState> = ({ floor }) => {
    // const [direction, setDirection] = React.useState(ElevatorDirection.UP);
    // setDirection(direction);
    return (<div className={"elevatorcontainer floor" + floor.toString()}>

        <Elevator floor={floor}></Elevator>
    </div>);
}





const Elevator: FC<ElevatorState> = ({ floor }) => {
    // const [doorsStatus, setDoorsStatus] = React.useState(DoorsStatus.CLOSED);
    return (

        <button className="elevator ">

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
        </button>


    );
}




export default ElevatorShaft;