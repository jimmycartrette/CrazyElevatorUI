import './App.css';

function App() {
  return (
    <div class="floor">
      <div class="topindicator metal">
        <div class="indicator upindicator"></div>
        <div class="indicator downindicator"></div>
      </div>
      <div class="elevatorcontainer">

        <label class="elevator" for="elevatorswitch1">
          <span class="doors">
            <div class="insideelevator">

              <div class="box">

                <div class="box__face box__face--back">
                  <div class="lightcone lightcone1"></div><div class="lightcone lightcone2"></div><div class="lightcone lightcone3"></div>
                </div>
                <div class="box__face box__face--right"></div>
                <div class="box__face box__face--left"></div>
                <div class="box__face box__face--top"><span class="downlight downlight1"></span><span class="downlight downlight2"></span><span class="downlight downlight3"></span></div>
                <div class="box__face box__face--bottom"></div>
              </div>
            </div>
            <input type="checkbox" name="toggledoors" id="elevatorswitch1" />
            <div class="door left metal linear"></div>
            <div class="door right metal linear"></div>
          </span>
        </label>
      </div>
    </div>
  );
}

export default App;
