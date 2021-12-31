import React from 'react';
import { state, ElevatorStatus, ElevatorDirection, elevatorDoorState, elevatorState, MOVE_DELAY } from '../ElevatorDirection';

export function moveFloor(stateUpdateFunction: React.Dispatch<React.SetStateAction<state>>, state: state, callingFloor: number, callingElevatorShaft: number) {
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
