function validateParImpar() {
  let pass = true;
  let number;
  compile();
  program[Object.keys(program)[0]].str = "lv 0x0001";
  program[Object.keys(program)[0]].hex = "040001";
  program[Object.keys(program)[0]].arg = 1;
  number = parseInt(program[Object.keys(program)[0]].str.split(" ")[1]);
  execute();
  console.log(number);
  console.log(registers.ac);

  if (registers.ac != 1) {
    pass = false;
    console.log("par e ac nao zer0");
    termAnswer(pass);
    return;
  }

  console.log(pass);

  compile();
  program[Object.keys(program)[0]].str = "lv 0x0002";
  program[Object.keys(program)[0]].hex = "040002";
  program[Object.keys(program)[0]].arg = 2;
  number = parseInt(program[Object.keys(program)[0]].str.split(" ")[1]);
  execute();
  console.log(number);
  console.log(registers.ac);

  if (registers.ac !== 0) {
    pass = false;
    console.log("par e ac nao zer0 2");
    termAnswer(pass);
    return;
  }
  console.log(pass);
  termAnswer(pass);
}

function termAnswer(pass) {
  setTimeout(() => {
    let term = document.getElementById("term-his");
    if (pass) {
      term.innerHTML += `<p style='color: #45fc74 '>CORRECT<p>`;
    } else {
      term.innerHTML += `<p style='color: #ff0000 '>FAIL<p>`;
    }
  }, 1000);
}
