# My Perfect Burger - 3D Burger Builder Web App

## Overview

A web application that allows users to create and customize their own 3D burgers using a variety of ingredients. The app utilizes React for the frontend, Tailwind CSS for styling, and Three.js for 3D rendering.

## Table of Contents

1. [Architecture](#architecture)
2. [User Interface](#user-interface)
3. [Burger Customization](#burger-customization)
4. [Real-time 3D Rendering](#real-time-3d-rendering)
5. [Installation](#installation)
6. [Testing](#testing)
6. [Demo/Screenshots](#Demo/Screenshots)


## Architecture

### Frontend

- Framework: React/Next.js
- Styling: TailwindCSS + shadcn/ui
- 3D Rendering Engine: Three.js

### Backend

- Server-rendering: Next.js
- 3D Asset Management: echo3D


## User Interface

### Components

1. Navbar
2. Instructions / Tooltips
3. Ingredient Selection Panel
4. Burger Customization Area

### Responsiveness

The app is designed to be responsive and accessible on various devices and screen sizes.

## 3D Assets and Optimization

### Asset Creation

High-quality, realistic 3D models were created for various ingredients:

- Buns
- Patties
- Cheese
- Lettuce
- Tomato

### Asset Optimization

1. Used echo3D to deliver optimized 3D objects for faster loading times and improved web performance.
2. Assets are dynamic to what exists in the echo3D database. Objects added to Echo3D are automatically added to the Application when they have the tags: "burger"
![console](screenshots/console.png)
![cheese selector](screenshots/cheeseSelector.png)

## Burger Customization

### Functionality

1. Select ingredients from dropdown menus and checkboxes
2. Add or remove ingredients dynamically to the burger stack
3. Visual feedback (e.g. Toast alerts) to indicate any errors occuring throughout the app

## Real-time 3D Rendering

### Rendering Engine

Implemented Three.js to display the custom burger in real-time as the user adds or modifies ingredients.

## Installation

1. Clone the repository
`git clone https://github.com/your-username/my-perfect-burger.git`

2. Change into the project directory
`cd my-perfect-burger`

3. Install dependencies
`npm install`

4. Start the development server
`npm run dev`

The web app will be accessible at `http://localhost:3000`.

## Demo/Screenshots 


Dark theme:
![dark mode](screenshots/darkMode.png)

Light theme:
![light mode](screenshots/lightMode.png)




