---
title: JavaScript Variables and Data Types Bundle
excerpt: A comprehensive guide to understanding JavaScript variables and data types, covering everything from variable declarations to primitive and non-primitive data types.
date: 2019-07-10
category: JavaScript
featured: true
---

# JavaScript Variables and Data Types Bundle

Every programming language requires something to store information. Information which is required to handle and manipulate data. JavaScript is no new to this style.

## Understanding Information Storage

In our daily lives, we encounter various forms of information storage:

- **A Family tree**: Names of the family members, age, hierarchy etc. is an information
- **Telephone Directory**: Number of people in the list, their addresses and contact details are all collection of information in the directory.

Similarly, in programming, we need containers to store and manage data. This is where variables come into play.

## JavaScript Variables

JavaScript allows its variables to store any kind of data. Programming languages which allow this ease of access are called "Dynamically Typed". This means a variable can hold a number or even string.

Now we know what is a variable. The question arises how our system will understand variables. Therefore JavaScript allows us three types of variable declaration:

### var

The `var` keyword is the oldest way to declare variables in JavaScript. Variables declared with `var` are function-scoped, meaning they are accessible throughout the entire function in which they are declared.

```javascript
var name = "John";
var age = 25;
var isActive = true;
```

### let

The `let` keyword was introduced in ES6 (ES2015). Variables declared with `let` are block-scoped, meaning they are only accessible within the block (curly braces) where they are declared.

```javascript
let city = "New York";
let temperature = 72;
let count = 0;

// Block scope example
if (true) {
  let blockScoped = "I'm only available in this block";
}
// console.log(blockScoped); // Error: blockScoped is not defined
```

### const

The `const` keyword is also block-scoped like `let`, but it creates a constant that cannot be reassigned after declaration. However, if the constant is an object or array, its properties or elements can still be modified.

```javascript
const PI = 3.14159;
const colors = ["red", "green", "blue"];

// const cannot be reassigned
// PI = 3.14; // Error: Assignment to constant variable

// But array/object contents can be modified
colors.push("yellow"); // This works!
```

## JavaScript Data Types

JavaScript has several data types that can be categorized into primitive and non-primitive types.

### Number

A number is all integers and floating point numbers. All kind of mathematical operations like addition, subtraction, multiplication and division can be performed with numbers.

```javascript
let integer = 42;
let float = 3.14;
let negative = -10;
let sum = integer + float; // 45.14
let product = integer * 2; // 84
let division = float / 2; // 1.57
```

### String

A string is anything in JavaScript which is written in quotes. It could be either single or double quotes. JavaScript does not differentiate between them.

```javascript
let firstName = "John";
let lastName = "Doe";
let fullName = firstName + " " + lastName; // "John Doe"
let message = "Hello, World!";
let template = `My name is ${firstName} ${lastName}`; // Template literals
```

### Boolean

A boolean has two values, either "true" or "false". It checks whether the value or condition is correct or not. We will discuss about Boolean in detail later.

```javascript
let isLoggedIn = true;
let hasPermission = false;
let canAccess = isLoggedIn && hasPermission; // false
let isGreater = 10 > 5; // true
let isEqual = 5 === 5; // true
```

### Null

Null represents "empty" or "no value" in JavaScript.

```javascript
let data = null;
let user = null; // Explicitly set to no value
```

### undefined

undefined in JavaScript means "value is not defined". Some specific functions may return undefined in JavaScript.

```javascript
let variable; // undefined
console.log(variable); // undefined

function noReturn() {
  // No return statement
}
console.log(noReturn()); // undefined

let obj = {};
console.log(obj.nonExistent); // undefined
```

### Object

Objects are non-primitive data types. Objects can be container for storing type of a data or even similar data within a single container. We do not need to go in detail with objects for now.

```javascript
let person = {
  name: "John",
  age: 30,
  city: "New York",
};

// Accessing object properties
console.log(person.name); // "John"
console.log(person["age"]); // 30
```

## typeof operator

typeof operator returns the type of data, as simple as this and can be used for a quick check. Its syntax is `typeof(variable name)`.

```javascript
typeof 42; // "number"
typeof "hello"; // "string"
typeof true; // "boolean"
typeof null; // "object" (this is a known quirk in JavaScript)
typeof undefined; // "undefined"
typeof {}; // "object"
typeof []; // "object"
typeof function () {}; // "function"

// Practical usage
let value = 42;
if (typeof value === "number") {
  console.log("It's a number!");
}
```

## Conclusion

Understanding variables and data types is fundamental to JavaScript programming. Variables allow us to store and manipulate data, while data types define what kind of data we're working with. JavaScript's dynamic typing makes it flexible, but it's important to understand the different types and how to work with them effectively.
