# TrelloDoro
This project was developed as part of a course and was selected as the best project.

_A combined Trello and Pomodoro productivity tool_

## Summary
TrelloDoro is a web application that combines a simple Trello-style task board with a Pomodoro timer. The goal is to help users plan, structure, and stay focused on their tasks in a clear and motivating way.
The project is built using HTML, CSS and JavaSCript, and all data is automatically saved in the browsers localStorage

---

## Features
### Kanban Board
- The columns: "To Do", "Doing" and "Done"
- Create, edit, move and delete tasks
- Drag-and-drop functionality between columns
- Automatic saving with "localStorage", tasks remains after closing the browser

### Pomodoro Timer
- Separate focus page for 25-minute work sessions
- Automatic switching between focus, short break and long break phases
- Buttons for "Start", "Pause", "Reset", "Skip", and "To Board"
- Calming visual design with smooth background transitions

---

## Technical Overview

1. **app.js** - manages the Kanban board logic
  - Creating, editing and deliting tasks
  - Drag-and-drop functionality
  - Saving and loading tasks from "localStorage"

2. **timer.js** - manages the Pomodoro timer logic
   - Time tracking, countdowns, and phase switching
   - Handles multiple focus and break cycles automatically
   - Provides navigation back to the main board
  
The interface was first designed in **Figma**, which helped visualize the layout and test usability before coding began.
The layout uses **CSS Grid** to maintain a flexible, clean, and balanced design.

---

## What I learned
During the development of TrelloDoro, I learned to:
  - Use **semantic HTML5 tags** effectively
  - Design responsive layouts with **CSS Grid**
  - Work extensively with DOM manipulation in JavaScript
  - Implement **drag-and-drop** interactions using `dragstart`, `dragover`, and `drop` events
  - Store and retrive  data using *'localStorage** and **JSON**
  - Create timer-based logic using **setInterval()** and phase management
  - Improve the "user experience" through interface design and testing
  - Plan and execute a project from **idea -> prototype -> final product**

---

## User Flow (example)
1. User opens the site, saved tasks are automatically loaded
2. Creates a new task in "To Do"
3. Moves it to "Doing" when starting the work
4. Opens the "Pomodoro Timer" for a 25-minute focus session
5. After four sessions, a longer break begins automatically
6. Moves the task to "Done", all progress is saved automatically

---

## Design
- Light, neutral colors for the board
- Rounded corners and soft edges for a friendly look
- A dark, animated background for the timer page to encourage focus
- Smooth animations when adding, moving, or deliting cards

## Created by
**Måns Salminen**
_Gesällprov - TrelloDoro_
