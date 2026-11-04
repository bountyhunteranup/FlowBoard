# FlowBoard

A Kanban task management application that enforces Work-in-Progress (WIP) limits.

## Features
- Create and manage tasks.
- Organize tasks into To Do, In Progress, and Done.
- Configure the WIP limit.
- Block tasks when the In Progress limit is reached.
- Prevent lowering the limit below active tasks.
- Display the current WIP count.
- Save tasks using browser LocalStorage.

## Technologies
- HTML5
- CSS3
- JavaScript
- Browser LocalStorage

## How to Run

Start a local server:

    python3 -m http.server 8000

Open http://localhost:8000 in your browser.

## WIP Logic

A task can enter In Progress only when:

    Current In Progress Tasks < WIP Limit

## Limitation

This is a client-side demonstration. Data is stored in browser LocalStorage and is not synchronized between users or devices.
