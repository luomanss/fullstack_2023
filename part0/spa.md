``` mermaid
sequenceDiagram
    participant browser
    participant server

    browser->+server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/spa
    server-->-browser: 200 OK, html
    browser->+server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/main.css
    server-->-browser: 200 OK, main.css
    browser->+server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/main.js
    server-->-browser: 200 OK, main.js

    Note left of browser: browser starts to execute main.js

    browser->+server: [XHR] HTTP GET https://studies.cs.helsinki.fi/exampleapp/data.json
    server-->-browser: 200 OK, [{ content: "...", date: "2021-06-05T23:44:23.275Z" }, ...]

    Note left of browser: browser parses JSON data and <br/>appends list elements to DOM
```