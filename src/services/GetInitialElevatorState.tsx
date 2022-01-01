import React from 'react';
import { webPubSubConnection } from '../App';
import { state } from '../ElevatorDirection';
import ConnectToWebPubSub from './ConnectToWebPubSub';

export function GetInitialElevatorState(setState: React.Dispatch<React.SetStateAction<state>>, setWpsConnection: React.Dispatch<React.SetStateAction<webPubSubConnection>>) {
  fetch("https://crazyelevatorcurrentstate.azurewebsites.net/api/GoCurrentElevatorState")
    .then(res => res.json())
    .then(
      (result) => {
        setState(result);
        ConnectToWebPubSub(setState, setWpsConnection);
      },
      (error) => {
        console.log("something broke");
      }
    );
}
