import React from 'react'
import Parent from './Parent';
import Peer from 'peerjs';

export default function ParentComponent(props) {
    const [parent, setParent] = React.useState(Parent(new Peer(props.id)));
    const [rendered, setRendered] = React.useState(false);
    const messageRef = React.useRef();
    const childIdRef = React.useRef();
    React.useEffect(() => {
      if (rendered)
        return;
  
      parent.peer.on('open', (id) => {
        setParent({
          ...parent
        });
      });
  
      parent.peer.on('connection', (conn) => {
        conn.on('data', (data) => {
          setParent((prevParent) => {
            console.log(data);
            return {
              ...prevParent,
              messages: [data, ...prevParent.messages]
            };
          });
          console.log("Parent: ", parent);
        });
      });
  
      setRendered(true);
    }, [parent, rendered]);
  
    const send = (id) => {
      const conn = parent.peer.connect(id);
      console.log("Connecting...");
      conn.on('open', () => {
        const messageObj = {
          sender: parent.peer._id,
          message: messageRef.current.value
        };
        conn.send(messageObj);
        setParent((prevParent) => {
          console.log(messageRef.current.value);
          return {
            ...prevParent,
            messages: [messageObj, ...prevParent.messages],
            message: ''
          }
        });
      });
      console.log("Connected...");
    }
  
    return (
      <div className="wrapper">
        <div className="col">
          <h1>My ID: {parent.peer._id}</h1>
          <label>Friend ID:</label>
          <input
            type="text"
            ref={childIdRef}
          />
        <button onClick={
              () => {
                setParent((prevParent) => {
                  return {
                    ...prevParent,
                    children: [...prevParent.children, childIdRef.current.value]
                  };
                });
              }
            }>Set</button>
          <br />
          <br />
          <label>Message:</label>
          <input
            type="text"
            ref={messageRef}
          />
          <button onClick={() => send(parent.children[0])}>Send</button>
          {
            parent.messages.map(
              (message, i) => {
                return (
                  <div key={i}>
                    <h3>{message.sender}:</h3>
                    <p>{message.message}</p>
                  </div>
                )
              }
            )
          }
        </div>
      </div>
    );
  
}
