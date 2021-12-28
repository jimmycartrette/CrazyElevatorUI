import CSS from 'csstype';
import { elevatorState } from "./ElevatorDirection";
import './Elevator.css';
import { globals } from './globals';


export const Elevator = (state: elevatorState) => {
    // let grid: HTMLDivElement | null;
    // let animateHandles: { unwrapGrid?: any, forceGridAnimation?: Function } = {};
    // let runOnce = 0;

    const gridPlacement: CSS.Properties = {
        gridRow: ((globals.NUMBER_OF_FLOORS - ((state?.atFloor) ?? 1) + 2)).toString() + '/' + ((globals.NUMBER_OF_FLOORS - ((state?.atFloor) ?? 1) + 2)).toString(),
        gridColumn: (state.elevatorNumber * 2).toString()
            + '/' + (state.elevatorNumber * 2).toString(),
        zIndex: 20,
        justifySelf: "center"
    }

    return (
        <div className={"elevatorcontainer"} style={gridPlacement}
        // ref={el => (grid = el)}
        >
            <span className="elevator ">
                <div className="insideelevator">
                    <div className="box">
                        {/* <div className="box__face box__face--back">
                        <div className="lightcone lightcone1"></div><div className="lightcone lightcone2"></div><div className="lightcone lightcone3"></div>
                    </div>
                    <div className="box__face box__face--right"></div>
                    <div className="box__face box__face--left"></div>
                    <div className="box__face box__face--top"><span className="downlight downlight1"></span><span className="downlight downlight2"></span><span className="downlight downlight3"></span></div>
                    <div className="box__face box__face--bottom"></div> */}
                    </div>
                </div>
            </span>
        </div>
    );

}