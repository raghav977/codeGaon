import type { PyError } from './runner';

export interface Friendly { title: string; hint: string }

/** Turn a Python error into simple, kind English with a momo-factory flavour. */
export function friendlyPyError(e: PyError, code: string): Friendly {
  const at = e.line ? ` (line ${e.line})` : '';
  const src = e.line ? code.split('\n')[e.line - 1]?.trim() ?? '' : '';
  const msg = e.message;
  let m: RegExpMatchArray | null;

  switch (e.type) {
    case 'Stopped':
      return { title: '⏹️ You stopped the program.', hint: 'If it never ended, check your while loop — does the condition ever become False? (Is the momo plate ever empty?)' };
    case 'IndentationError':
    case 'TabError':
      if (/expected an indented block/.test(msg)) return { title: `🎒 The tiffin fell out of the bag${at}!`, hint: 'After a line that ends with a colon : the next line must be pushed in by 4 spaces.' };
      if (/unexpected indent/.test(msg)) return { title: `📦 This line sticks out of its box${at}.`, hint: 'It has extra spaces at the start. Remove them so it lines up with the line above.' };
      if (/unindent does not match/.test(msg)) return { title: `📏 The spaces don't match any box${at}.`, hint: 'Use exactly 4 spaces for each level. Line it up with the block it belongs to.' };
      return { title: `📏 Indentation problem${at}.`, hint: 'Use 4 spaces (or the Tab key) for each level. Do not mix tabs and spaces.' };
    case 'SyntaxError':
      if (/expected ':'/.test(msg)) return { title: `➗ Missing colon :${at}`, hint: 'Lines starting with if, elif, else, for, while and def must end with a colon :' };
      if (/unterminated string|EOL while scanning/.test(msg)) return { title: `🔤 A quote is not closed${at}.`, hint: "Text needs quotes on both sides: 'hello' or \"hello\"." };
      if ((m = msg.match(/'(.)' was never closed/))) return { title: `🔒 Bracket ${m[1]} was never closed${at}.`, hint: `Every ${m[1]} needs a partner: ( ) [ ] { }` };
      if (/unmatched/.test(msg)) return { title: `🔒 Extra closing bracket${at}.`, hint: 'There is a ) or ] without an opening partner.' };
      if (/forgot a comma/.test(msg)) return { title: `✏️ Missing comma${at}.`, hint: 'Put a comma , between items.' };
      if (/Maybe you meant '==' /.test(msg) || /cannot assign to/.test(msg)) return { title: `⚖️ = vs ==${at}`, hint: 'Use = to store a value (x = 5). Use == to compare (if x == 5:).' };
      if (/invalid syntax/.test(msg) && /^(if|elif|while|for|def|else)\b/.test(src) && !src.endsWith(':')) return { title: `➗ Missing colon :${at}`, hint: 'This line must end with a colon :' };
      return { title: `🤔 Python could not read this line${at}.`, hint: 'Check for missing colons, brackets, quotes and commas.' };
    case 'NameError': {
      const name = msg.match(/name '(\w+)'/)?.[1] ?? '';
      const lower = name.toLowerCase();
      if (['print', 'input', 'int', 'float', 'str', 'len', 'range', 'if', 'true', 'false'].includes(lower) && name !== lower) {
        return { title: `🔠 Python is case-sensitive${at}.`, hint: `Write "${name === 'True' || name === 'False' ? name : lower}" — small letters. "${name}" is a different word for Python.` };
      }
      if (name === 'true' || name === 'false') return { title: `🔠 Capital letter needed${at}.`, hint: 'In Python it is True and False (capital T and F).' };
      return { title: `❓ Python doesn't know "${name}"${at}.`, hint: `Did you spell it right? Did you create it before using it? If it's text, put it in quotes: '${name}'.` };
    }
    case 'TypeError':
      if (/can only concatenate str|unsupported operand type\(s\) for \+: '(int|float)' and 'str'|must be str, not int/.test(msg)) {
        return { title: `🧵 You can't glue text and a number with +${at}.`, hint: "Use an f-string: f'Age: {age}'  —  or convert: str(age). Remember: input() always gives text; use int(input()) for numbers." };
      }
      if (/'<|'>'|not supported between instances of 'str' and 'int'/.test(msg)) return { title: `⚖️ Comparing text with a number${at}.`, hint: 'input() gives text. Wrap it: int(input("…")) before comparing.' };
      if (/'tuple' object does not support item assignment/.test(msg)) return { title: `🪪 A tuple is a sealed citizenship card${at}.`, hint: 'You cannot change a tuple. Use a list [ ] if you need to change it.' };
      if (/'str' object does not support item assignment/.test(msg)) return { title: `🪨 Text cannot be changed letter by letter${at}.`, hint: 'Make a new string instead.' };
      if ((m = msg.match(/missing (\d+) required positional argument/))) return { title: `🥟 The momo machine needs more ingredients${at}.`, hint: `You gave too few arguments. Give a value for every parameter (or set a default).` };
      if (/takes (\d+) positional argument/.test(msg)) return { title: `🥟 Too many ingredients${at}.`, hint: 'You gave more arguments than the function has slots (parameters).' };
      if (/object is not callable/.test(msg)) return { title: `📞 That is not a function${at}.`, hint: 'You put ( ) after something that is not a function. Did you name a variable "print" or "input"?' };
      return { title: `🧩 Wrong type of value${at}.`, hint: 'You used a value in a place that wants a different type (text vs number vs list).' };
    case 'ValueError':
      if (/invalid literal for int\(\)/.test(msg)) return { title: `🔢 int() got something that is not a whole number${at}.`, hint: "int('15') works, but int('fifteen') or int('15.5') do not. Type digits only in the Input box." };
      if (/could not convert string to float/.test(msg)) return { title: `🔢 float() got something that is not a number${at}.`, hint: 'Type a number like 3.5 in the Input box.' };
      return { title: `🧪 A value is not right${at}.`, hint: msg };
    case 'ZeroDivisionError':
      return { title: `🥟 You divided by zero${at}!`, hint: "You can't share 10 momos among 0 friends — even a computer can't. Check the number after / or %." };
    case 'IndexError':
      return { title: `🚃 There is no compartment at that number${at}.`, hint: 'Counting starts at 0! A list with 3 items has positions 0, 1 and 2.' };
    case 'KeyError':
      return { title: `📱 ${msg} is not in the phone contacts (dictionary)${at}.`, hint: 'Check spelling and capital letters of the key.' };
    case 'AttributeError':
      return { title: `🔧 That thing has no such tool${at}.`, hint: msg.replace(/object/, 'value') + '. Check spelling, e.g. .append() not .add() for lists.' };
    case 'ModuleNotFoundError':
    case 'ImportError':
      return { title: `📦 Python can't find that module${at}.`, hint: 'Check the spelling. Available: math, random, pandas, matplotlib, seaborn, numpy.' };
    case 'EOFError':
      return { title: '⌨️ Your program wants more input.', hint: 'Your code calls input() more times than the lines you typed in the Input box. Add one line per input().' };
    case 'KeyboardInterrupt':
      return { title: '⏹️ Stopped.', hint: '' };
    default:
      return { title: `⚠️ ${e.type}${at}`, hint: msg };
  }
}
