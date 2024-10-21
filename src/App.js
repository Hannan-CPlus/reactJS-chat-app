import { useEffect, useState } from "react";

import Pusher from "pusher-js";

function App() {
  const apiURL = process.env.REACT_APP_NESTJS_APP_BACKEND +'/api/' 
  const [username, setUsername] = useState("username");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  
  useEffect(() => {
    
    const pusher = new Pusher('ab3de070f05de881bc75', {
      cluster: 'ap2'
    });
    
    let allMessages = []
    const channel = pusher.subscribe('chat');
    channel.bind('message', function(data) {
      allMessages.push(data)
      setMessages(allMessages)
    });
  }, []);

  const submit = async e => {
    e.preventDefault()

    await fetch(apiURL + 'messages', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        username,
        message
      })
    })
    setMessage('')
  };

  return (
    <div className="container">
      <div class="d-flex flex-column align-items-stretch flex-shrink-0 bg-body-tertiary">
        <div
          href="/"
          class="d-flex align-items-center flex-shrink-0 p-3 link-body-emphasis text-decoration-none border-bottom"
        >
          <input
            class="fs-5 fw-semibold"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div class="list-group list-group-flush border-bottom scrollarea">
          {messages.map((message) => {
            return (
              <div key={message.username} class="list-group-item list-group-item-action py-3 lh-sm">
                <div class="d-flex w-100 align-items-center justify-content-between">
                  <strong class="mb-1">{message.username}</strong>
                </div>
                <div class="col-10 mb-1 small">{message.message}</div>
              </div>
            );
          })}
        </div>
      </div>
      <form onSubmit={(e) => submit(e)}>
        <input
          className="form-control"
          placeholder="Write a message!"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </form>
    </div>
  );
}

export default App;
