# 8-Puzzle Solver — Uniform Cost Search

Interactive web application that solves the **8-Puzzle** with the **Uniform Cost Search (UCS)** algorithm and visualises every step of the search.
URL : https://tejus8.github.io/8_puzzle_ucs/

## Student Details
**Course:** Artificial Intelligence (BCSE306L)
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

## Tech stack
HTML5, CSS3, JavaScript (ES6), Tailwind CSS (CDN), SVG animation.

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

## Screenshots
<img width="1119" height="563" alt="Screenshot 2026-10-16 124041" src="https://github.com/user-attachments/assets/64729109-1a08-45a0-8c7f-785d1e0875a1" />
<img width="729" height="467" alt="Screenshot 2026-10-16 124130" src="https://github.com/user-attachments/assets/ba808008-3290-461b-bc7c-35b1c2201dd4" />
<img width="704" height="478" alt="Screenshot 2026-10-16 124149" src="https://github.com/user-attachments/assets/a76c1310-f571-4116-982d-a5a09389f8d3" />
<img width="776" height="511" alt="Screenshot 2026-10-16 124202" src="https://github.com/user-attachments/assets/36772a32-188f-4f36-865d-7d6dd7a23cf5" />


## Run locally
No build step is needed. Open `index.html` in a browser (an internet connection is required for the Tailwind CSS CDN script).

```bash
git clone <your-repo-url>
cd 8-puzzle-ucs
# open index.html, or serve it:
python3 -m http.server 8000
```

## Deployed with GitHub Pages
GitHub Pages URL : https://tejus8.github.io/8_puzzle_ucs/


## How it works
UCS keeps a priority queue ordered by path cost g(n). It repeatedly pops the cheapest node, stops if it is the goal, otherwise expands it by sliding the blank into each legal neighbour (cost 1 per move) and skips states already seen. With unit costs it expands level by level and returns an optimal solution.
Solvability is checked with inversion parity; unsolvable puzzles exhaust all 181,440 reachable states and report *Not Found*.

| Property | Value |
|---|---|
| Time / Space | O(b^(1+⌊C*/ε⌋)), i.e. O(b^d) for unit costs |
| Complete | Yes |
| Optimal | Yes |

## Comparison of Search Algorithms

| Algorithm | Type | Complete | Optimal | Time | Space | Remarks for the 8-Puzzle |
|---|---|---|---|---|---|---|
| Breadth-First Search (BFS) | Uninformed | Yes | Yes (unit step cost) | O(b^d) | O(b^d) | Expands level by level; behaves the same as UCS here because every move costs 1 |
| Depth-First Search (DFS) | Uninformed | No (can loop without a visited check) | No | O(b^m) | O(bm) | Very low memory, but may return a long, non-shortest solution |
| Iterative Deepening DFS (IDDFS) | Uninformed | Yes | Yes (unit step cost) | O(b^d) | O(bd) | Optimal like BFS with far less memory, but repeats earlier work |
| **Uniform Cost Search (UCS)** ✔ implemented | Uninformed | Yes (step cost ≥ ε > 0) | Yes | O(b^(1+⌊C*/ε⌋)) | O(b^(1+⌊C*/ε⌋)) | Expands the lowest path cost g(n) first; works with unequal costs; explores in every direction |
| Greedy Best-First Search | Informed | No | No | O(b^m) | O(b^m) | Fast when the heuristic is good, but can be misled and gives no optimality guarantee |
| A* Search | Informed | Yes | Yes (admissible heuristic) | Exponential in the worst case, usually far less than UCS | O(b^d) | Uses f(n) = g(n) + h(n), e.g. misplaced tiles or Manhattan distance; a natural improvement on UCS |

## References

### Textbooks
1. S. Russell and P. Norvig, *Artificial Intelligence: A Modern Approach*, 4th ed., Pearson, 2020. Chapter 3 (Solving Problems by Searching) covers uniform-cost search and the 8-puzzle

### Research papers
2. E. W. Dijkstra, "A note on two problems in connexion with graphs," *Numerische Mathematik*, vol. 1, pp. 269–271, 1959. UCS is Dijkstra's algorithm applied to an implicit graph.

### Online documentation
3. Wikipedia, "15 puzzle" (also covers the 8-puzzle variant): https://en.wikipedia.org/wiki/15_puzzle
4. Wikipedia, "Dijkstra's algorithm" (includes the uniform-cost search variant): https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm
5. MDN Web Docs, "SVG: Scalable Vector Graphics": https://developer.mozilla.org/en-US/docs/Web/SVG
6. Tailwind CSS documentation: https://tailwindcss.com/docs
7. GitHub Pages documentation: https://docs.github.com/en/pages
