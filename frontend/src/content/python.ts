import type { Topic } from './types';

export const pythonTopics: Topic[] = [
  {
    id: 'py-basics',
    house: 'python',
    title: 'print, variables, input & data types',
    emoji: '📦',
    story: {
      title: 'Welcome to the Momo Factory!',
      pictures: ['🏭', '📦', '🖥️'],
      lines: [
        'Python is our Momo Factory. We give it orders, and it works for us.',
        'A variable is a box (dabba) with a name sticker. name = "Sita" puts "Sita" inside the box called name.',
        'print() is the shop window — it SHOWS things on the screen.',
        'input() is the waiter asking a question. Whatever the customer says comes back as text.',
        'Data types are kinds of things: str = text "Sita", int = whole number 15, float = decimal 3.5, bool = True / False.',
      ],
    },
    animation: 'printVars',
    play: {
      task: 'Run the code. Then change the name to YOUR name and add a line that prints your age next year.',
      starter: `name = input("What is your name? ")
age = int(input("How old are you? "))
school = "Shree Janata Secondary School"

print("Namaste", name)
print("You study at", school)
print("Next year you will be", age + 1)
print(type(name), type(age))
`,
      stdin: 'Sita\n15',
    },
    hints: [
      'Text always lives inside quotes: "Sita". Numbers do not: 15.',
      'input() gives TEXT. To do maths, wrap it: int(input("Age? "))',
      'Example: print("Next year:", age + 1)',
    ],
    mistake: {
      wrong: 'age = input("Age? ")\nprint(age + 1)',
      right: 'age = int(input("Age? "))\nprint(age + 1)',
      why: 'input() always gives text ("15"). Text + number is not allowed. Change it to a number with int().',
    },
    seeTip: 'SEE often asks: "What is the output?" and "What is the data type of input()?" — answer: str (string). Also remember: variable names cannot start with a number or have spaces.',
    quiz: [
      { q: 'What data type does input() give?', options: ['int', 'str', 'float', 'bool'], answer: 1, explain: 'input() always returns text (str), even if you type 15.' },
      { q: 'Which is a valid variable name?', options: ['2name', 'my name', 'my_name', 'print()'], answer: 2, explain: 'Names can have letters, digits and _, but cannot start with a digit or contain spaces.' },
      { q: 'What is the output?', code: 'x = 5\nx = x + 2\nprint(x)', options: ['5', '2', '7', 'x + 2'], answer: 2, explain: 'The box x had 5. We put 5 + 2 = 7 back into the same box.' },
    ],
    badge: { emoji: '🖨️', name: 'Print Prince' },
  },
  {
    id: 'py-fstring',
    house: 'python',
    title: 'f-strings',
    emoji: '📝',
    story: {
      title: 'The fill-in-the-blank form',
      pictures: ['📝', '✍️', '🧾'],
      lines: [
        'At the bank, you fill a form: "My name is ____ and I am ____ years old."',
        'An f-string is the same! Put f before the quotes and {curly brackets} where the blanks are.',
        'Python fills each blank with the value from the box: f"My name is {name}".',
        'No more + signs, no more str(). Easy and neat!',
      ],
    },
    animation: 'fstring',
    play: {
      task: 'Make a marks slip: print the name, total and percentage using ONE f-string. Bonus: show percentage with 2 decimals using {percent:.2f}.',
      starter: `name = "Aarav"
science = 78
maths = 85
computer = 92

total = science + maths + computer
percent = total / 3

print(f"Student: {name}")
print(f"Total marks: {total}")
print(f"Percentage: {percent:.2f}%")
`,
    },
    hints: [
      'Do not forget the letter f before the opening quote.',
      'Put variable names inside { }, like {total}.',
      'Rounding: {percent:.2f} shows 2 numbers after the dot.',
    ],
    mistake: {
      wrong: 'print("Total is {total}")',
      right: 'print(f"Total is {total}")',
      why: 'Without the f, Python prints the curly brackets as normal text: Total is {total}.',
    },
    seeTip: 'If a question asks you to "display the result with a message", an f-string is the cleanest answer. Write f"Area = {area}".',
    quiz: [
      { q: 'What is the output?', code: 'n = "Ram"\nprint(f"Hi {n}!")', options: ['Hi {n}!', 'Hi Ram!', 'Hi n!', 'Error'], answer: 1, explain: 'The f fills {n} with the value "Ram".' },
      { q: 'What is the output?', code: 'n = "Ram"\nprint("Hi {n}!")', options: ['Hi Ram!', 'Hi {n}!', 'Error', 'Hi !'], answer: 1, explain: 'No f before the quote, so {n} is printed as it is.' },
      { q: 'Which shows 3.14159 as 3.14?', options: ['f"{x:2}"', 'f"{x:.2f}"', 'f"{x.2}"', 'f"{2f:x}"'], answer: 1, explain: ':.2f means "float with 2 decimal places".' },
    ],
    badge: { emoji: '📝', name: 'Form Filler' },
  },
  {
    id: 'py-if',
    house: 'python',
    title: 'Conditional statements (if / elif / else)',
    emoji: '🚦',
    story: {
      title: 'The traffic light at Thapathali',
      pictures: ['🚦', '🛑', '🚗'],
      lines: [
        'The traffic police looks at the light and decides: red → stop, yellow → get ready, otherwise → go.',
        'Python decides the same way: if → elif → else.',
        'Python checks from the top. The FIRST true condition runs, and the rest are skipped.',
        'Nested if = an if inside another if. Like: if you passed, then if marks > 80 → distinction.',
        'Every if / elif / else line ends with a colon :, and the next lines are pushed in by 4 spaces.',
      ],
    },
    animation: 'traffic',
    play: {
      task: 'Make a SEE grade calculator. Type marks in the Input box. Add a grade for 90+ (A+), and print "Fail" below 35.',
      starter: `marks = int(input("Enter your marks: "))

if marks >= 90:
    print("Grade: A+  🌟")
elif marks >= 80:
    print("Grade: A")
elif marks >= 60:
    print("Grade: B")
elif marks >= 35:
    print("Grade: C — you passed!")
else:
    print("Fail. Practice more, you can do it! 💪")

# Nested if
if marks >= 35:
    if marks >= 80:
        print("Distinction too!")
`,
      stdin: '84',
    },
    hints: [
      'Use >= for "greater than or equal to".',
      'Check the BIGGEST marks first, then smaller ones (top to bottom).',
      'Do not forget the colon : at the end of if, elif and else lines.',
    ],
    mistake: {
      wrong: 'if marks = 90:\n    print("Wow")',
      right: 'if marks == 90:\n    print("Wow")',
      why: '= puts a value in a box. == asks a question: "is it equal?". In if, always use ==.',
    },
    seeTip: 'Common SEE program: "Input a number and check whether it is positive, negative or zero" and "odd or even" (use n % 2 == 0). Practise both!',
    quiz: [
      { q: 'What is the output?', code: 'x = 50\nif x > 80:\n    print("A")\nelif x > 40:\n    print("B")\nelse:\n    print("C")', options: ['A', 'B', 'C', 'B C'], answer: 1, explain: '50 > 80 is False. 50 > 40 is True → prints B and stops.' },
      { q: 'Which checks if n is even?', options: ['n / 2 == 0', 'n % 2 == 0', 'n // 2 == 1', 'n == even'], answer: 1, explain: '% gives the remainder. Even numbers have remainder 0 when divided by 2.' },
      { q: 'How many blocks run in one if/elif/else chain?', options: ['All true ones', 'Exactly one (at most)', 'Always two', 'None'], answer: 1, explain: 'Python runs only the first block whose condition is True.' },
    ],
    badge: { emoji: '🚦', name: 'Traffic Police' },
  },
  {
    id: 'py-indent',
    house: 'python',
    title: 'INDENTATION — the tiffin rule',
    emoji: '🍱',
    story: {
      title: 'Tiffin inside bag inside almirah',
      pictures: ['🗄️', '🎒', '🍱'],
      lines: [
        'At home: the almirah holds your school bag, and the bag holds your tiffin box.',
        'In Python, the spaces at the start of a line show which box the line lives in.',
        'A line ending with : (colon) opens a new box. The next lines must be pushed in by 4 spaces.',
        'All lines in the same box must start at the SAME place.',
        'Wrong spaces = the tiffin falls out of the bag → IndentationError! 💥',
      ],
    },
    animation: 'indentation',
    play: {
      task: 'This code has indentation mistakes! Watch the coloured boxes below the editor. Fix the spaces until every line is safely in its box, then press Run.',
      starter: `marks = 85
if marks >= 35:
print("You passed!")
    if marks >= 80:
        print("Distinction!")
      print("Well done")
print("Result checked.")
`,
      indentBoxes: true,
    },
    hints: [
      'Look at the red line in the boxes view — that line is sticking out.',
      'After "if marks >= 35:" the next line needs 4 spaces in front.',
      '"Well done" should line up with either "if marks >= 80:" (4 spaces) or "print(\\"Distinction!\\")" (8 spaces). Choose 4 spaces.',
    ],
    mistake: {
      wrong: 'for i in range(3):\nprint(i)',
      right: 'for i in range(3):\n    print(i)',
      why: 'The line after a colon must be inside the box — push it in with 4 spaces (or press Tab).',
    },
    seeTip: 'In written exams, show indentation clearly with spacing — examiners deduct marks for code that would not run. Draw a faint line if it helps you align blocks.',
    quiz: [
      { q: 'What error do you get for wrong spaces?', options: ['SpaceError', 'IndentationError', 'TabError only', 'No error'], answer: 1, explain: 'Python raises IndentationError when lines are not in the right box.' },
      { q: 'How many spaces is the standard indent in Python?', options: ['1', '2', '4', '8'], answer: 2, explain: 'The Python style guide (PEP 8) says 4 spaces per level.' },
      { q: 'What is the output?', code: 'x = 3\nif x > 5:\n    print("big")\nprint("done")', options: ['big done', 'done', 'big', 'Nothing'], answer: 1, explain: '"done" is NOT indented, so it is outside the if-box and always runs.' },
    ],
    badge: { emoji: '🍱', name: 'Tiffin Master' },
  },
  {
    id: 'py-loops',
    house: 'python',
    title: 'Loops (for & while)',
    emoji: '🔁',
    story: {
      title: 'Chocolates and momos',
      pictures: ['🍫', '🧒', '🥟'],
      lines: [
        'Teacher has a roll list. She gives a chocolate to EVERY student on the list. That is a for loop.',
        'for name in students: → do something for each item, one by one.',
        'range(1, 6) makes the numbers 1, 2, 3, 4, 5 (stops BEFORE 6!).',
        'You eat momos WHILE the plate is not empty. That is a while loop.',
        'while condition: → repeat as long as the condition is True. Make sure it becomes False one day, or it never stops!',
      ],
    },
    animation: 'loops',
    play: {
      task: 'Run it. Then: (1) print the multiplication table of 7 using for, (2) change the while loop to start with 10 momos.',
      starter: `students = ["Ram", "Sita", "Hari", "Gita"]
for name in students:
    print(f"🍫 Chocolate for {name}")

print("--- Table of 5 ---")
for i in range(1, 11):
    print(f"5 x {i} = {5 * i}")

momos = 5
while momos > 0:
    print(f"Yum! {momos} momos left")
    momos = momos - 1
print("Plate empty 🍽️")
`,
    },
    hints: [
      'range(1, 11) gives 1 to 10. The last number is NOT included.',
      'For the table of 7: print(f"7 x {i} = {7 * i}")',
      'In a while loop, always change the variable (momos = momos - 1) or it loops forever.',
    ],
    mistake: {
      wrong: 'n = 1\nwhile n <= 5:\n    print(n)',
      right: 'n = 1\nwhile n <= 5:\n    print(n)\n    n = n + 1',
      why: 'n never changes, so n <= 5 is always True — an infinite loop! Press Stop if this happens.',
    },
    seeTip: 'SEE loves: "Print the first 10 natural numbers", "sum of 1 to 100", "factorial", and series like 1, 4, 9, 16 … Learn range(start, stop, step).',
    quiz: [
      { q: 'What numbers does range(2, 6) give?', options: ['2 3 4 5 6', '2 3 4 5', '3 4 5 6', '2 4 6'], answer: 1, explain: 'range stops BEFORE the second number.' },
      { q: 'What is the output?', code: 's = 0\nfor i in range(1, 4):\n    s = s + i\nprint(s)', options: ['3', '4', '6', '10'], answer: 2, explain: '1 + 2 + 3 = 6' },
      { q: 'Which loop is best when you do not know how many times to repeat?', options: ['for', 'while', 'if', 'def'], answer: 1, explain: 'while repeats until a condition becomes False — like eating until the plate is empty.' },
    ],
    badge: { emoji: '🔁', name: 'Loop Legend' },
  },
  {
    id: 'py-collections',
    house: 'python',
    title: 'List, Tuple & Dictionary',
    emoji: '🚃',
    story: {
      title: 'Train, citizenship card and phone contacts',
      pictures: ['🚃', '🪪', '📱'],
      lines: [
        'List [ ] = a train. Compartments can be added, removed or changed. trains = ["A", "B"]',
        'Positions start at 0! trains[0] is the first compartment.',
        'Tuple ( ) = your sealed citizenship card. Once made, nobody can change it. card = ("Sita", 2009)',
        'Dictionary { } = phone contacts. You look up a NAME to get a NUMBER. contacts["Ama"]',
      ],
    },
    animation: 'collections',
    play: {
      task: 'Add "Pokhara" to the cities list, change the 2nd fruit to "kiwi", and add a new contact "Didi".',
      starter: `cities = ["Kathmandu", "Biratnagar", "Butwal"]
cities.append("Dharan")
print("Cities:", cities)
print("First city:", cities[0])
print("How many:", len(cities))

fruits = ["apple", "mango", "banana"]
fruits[1] = "litchi"
print(fruits)

card = ("Sita Sharma", 2009, "Lalitpur")
print("Born in:", card[1])

contacts = {"Ama": "9841000001", "Dai": "9851000002"}
contacts["Sir"] = "9801000003"
print("Call Ama:", contacts["Ama"])
for name, number in contacts.items():
    print(name, "→", number)
`,
    },
    hints: [
      'Use .append("Pokhara") to add to the end of a list.',
      'The 2nd item is at position 1: fruits[1] = "kiwi"',
      'New dictionary entry: contacts["Didi"] = "98…"',
    ],
    mistake: {
      wrong: 'card = ("Sita", 2009)\ncard[1] = 2010',
      right: 'card = ["Sita", 2009]\ncard[1] = 2010',
      why: 'A tuple is sealed — you cannot change it. If you need changes, use a list.',
    },
    seeTip: 'Know the brackets: list [ ], tuple ( ), dictionary { key: value }. SEE asks "difference between list and tuple" — answer: list is mutable (changeable), tuple is immutable.',
    quiz: [
      { q: 'What is the output?', code: 'a = [10, 20, 30]\nprint(a[1])', options: ['10', '20', '30', 'Error'], answer: 1, explain: 'Positions start at 0, so a[1] is the second item: 20.' },
      { q: 'Which one CANNOT be changed after creating?', options: ['List', 'Tuple', 'Dictionary', 'All can change'], answer: 1, explain: 'Tuples are immutable — like a sealed citizenship card.' },
      { q: 'How do you get Ama\'s number from d = {"Ama": 98410}?', options: ['d[0]', 'd("Ama")', 'd["Ama"]', 'd.Ama'], answer: 2, explain: 'Use the key in square brackets: d["Ama"].' },
    ],
    badge: { emoji: '🚃', name: 'Train Driver' },
  },
  {
    id: 'py-functions',
    house: 'python',
    title: 'Functions (def, return vs print)',
    emoji: '🏭',
    story: {
      title: 'The momo machine',
      pictures: ['🏭', '🥟', '🪟'],
      lines: [
        'def builds a machine once. Then you can use it again and again — no need to repeat code.',
        'Parameters are the ingredient slots: def make_momo(filling, count):',
        'return = the machine HANDS you the momo. You can keep it in a box and use it later.',
        'print = you only SEE the momo through a window. You cannot take it home!',
        'A function must be defined (def) BEFORE you call it.',
      ],
    },
    animation: 'functions',
    play: {
      task: 'Write a function area(l, b) that RETURNS the area of a rectangle, and use it to print the area of a 5 × 3 room.',
      starter: `def make_momo(filling, count):
    return f"{count} {filling} momos 🥟"

plate = make_momo("chicken", 10)
print("I got:", plate)

def show_momo(filling):
    print(f"Look through the window: {filling} momo")

result = show_momo("veg")
print("Can I use it later?", result)   # None! print does not hand it back

# Your turn: write area(l, b) here
`,
    },
    hints: [
      'Start with: def area(l, b):',
      'Inside, push in 4 spaces and write: return l * b',
      'Then: print("Area:", area(5, 3))',
    ],
    mistake: {
      wrong: 'def add(a, b):\n    print(a + b)\n\ntotal = add(2, 3) * 2',
      right: 'def add(a, b):\n    return a + b\n\ntotal = add(2, 3) * 2',
      why: 'print only shows the answer. The function gives back None, and None * 2 is an error. Use return to hand the value back.',
    },
    seeTip: 'SEE asks you to "write a function to find …" — always use return when the answer is used later, and call the function at the end to show the output.',
    quiz: [
      { q: 'Which keyword creates a function?', options: ['function', 'def', 'fun', 'make'], answer: 1, explain: 'def is short for "define".' },
      { q: 'What does a function return if it has no return statement?', options: ['0', '""', 'None', 'Error'], answer: 2, explain: 'Without return, Python hands back None (nothing).' },
      { q: 'What is the output?', code: 'def sq(n):\n    return n * n\nprint(sq(4) + 1)', options: ['16', '17', '5', 'Error'], answer: 1, explain: 'sq(4) gives 16, plus 1 = 17.' },
    ],
    badge: { emoji: '🏭', name: 'Machine Maker' },
  },
  {
    id: 'py-arguments',
    house: 'python',
    title: 'Arguments: positional, keyword, default',
    emoji: '🪑',
    story: {
      title: 'Roll numbers, names and sugar',
      pictures: ['🪑', '📣', '☕'],
      lines: [
        'Positional: students sit by roll number. The 1st value goes to the 1st slot, the 2nd to the 2nd.',
        'Keyword: the teacher calls by NAME — marks=90, name="Sita". The order does not matter!',
        'Default: tea comes with sugar unless you say no. def tea(name, sugar=True):',
        'Rule: default parameters come AFTER normal ones in def.',
      ],
    },
    animation: 'arguments',
    play: {
      task: 'Call report() three ways: positional, keyword (in a different order), and add a default school name.',
      starter: `def report(name, marks, school="Janata School"):
    print(f"{name} got {marks} marks at {school}")

report("Ram", 80)                          # positional
report(marks=90, name="Sita")              # keyword (any order)
report("Hari", 70, "Bhanu School")         # change the default

def tea(name, sugar=True):
    if sugar:
        print(f"☕ Sweet tea for {name}")
    else:
        print(f"☕ Tea without sugar for {name}")

tea("Ama")
tea("Buwa", sugar=False)
`,
    },
    hints: [
      'Positional: values go in order of the parameters.',
      'Keyword: write parameter=value. Order does not matter.',
      'If you skip a default parameter, Python uses its default value.',
    ],
    mistake: {
      wrong: 'def tea(sugar=True, name):\n    ...',
      right: 'def tea(name, sugar=True):\n    ...',
      why: 'Parameters with defaults must come after the ones without defaults.',
    },
    seeTip: 'Know the words: parameter = the slot in def; argument = the value you pass when calling. Examiners like this difference.',
    quiz: [
      { q: 'In def f(a, b=5): what is b?', options: ['Positional parameter', 'Default parameter', 'Keyword-only', 'A return value'], answer: 1, explain: 'b has a default value 5, used when no value is given.' },
      { q: 'What is the output?', code: 'def f(a, b=2):\n    return a * b\nprint(f(3))', options: ['3', '5', '6', 'Error'], answer: 2, explain: 'b uses its default 2, so 3 × 2 = 6.' },
      { q: 'Which call uses keyword arguments?', options: ['f(1, 2)', 'f(b=2, a=1)', 'f[1, 2]', 'f(1)(2)'], answer: 1, explain: 'Keyword arguments use name=value.' },
    ],
    badge: { emoji: '🪑', name: 'Argument Ace' },
  },
  {
    id: 'py-modules',
    house: 'python',
    title: 'Modules: math & random',
    emoji: '🎲',
    story: {
      title: 'The calculator and the dice',
      pictures: ['🧮', '🎲', '🎟️'],
      lines: [
        'A module is a toolbox someone already made. We just open it with import.',
        'math = a calculator: math.sqrt(16), math.pi, math.ceil(4.2), math.floor(4.8), math.pow(2, 3).',
        'random = dice and lottery: random.randint(1, 6) rolls a dice, random.choice(list) picks a lucky name.',
        'Every time you run random code, you may get a different answer — that is the fun!',
      ],
    },
    animation: 'modules',
    play: {
      task: 'Run it a few times. Then make a "lucky draw" that picks a random winner from your 5 friends, and find the area of a circle with radius 7.',
      starter: `import math
import random

print("√49 =", math.sqrt(49))
print("π =", round(math.pi, 4))
print("ceil(4.2) =", math.ceil(4.2), " floor(4.8) =", math.floor(4.8))

dice = random.randint(1, 6)
print("🎲 You rolled:", dice)

friends = ["Aarav", "Sita", "Bikash", "Puja", "Nima"]
print("🎟️ Lucky winner:", random.choice(friends))

r = 7
area = math.pi * r ** 2
print(f"Area of circle = {area:.2f}")
`,
    },
    hints: [
      'Always import first: import math',
      'Use the module name before the tool: math.sqrt(), random.randint()',
      'Area of circle = math.pi * r ** 2',
    ],
    mistake: {
      wrong: 'import math\nprint(sqrt(25))',
      right: 'import math\nprint(math.sqrt(25))',
      why: 'sqrt lives inside the math toolbox. Write math.sqrt, or use: from math import sqrt',
    },
    seeTip: 'Remember: random.randint(a, b) INCLUDES b (unlike range). math.sqrt returns a float (5.0, not 5).',
    quiz: [
      { q: 'What does math.ceil(3.1) give?', options: ['3', '4', '3.1', '3.0'], answer: 1, explain: 'ceil rounds UP to the next whole number.' },
      { q: 'Which can random.randint(1, 3) return?', options: ['0, 1, 2', '1, 2', '1, 2, 3', '1 to 4'], answer: 2, explain: 'randint includes both ends: 1, 2 or 3.' },
      { q: 'What is the output of print(math.sqrt(36))?', options: ['6', '6.0', '18', 'Error'], answer: 1, explain: 'sqrt always gives a float, so 6.0.' },
    ],
    badge: { emoji: '🎲', name: 'Lucky Dice' },
  },
  {
    id: 'py-pandas',
    house: 'python',
    title: 'pandas: Series & DataFrame',
    emoji: '🐼',
    story: {
      title: 'The attendance register on a computer',
      pictures: ['🐼', '📒', '📊'],
      lines: [
        'pandas is a module to work with tables — like Excel inside Python. import pandas as pd',
        'A DataFrame is the whole register / Excel sheet, with rows and columns.',
        'A Series is ONE column of that register. df["marks"] is a Series.',
        'Useful tools: df.head() (first rows), df.shape (rows, columns), df["marks"].mean(), .max(), .min(), .sum()',
      ],
    },
    animation: 'pandasSeries',
    play: {
      task: 'Find the class average, the highest marks, and add a new column "result" that is marks + 5 (grace marks).',
      starter: `import pandas as pd

data = {
    "name": ["Ram", "Sita", "Hari", "Gita", "Bikash"],
    "marks": [78, 91, 35, 66, 49],
    "house": ["Red", "Blue", "Red", "Green", "Blue"],
}
df = pd.DataFrame(data)
print(df)
print()
print("Shape (rows, cols):", df.shape)

marks = df["marks"]          # a Series
print("Average:", marks.mean())
print("Highest:", marks.max())

s = pd.Series([10, 20, 30], index=["a", "b", "c"])
print(s)
`,
    },
    hints: [
      'A column is chosen with square brackets: df["marks"]',
      'Highest: df["marks"].max()',
      'New column: df["result"] = df["marks"] + 5, then print(df)',
    ],
    mistake: {
      wrong: 'import pandas\ndf = pd.DataFrame(data)',
      right: 'import pandas as pd\ndf = pd.DataFrame(data)',
      why: 'pd is only a nickname if you say "as pd" when importing.',
    },
    seeTip: 'Know the difference: Series = 1-D (one column), DataFrame = 2-D (rows and columns). pd.Series([...]) and pd.DataFrame({...}) are the two creators.',
    quiz: [
      { q: 'A Series is…', options: ['The whole table', 'One column (1-D)', 'A chart', 'A loop'], answer: 1, explain: 'A Series is one-dimensional — one column of the register.' },
      { q: 'What does df.shape give for 5 rows and 3 columns?', options: ['(3, 5)', '(5, 3)', '15', '[5, 3]'], answer: 1, explain: 'shape is (rows, columns).' },
      { q: 'Which line imports pandas the usual way?', options: ['import pd', 'import pandas as pd', 'from pd import pandas', 'pandas import'], answer: 1, explain: 'import pandas as pd lets you write pd. for short.' },
    ],
    badge: { emoji: '🐼', name: 'Panda Pal' },
  },
  {
    id: 'py-masking',
    house: 'python',
    title: 'pandas: Boolean masking (the chhalni)',
    emoji: '🥣',
    story: {
      title: 'The chhalni (sieve) in the kitchen',
      pictures: ['🥣', '🌾', '✅'],
      lines: [
        'Ama uses a chhalni to keep the good grains and let the dust fall through.',
        'df["marks"] > 40 asks EVERY row a question and gives True / False for each.',
        'df[ df["marks"] > 40 ] keeps only the True rows. That is Boolean masking!',
        'Two conditions: use & (and) or | (or), and put each condition in its own brackets.',
      ],
    },
    animation: 'pandasMask',
    play: {
      task: 'Show only students from the Blue house. Then show students who passed (≥ 35) AND are in the Red house.',
      starter: `import pandas as pd

df = pd.DataFrame({
    "name": ["Ram", "Sita", "Hari", "Gita", "Bikash"],
    "marks": [78, 91, 30, 66, 49],
    "house": ["Red", "Blue", "Red", "Green", "Blue"],
})

mask = df["marks"] > 40
print(mask)              # True / False for each row
print()
print(df[mask])          # the chhalni keeps True rows only
print()
print(df[(df["marks"] > 40) & (df["house"] == "Blue")])
`,
    },
    hints: [
      'Blue house: df[df["house"] == "Blue"]',
      'Use == for comparing, not =',
      'Two conditions: df[(cond1) & (cond2)] — brackets around each!',
    ],
    mistake: {
      wrong: 'df[df["marks"] > 40 and df["house"] == "Red"]',
      right: 'df[(df["marks"] > 40) & (df["house"] == "Red")]',
      why: 'pandas uses & and |, not the words and/or. And each condition needs its own brackets.',
    },
    seeTip: 'A typical question: "Write a statement to display records of students scoring more than 80." Answer: print(df[df["marks"] > 80])',
    quiz: [
      { q: 'What does df["marks"] > 50 give?', options: ['Only big marks', 'A Series of True/False', 'A number', 'An error'], answer: 1, explain: 'It checks every row and gives True or False for each one.' },
      { q: 'Which symbol means AND in pandas masking?', options: ['and', '&&', '&', '+'], answer: 2, explain: 'Use & (and | for or), with brackets around each condition.' },
      { q: 'Which keeps rows where house is "Red"?', options: ['df["house"] = "Red"', 'df[df["house"] == "Red"]', 'df.Red', 'df("Red")'], answer: 1, explain: 'The mask goes inside df[ ].' },
    ],
    badge: { emoji: '🥣', name: 'Chhalni Champion' },
  },
  {
    id: 'py-plotting',
    house: 'python',
    title: 'matplotlib & seaborn',
    emoji: '📈',
    story: {
      title: 'Drawing on graph paper',
      pictures: ['📈', '📊', '💄'],
      lines: [
        'matplotlib = drawing on graph paper with Python. import matplotlib.pyplot as plt',
        'plt.plot() = line graph, plt.bar() = bar chart, plt.pie() = pie chart, plt.scatter() = dots.',
        'Always label: plt.title(), plt.xlabel(), plt.ylabel(). Then plt.show().',
        'seaborn = matplotlib with makeup 💄 — nicer colours with less code. import seaborn as sns',
      ],
    },
    animation: 'plotting',
    play: {
      task: 'Run it to see a bar chart. Then change it to a line graph with plt.plot(), and add your own title.',
      starter: `import matplotlib.pyplot as plt

names = ["Ram", "Sita", "Hari", "Gita"]
marks = [78, 91, 35, 66]

plt.bar(names, marks, color="orange")
plt.title("Class 10 Computer Marks")
plt.xlabel("Students")
plt.ylabel("Marks")
plt.show()

# seaborn (matplotlib with makeup) — first run downloads it, be patient!
import seaborn as sns
sns.barplot(x=names, y=marks, hue=names, palette="pastel")
plt.title("Same chart, with makeup!")
plt.show()
`,
    },
    hints: [
      'Change plt.bar to plt.plot to get a line.',
      'plt.title("…") sets the heading.',
      'Pie chart: plt.pie(marks, labels=names)',
    ],
    mistake: {
      wrong: 'import matplotlib as plt\nplt.bar(x, y)',
      right: 'import matplotlib.pyplot as plt\nplt.bar(x, y)',
      why: 'The drawing tools are inside matplotlib.pyplot, not matplotlib alone.',
    },
    seeTip: 'Learn which function makes which chart: plot → line, bar → bar, pie → pie, scatter → scatter, hist → histogram. These are easy 1-mark questions!',
    quiz: [
      { q: 'Which function draws a bar chart?', options: ['plt.line()', 'plt.bar()', 'plt.draw()', 'plt.chart()'], answer: 1, explain: 'plt.bar(x, heights) draws bars.' },
      { q: 'Which line imports pyplot correctly?', options: ['import plt', 'import matplotlib.pyplot as plt', 'from plt import matplotlib', 'import pyplot'], answer: 1, explain: 'Standard way: import matplotlib.pyplot as plt' },
      { q: 'seaborn is built on top of…', options: ['pandas only', 'matplotlib', 'MySQL', 'random'], answer: 1, explain: 'seaborn = matplotlib with makeup. It uses matplotlib underneath.' },
    ],
    badge: { emoji: '📈', name: 'Graph Guru' },
  },
];
