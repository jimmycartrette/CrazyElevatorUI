import { FC } from "react";
import './ElevatorDoors.css';
import { DoorsStatus } from "./globals";
import { globals } from './globals';
import CSS from 'csstype';
import React from "react";

type ElevatorDoorsStatus = {
    elevatorShaftNumber: number,
    floor: number
}

const Indicator = () => {
    return (

        <div className="topindicator metal">
            <div className="indicator upindicator"></div>
            <div className="indicator downindicator"></div>
        </div>
    );

}

const ElevatorDoors: FC<ElevatorDoorsStatus> = ({ elevatorShaftNumber, floor }) => {
    const gridPlacement: CSS.Properties = {
        gridArea: (globals.NUMBER_OF_FLOORS - floor + 2).toString() + '/'
            + (elevatorShaftNumber * 2).toString() +
            '/' + (globals.NUMBER_OF_FLOORS - floor + 2).toString()
            + '/' + (elevatorShaftNumber * 2).toString(),
        zIndex: 100
    }
    const [doorStatus, setDoorStatus] = React.useState(DoorsStatus.CLOSED);
    return (
        <div style={gridPlacement} className="doorsholder">
            <Indicator></Indicator>
            <div className="doors" onClick={() => { setDoorStatus(doorStatus === DoorsStatus.OPEN ? DoorsStatus.CLOSED : DoorsStatus.OPEN) }}>
                <div className={"door left metal linear " + (doorStatus === DoorsStatus.OPEN ? 'dooropenleft' : '')}></div>
                <div className={"door right metal linear " + (doorStatus === DoorsStatus.OPEN ? 'dooropenright' : '')}></div>
            </div>
        </div>
    );

}

export default ElevatorDoors;