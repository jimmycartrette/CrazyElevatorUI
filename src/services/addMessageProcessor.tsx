import React from 'react';
import { state, elevatorState, elevatorDoorState } from "../ElevatorDirection";


export interface partialStateUpdate {
    'elevatorUpdate': elevatorState,
    'doorsUpdate': elevatorDoorState[]
}

export function addMessageProcessor(serviceClient: WebSocket, setState: React.Dispatch<React.SetStateAction<state>>) {
    serviceClient.onmessage = evt => {
        let payload = JSON.parse(evt.data);
        let data = payload.data;
        switch (payload.type) {
            case "message":
                setState(existing => {

                    if (isPartialStateUpdate(data)) {
                        let elevatorUpdate = (data as partialStateUpdate).elevatorUpdate;
                        let doorsUpdate = (data as partialStateUpdate).doorsUpdate;
                        let newState = Object.assign({}, existing) as state;
                        let elevator = newState.elevatorState.find(es => es.elevatorNumber === elevatorUpdate.elevatorNumber);
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        elevator = elevatorUpdate;
                        doorsUpdate.forEach((newDoor: elevatorDoorState) => {
                            let existingDoor = newState.elevatorDoorState.find(ed => ed.elevatorShaftNumber === newDoor.elevatorShaftNumber && ed.floor === newDoor.floor) as elevatorDoorState;
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            existingDoor = newDoor;
                        });
                        return newState;
                    } else {
                        return payload.data as state;
                    }
                }
                );
                break;
        }

    };
}
function isPartialStateUpdate(data: any): boolean {
    return Object.prototype.hasOwnProperty.call(data, "elevatorUpdate") && Object.prototype.hasOwnProperty.call(data, "doorsUpdate");
}

