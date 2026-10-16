# 8-Puzzle Solver — Uniform Cost Search

Interactive web application that solves the **8-Puzzle** with the **Uniform Cost Search (UCS)** algorithm and visualises every step of the search.

**Course:** Artificial Intelligence
**Name:** Tejus Sinha
**Reg No:** 24BCI0175

## Features
- Home page with title, introduction to the 8-puzzle and navigation menu
- Two input methods: **manual** (initial + goal state) and **random solvable puzzle**
- Animated SVG board (the blank slides tile by tile) showing initial, goal and current states
- Live view of generated successors, frontier (open list), explored (closed list)
- Real-time statistics: current/parent node, nodes generated and expanded, depth, path cost
- Final report: solution found/not found, moves, nodes generated/expanded, max depth, execution time, path cost, approximate memory
- Controls: Run, Pause, Resume, Next step, Previous, Skip to end, Reset, speed slider
- Algorithm Info page: description, working principle, advantages, limitations, complexity, completeness, optimality

## Project structure
```
8-puzzle-ucs/
├── index.html
├── README.md
├── .gitignore
└── assets/
    ├── css/style.css      # theme (green #7ef542) and component styles
    ├── js/app.js          # UCS algorithm, playback engine, rendering
    └── images/favicon.svg
```

## Run locally
No build step is needed. Open `index.html` in a browser (an internet connection is required for the Tailwind CSS CDN script).

```bash
git clone <your-repo-url>
cd 8-puzzle-ucs
# open index.html, or serve it:
python3 -m http.server 8000
```

## Deploy with GitHub Pages
Repository **Settings → Pages → Deploy from a branch → main / (root)**.

## How it works
UCS keeps a priority queue ordered by path cost g(n). It repeatedly pops the cheapest node, stops if it is the goal, otherwise expands it by sliding the blank into each legal neighbour (cost 1 per move) and skips states already seen. With unit costs it expands level by level and returns an optimal solution.
Solvability is checked with inversion parity; unsolvable puzzles exhaust all 181,440 reachable states and report *Not Found*.

| Property | Value |
|---|---|
| Time / Space | O(b^(1+⌊C*/ε⌋)), i.e. O(b^d) for unit costs |
| Complete | Yes |
| Optimal | Yes |

## Tech stack
HTML5, CSS3, JavaScript (ES6), Tailwind CSS (CDN), SVG animation.
