import React from 'react';
import { state, ElevatorStatus, ElevatorDirection } from '../ElevatorDirection';
import { moveFloor } from "./moveFloor";

export function callElevator(state: state, callingFloor: number, callingElevatorShaft: number, stateUpdateFunction: React.Dispatch<React.SetStateAction<state>>): void {

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
