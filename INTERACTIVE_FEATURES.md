# Interactive Features Guide

This guide explains how to use interactive features in your blog posts.

## Polls

Add a poll to your post using this syntax:

```
[POLL:What's your favorite programming language?|JavaScript|Python|TypeScript|Rust]
```

Format: `[POLL:Question|Option1|Option2|Option3|...]`

## Code Runner

Add an interactive code runner that allows users to execute code:

````
[CODE-RUNNER:javascript]
```javascript
console.log("Hello, World!");
let x = 10;
console.log(x * 2);
````

```

The code will be displayed with a "Run Code" button that executes it.

## Interactive Diagrams

Add an interactive diagram:

```

[DIAGRAM:Git Workflow]
[
{"id": "1", "label": "Working Directory", "x": 50, "y": 100, "connections": ["2"]},
{"id": "2", "label": "Staging", "x": 200, "y": 100, "connections": ["3"]},
{"id": "3", "label": "Repository", "x": 350, "y": 100}
]

```

The diagram will be interactive - users can click on nodes to highlight them.

```
