import { useEffect } from "react";
import io, { Socket } from "socket.io-client";







// ConnectedApp Component components/ConnectedApp.ts

let socket: Socket;

const ConnectedApp = () => {
  const [ seen, setSeen ] = useState<Array<string>>([]);
  const [ isDisabled, setDisabled ] = useState<boolean>(false);
  const [ processing, setProcessing ] = useState<string>('');
  
  const [startCrawling, setStartCrawling] = useState<Object>({
      url: "https://www.bbc.co.uk/news",
      followUrlRestriction: "^https?://www.bbc.co.uk/news",
      maxConcurrentRequests: 3
    })

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

  const cleanCrawiling = () => {
    setProcessing('');
    setSeen([]);
  }

  const onStartCrawling = () => {
    cleanCrawiling();
    socket.emit("start", startCrawling);
    toggleDisabled();
  }

  const toggleDisabled = () => {
    setDisabled(!isDisabled);
}

  const onStopCrawling = () => {
    socket.emit("cancel");
    cleanCrawiling();
    toggleDisabled();
    setProcessing('server stop')
  }
  return ({
    seen,
    processing,
    isDisabled,
    socketInitializer,
    setStartCrawling,
    onStartCrawling,
    onStopCrawling,
  })
}










// ListComponent Component components/ListComponent.ts

type ListComponentTypes = {
  processing: string,
  seen: Array<any>,
}

const ListComponent = (props: ListComponentTypes) => {
  const {processing, seen} = props;
  
  return (
    <div>
      {seen.length ? `Processing: ${processing}` : processing}<br />
      {seen.length > 0 ?
        <ul>
          <p>Seen List:</p>
          {seen.map((link, i) => (
            <li key={i}>{link}</li>
          ))}
        </ul> : ''
      }
    </div>
  );
}








// APP Component components/App.ts

type PropsType = {
  name: string,
  processing: string,
  seen: Array<string>,
  isDisabled: boolean,
  onStartCrawling: () => void,
  onStopCrawling: () => void,

}

const App = (props: PropsType) => {
  const {name, processing, seen, isDisabled, onStartCrawling, onStopCrawling} = props;
  
  // Improve TODO: use setStartCrawling to modify our startCrawling values
  // Suggestion: add inputs to set: url, followUrlRestriction, and maxConcurrentRequests
  
  return (
    <div>
      <h2>{name}</h2>
      <button onClick={onStartCrawling} disabled={isDisabled} >Start</button>
      <button onClick={onStopCrawling} disabled={!isDisabled}>Stop</button><br />
      <ListComponent
        processing={processing}
        seen={seen}
      />
    </div>
  );
}










// HOMEPAGE Component index.ts

const HomePage = () => {
 const { processing, seen, isDisabled, onStartCrawling, socketInitializer, onStopCrawling } = ConnectedApp();

  useEffect(() => {
    socketInitializer();
  }, []);

  return (
    <App 
      name={'Crawler Project'}
      processing={processing}
      seen={seen}
      isDisabled= {isDisabled}
      onStartCrawling={onStartCrawling}
      onStopCrawling={onStopCrawling}
    />
  );
}

export default HomePage;
