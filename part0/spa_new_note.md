``` mermaid
sequenceDiagram
    participant browser
    participant server
    
    Note left of browser: user enter new note and clicks save

    Note left of browser: browser handles submit form event<br/> by sending XHR to server

    browser->>+server: [XHR] HTTP POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa

    server->>-browser: 201 Created, { content: "...", date: "2023-04-25T14:45:49.450Z" }

    Note left of browser: browser parses JSON data,<br/> and appends new note to the list
```