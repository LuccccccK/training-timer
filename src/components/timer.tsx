import { useTimer } from "react-timer-hook";
import { Box, Button, Typography } from '@mui/material';
import { useEffect, useState } from "react";
import useSound from 'use-sound';
import Sound from '../assets/Countdown02-1.mp3';

type mode = 'before' | 'training' | 'interval' | 'end';

const startbufferTimerSeconds = 5; // 開始時のバッファ秒数
const trainingTimerSeconds = 20; // タイマー秒数
const intervalTimerSeconds = 10; // インターバル用タイマー秒数
const timerCounter = 2; // タイマー繰り返し回数

const getDateForTimer = (seconds: number) => {
  const timerDate = new Date();
  timerDate.setSeconds(timerDate.getSeconds() + seconds);
  return timerDate;
}

function MyTimer() {
  const expiryTimestamp = getDateForTimer(startbufferTimerSeconds);
  const [isActivate, setIsActivate] = useState(false);
  const [counter, setCounter] = useState(1);
  const [mode, setMode] = useState('before' as mode);

  const {
    seconds, isRunning,
    start, pause, resume, restart
  } = useTimer({
    autoStart: false,
    expiryTimestamp,
    onExpire: () => { callback() },
  });

  // NOTE: onExpire の Callback で restart を呼び出しても意図通りに動作しない
  const callback = () => {
    switch(mode) {
      case 'training':
        // training した場合にのみカウンターをインクリメント
        setCounter(counter + 1);
        setMode('interval')
        break;
      case 'before':
      case 'interval':
        setMode('training')
        break;
    }
  }

  useEffect(() => {
    if (timerCounter < counter) {
      setMode('end')
      return;
    }
    if (isActivate) {
      switch(mode) {
        case 'training':
          restart(getDateForTimer(trainingTimerSeconds))
          break;
        case 'before':
          restart(getDateForTimer(startbufferTimerSeconds))
          break;
        case 'interval':
          restart(getDateForTimer(intervalTimerSeconds))
          break;
      }
    }
  }, [mode]) 

  const [play] = useSound(Sound);
  useEffect(() => {
    if (seconds !== 3) {
      return;
    }
    play();
  }, [seconds]);

  return (
    <Box style={{ textAlign: "center" }}>
      <Typography variant="h1" component="h2">
        {seconds}
      </Typography>
      <Typography variant="h2" component="h3">
        {mode}
      </Typography>
      <Typography variant="body1">
        {isRunning ? "Running: " + counter + " set" : "Not running"}
      </Typography>
      <Button onClick={() => {
        setIsActivate(true)
        start();
      }}>
        Start
      </Button>
      <Button onClick={pause}>Pause</Button>
      <Button onClick={resume}>Resume</Button>
      {/* Restart ボタンは一度Startボタンを押下して、Activateされた状態にのみ利用可能とする */}
      <Button onClick={() => {
        setMode('before')
        setCounter(1);
        restart(getDateForTimer(startbufferTimerSeconds)) 
      }} disabled={!isActivate}>
        Restart
      </Button>
    </Box>
  );
}

export default MyTimer;