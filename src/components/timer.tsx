import { useTimer } from "react-timer-hook";
import { Box, Button, Typography } from '@mui/material';
import { useEffect, useState } from "react";

type mode = 'training' | 'interval';

const trainingTimerSeconds = 5; // タイマー秒数
const intervalTimerSeconds = 3; // インターバル用タイマー秒数
const timerCounter = 2; // タイマー繰り返し回数

const getDateForTimer = (seconds: number) => {
  const timerDate = new Date();
  timerDate.setSeconds(timerDate.getSeconds() + seconds);
  return timerDate;
}

function MyTimer() {
  const expiryTimestamp = getDateForTimer(intervalTimerSeconds);
  const [counter, setCounter] = useState(1);
  const [mode, setMode] = useState('interval' as mode);

  const {
    seconds, minutes, isRunning,
    start, pause, resume, restart
  } = useTimer({
    autoStart: false,
    expiryTimestamp,
    onExpire: () => { callback() },
  });

  const callback = () => {
    // NOTE: onExpire の Callback で restart を呼び出しても意図通りに動作しない
    setMode((mode == 'interval') ? 'training' : 'interval');
    setCounter(counter + 1);
  }

  useEffect(() => {
    if (timerCounter < counter) {
      return;
    }
    const timerSeconds = (mode == 'interval') ? intervalTimerSeconds : trainingTimerSeconds;
    restart(getDateForTimer(timerSeconds))
  }, [isRunning]) 

  return (
    <Box style={{ textAlign: "center" }}>
      <Typography variant="h1" component="h2">
        {mode}
      </Typography>
      <Box style={{ fontSize: "100px", height: "100px" }}>
        {minutes}:{seconds}
      </Box>
      <p>{isRunning ? "Running" : "Not running"}</p>
      <Button onClick={start}>Start</Button>
      <Button onClick={pause}>Pause</Button>
      <Button onClick={resume}>Resume</Button>
      <Button onClick={() => { restart(getDateForTimer(trainingTimerSeconds)) }} >Restart</Button>
    </Box>
  );
}

export default MyTimer;