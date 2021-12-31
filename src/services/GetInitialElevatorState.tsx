import React from 'react';
import { state } from '../ElevatorDirection';

export function GetInitialElevatorState(setState: React.Dispatch<React.SetStateAction<state>>) {
  fetch("https://crazyelevatorcurrentstate.azurewebsites.net/api/GoCurrentElevatorState")
    .then(res => res.json())
    .then(
      (result) => {
        setState(result);
      },
      (error) => {
        console.log("something broke");
      }
    );
}
