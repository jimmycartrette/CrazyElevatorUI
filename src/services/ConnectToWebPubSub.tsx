import React from 'react';
import { addMessageProcessor } from './addMessageProcessor';
import { state } from '../ElevatorDirection';
import { webPubSubConnection } from '../App';

export default function ConnectToWebPubSub(setState: React.Dispatch<React.SetStateAction<state>>, setWpsConnection: React.Dispatch<React.SetStateAction<webPubSubConnection>>) {
  fetch("https://crazyelevatorwebpubsubtokengenerator.azurewebsites.net/api/elevatorWebPubSubTokenGenerator?id=jimmy")
    .then(res => res.json())
    .then(
      (result) => {

        const serviceClient = new WebSocket(result.url, 'json.webpubsub.azure.v1');
        addMessageProcessor(serviceClient, setState);
        setWpsConnection(preconn => {
          return { ...preconn, connectionString: result.url, connection: serviceClient };
        });
      },
      // Note: it's important to handle errors here
      // instead of a catch() block so that we don't swallow
      // exceptions from actual bugs in components.
      (error) => {
        console.log("something broke");
      }
    );
}
