function checkSyntax(str) {
  const brackets = {
    '<' : '>',
    '[' : ']',
    '{' : '}',
    '(' : ')',
    arr : ['<', '>','[', ']', '{', '}', '(', ')']
  };
  const filteredString = str.split('').filter(elem => {
    if(brackets.arr.indexOf(elem) === -1) {
      return false;
    }
    return true;
  })
  const arrOfBrackets = [];
  let bool = true;
  filteredString.forEach(elem => {
    if(typeof brackets[elem] !== 'undefined') {
      arrOfBrackets.push(brackets[elem]);
    }else if(elem === arrOfBrackets[arrOfBrackets.length - 1]){
      arrOfBrackets.pop();
    }else {
      bool = false;
    }
  });
  return arrOfBrackets.length === 0 && bool === true ? 0 : 1;
}


console.log(checkSyntax("---(++++)----") === 0);
console.log(checkSyntax("") === 0);
console.log(checkSyntax("before ( middle []) after ") === 0);
console.log(checkSyntax(") (") === 1);
console.log(checkSyntax("} {") === 1);
console.log(checkSyntax("<(   >)") === 1);
console.log(checkSyntax("(  [  <>  ()  ]  <>  )") === 0);
console.log(checkSyntax("   (      [)") === 1);
console.log(checkSyntax("({<>})((()))") === 0);
