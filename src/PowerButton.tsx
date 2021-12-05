import './PowerButton.css';
import { ReactComponent as YourSvg } from './power-button-svgrepo-com.svg';
import { useEffect, useState } from 'react';

export interface powerState {
    enabled: boolean
}

const togglePower = (action: string, setPowerState: React.Dispatch<React.SetStateAction<{
    enabled: boolean;
}>>) => {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://crazyelevatorcontroller.azurewebsites.net/api/elevatorControllerTimerToggle?action=" + action, true);
    xhr.send();
    setPowerState({ enabled: action === 'enable' ? true : false });
};

const PowerButton = () => {
    const [powerState, setPowerState] = useState({ enabled: false });
    useEffect(() => {
        var xhr = new XMLHttpRequest();

        xhr.addEventListener("readystatechange", () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    // request successful
                    var response = xhr.responseText,
                        json = JSON.parse(response);

                    setPowerState({
                        enabled: json.enabled
                    });
                } else {
                    // error
                    setPowerState({
                        enabled: false
                    });
                }
            }
        });

        xhr.open("GET", "https://crazyelevatorcontroller.azurewebsites.net/api/elevatorControllerTimerToggle?action=status", true);
        xhr.send();
    }, []);
    return (
        <div className={"powerButton " + (powerState.enabled ? "powerButtonEnabled" : "")} onClick={() => togglePower(powerState.enabled ? 'disable' : 'enable', setPowerState)}>
            <YourSvg />
        </div>
    );
}


export default PowerButton;