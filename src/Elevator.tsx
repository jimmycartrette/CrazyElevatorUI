import CSS from 'csstype';
import { useEffect } from 'react';
import { elevatorState } from "./App";
import './Elevator.css';
import { globals } from './globals';

export const Elevator = (state: elevatorState) => {
    let grid: HTMLDivElement | null;
    let animateHandles: { unwrapGrid?: any, forceGridAnimation?: Function } = {};
    let runOnce = 0;
    useEffect(() => {
        if (runOnce === 1) { }
        console.log('animate handles');
        console.log(grid);
        animateHandles = (window as any).animateCSSGrid.wrapGrid(grid,
            { easing: 'backOut', stagger: 10, duration: 5000 });
        runOnce = 1;
    }
        , []);
    useEffect(() => {
        console.log('force grid outer');
        if (animateHandles.forceGridAnimation) {
            console.log('force grid inner');
            animateHandles.forceGridAnimation();
        }
    });

    const gridPlacement: CSS.Properties = {
        // gridArea: ((globals.NUMBER_OF_FLOORS - ((state?.atFloor) ?? 1) + 2)).toString() + '/'
        //     + (state.elevatorNumber * 2).toString()
        //     + '/' + ((globals.NUMBER_OF_FLOORS - ((state?.atFloor) ?? 1) + 2)).toString() +
        //     '/' + (state.elevatorNumber * 2).toString(),
        gridRow: ((globals.NUMBER_OF_FLOORS - ((state?.atFloor) ?? 1) + 2)).toString() + '/' + ((globals.NUMBER_OF_FLOORS - ((state?.atFloor) ?? 1) + 2)).toString(),
        gridColumn: (state.elevatorNumber * 2).toString()
            + '/' + (state.elevatorNumber * 2).toString(),
        zIndex: 20,
        justifySelf: "center"
    }


    return (
        <div className={"elevatorcontainer"} style={gridPlacement} ref={el => (grid = el)}>
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