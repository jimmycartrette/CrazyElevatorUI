
export enum ElevatorDirection { UP = 1, DOWN, NONE }
;
export enum ElevatorStatus { MOVING = 1, ATFLOOR }
;
export const MOVE_DELAY = 4000;

export interface elevatorState {
    elevatorNumber: number;
    direction?: ElevatorDirection;
    elevatorStatus: ElevatorStatus;
    fromFloor?: number;
    toFloor?: number;
    progress?: number;
    atFloor?: number;
}

export interface elevatorDoorState {
    elevatorShaftNumber: number;
    floor: number;
    open: boolean;
    elevatorAtFloor: number;
    elevatorDirection: ElevatorDirection;
    onClick?: any;
}
export interface state {
    elevatorState: Array<elevatorState>;
    elevatorDoorState: Array<elevatorDoorState>;
}
