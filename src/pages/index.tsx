import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

let socket: Socket;

function HomePage() {
  
  const [ seen, setSeen ] = useState([]);
  const [ processing, setProcessing ] = useState('');

  const socketInitializer = async () => {
    await fetch("/api/socket");
    socket = io();
    
    socket.on("seen", (url: string) => {
      setSeen((seen) => [...seen, url]);
    });

    socket.on("processing", (url: string) => {
      setProcessing(url);
    });
  };

  useEffect(() => {
    socketInitializer();
  }, []);

  function onStartCrawling() {
    setProcessing('');
    setSeen([]);
    socket.emit(
      "start",
      "https://www.bbc.co.uk/news",
      "^https?://www.bbc.co.uk/news",
      3
    );
  }

  function onStopCrawling() {
    socket.emit("cancel");
  }

  return (
    <div>
      <h2>Crawler</h2>
      <button onClick={onStartCrawling}>Start</button>
      <button onClick={onStopCrawling}>Stop</button><br />
      {processing && `Processing: ${processing}`}<br />
      {seen.length > 0 ?
        <ul>
          {seen.map((link) => (
            <li key={link}>{link}</li>
          ))}
        </ul> : ''
      }
    </div>
  );
}

export default HomePage;
