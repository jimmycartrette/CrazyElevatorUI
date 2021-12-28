import React from 'react';
import { state, elevatorState, elevatorDoorState } from "./ElevatorDirection";

export function addMessageProcessor(serviceClient: WebSocket, setState: React.Dispatch<React.SetStateAction<state>>) {
    serviceClient.onmessage = evt => {
        var data = JSON.parse(evt.data);
        switch (data.type) {
            case "message":
                setState(existing => {

                    if (data.data["elevatorUpdate"]) {
                        let newState = Object.assign({}, existing);
                        let elevator = newState.elevatorState.find(es => es.elevatorNumber === parseInt(data.data["elevatorUpdate"].id)) as elevatorState;
                        elevator.atFloor = data.data["elevatorUpdate"].atFloor;
                        elevator.elevatorStatus = data.data["elevatorUpdate"].elevatorStatus;
                        if (data.data["elevatorUpdate"]["primaryElevatorQueue"]) { console.warn("Elevator " + elevator.elevatorNumber + " at " + elevator.atFloor + (data.data["elevatorUpdate"].primaryElevatorQueue?.toFloor ? " going to " + data.data["elevatorUpdate"].primaryElevatorQueue?.toFloor : "") + (data.data["elevatorUpdate"].secondaryElevatorQueue?.toFloor ? " then going to " + data.data["elevatorUpdate"].secondaryElevatorQueue?.toFloor : "")); }

                        data.data["doorsUpdate"].forEach((door: elevatorDoorState) => {
                            let thisdoor = newState.elevatorDoorState.find(ed => ed.elevatorShaftNumber === door.elevatorShaftNumber && ed.floor === door.floor) as elevatorDoorState;
                            thisdoor.open = door.open;
                            thisdoor.elevatorDirection = door.elevatorDirection;
                            thisdoor.elevatorAtFloor = door.elevatorAtFloor;

                        });

                        return newState;
                    } else {
                        return data.data as state;
                    }
                }
                );
                break;
        }

    };
}
