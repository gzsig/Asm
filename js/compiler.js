"use strict";

//editor_GetValue()

var program = [],
  memory = new Array(4096),
  labels = {};

var registers = {
  ac: 0,
  ic: 0,
  ra: 0,
  ir: 0,
  op: "",
  oi: 0,
  end: false,
  stack: [],
  init: function() {
    registers.ic = 0;
    registers.ra = 0;
    registers.ir = 0;
    registers.op = "";
    registers.oi = 0;
    registers.ac = 0;
    registers.end = false;
    registers.stack = [];
    renderRegister();
  }
};

function format16(x) {
  var s = "000" + x.toString(16).toUpperCase();
  return s.substr(s.length - 4);
}

function format8(x) {
  var s = "0" + x.toString(16).toUpperCase();
  return s.substr(s.length - 2);
}

function compile() {
  program = [];
  labels = {};
  for (var i = 0; i < memory.length; i++) memory[i] = 0;
  registers.init();

  var regTab = /\t/g;
  var lines = editor_GetValue().split("\n");

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];

    var comment = line.indexOf(";");
    if (comment >= 0) line = line.substr(0, comment);
    line = line.trim().toLowerCase();

    if (!line) continue;

    var tokens = line.replace(regTab, " ").split(" ");
    var opcode = tokens[0];

    for (var t = tokens.length - 1; t >= 0; t--) {
      if (!tokens[t]) tokens.splice(t, 1);
    }

    var instruction = instructions[opcode],
      isLabel = false;
    if (!instruction) {
      if (opcode.endsWith(":")) {
        opcode = opcode.substr(0, opcode.length - 1);
        if (opcode in labels)
          return "label " + opcode + " duplicado na linha " + (i + 1);
        labels[opcode] = program.length;
        instruction = instructions["nop"];
        isLabel = true;
      } else {
        return "opcode desconhecido na linha " + (i + 1) + ": " + opcode;
      }
    }

    if (
      (isLabel && tokens.length > 2) ||
      (!isLabel && tokens.length - 1 !== instruction.argCount)
    ) {
      return (
        "opcode " +
        opcode +
        " na linha " +
        (i + 1) +
        " esperava " +
        instruction.argCount +
        " mas recebeu " +
        (tokens.length - 1)
      );
    }

    var arg = 0,
      argNumber = true;
    if (tokens.length > 1) {
      if (tokens[1].substr(0, 2) == "0x") {
        arg = parseInt(tokens[1], 16);
      } else {
        arg = tokens[1];
      }
      if (isNaN(arg)) {
        arg = tokens[1];
        argNumber = false;
      } else if (arg < 0 || arg > 0xffff) {
        return "valor inválido na linha " + (i + 1) + ": " + tokens[1];
      }
    }

    if (isLabel && !argNumber)
      return (
        "label inicializado com valor nao contante na linha " +
        (i + 1) +
        ": " +
        tokens[1]
      );

    memory[program.length] = argNumber ? arg : 0;

    program.push({
      address: program.length,
      str:
        tokens[0].toUpperCase() +
        (tokens.length > 1 ? " " + format16(arg) : ""),
      hex: instruction.hex + format16(arg),
      line: i + 1,
      instruction: instruction,
      arg: arg,
      argNumber: argNumber,
      isLabel: isLabel
    });
  }

  for (var i = 0; i < program.length; i++) {
    var p = program[i];
    if (p.argNumber) continue;
    if (!(p.arg in labels))
      return "label " + p.arg + " nao definido na linha " + p.line;
    p.arg = labels[p.arg];
    memory[i] = p.arg;
  }

  handelRam();
  handelLabels();

  return null;
}

function step() {
  if (registers.end) return;
  if (registers.ic >= program.length) {
    registers.end = true;
    alert("endereco invalido!");
    return;
  }
  var p = program[registers.ic];
  p.instruction.f(p.arg);
  renderRegister();
  handelRam();
}

function execute() {
  while (!registers.end) step();
  renderRegister();
}

function handelRam() {
  let ram = document.getElementById("ram");
  ram.innerHTML = "<p>RAM</p>";
  for (let i = 0; i < memory.length; i++) {
    if (memory[i] != 0) {
      let value = document.createElement("span");
      let addr = document.createElement("span");
      let line = document.createElement("p");
      addr.setAttribute("class", "hex-num");
      addr.innerHTML = `0x${format16(i)}`;
      value.innerHTML = `: ${format16(memory[i])}`;
      line.appendChild(addr);
      line.appendChild(value);
      ram.appendChild(line);
    }
  }
}

function handelLabels() {
  let variables = document.getElementById("variables");
  variables.innerHTML = "<p>Variables</p>";
  for (let label in labels) {
    let name = document.createElement("span");
    let addr = document.createElement("span");
    let varToken = document.createElement("span");
    let line = document.createElement("p");
    varToken.setAttribute("style", "color: #f00");
    name.setAttribute("class", "var");
    addr.setAttribute("class", "hex-num");

    name.innerHTML = `${label}`;
    varToken.innerHTML = ": ";
    addr.innerHTML = `0x${format16(labels[label])}`;
    line.appendChild(name);
    line.appendChild(varToken);
    line.appendChild(addr);
    variables.appendChild(line);
  }
}

function renderRegister() {
  document.getElementById("ic").innerHTML = format8(registers.ic);
  document.getElementById("ra").innerHTML = format8(registers.ra);
  // document.getElementById("ir").innerHTML = registers.ir;
  document.getElementById("op").innerHTML = registers.op.toUpperCase();
  document.getElementById("oi").innerHTML = format16(registers.oi);
  document.getElementById("ac").innerHTML = format16(registers.ac);
  // registers.end = false;
  // registers.stack = [];
}

let terminalHistory = document.getElementById("term-his");
terminalHistory.innerHTML = Date() + "<br>";
function terminalComands() {
  let terminal = document.getElementById("terminal-input");
  switch (terminal.value) {
    case "":
      break
    case "compile()":
      if(compile() == null){
        terminalHistory.innerHTML += ` <span style="color: red"> ➜ </span> <span style="color: #55BAD0 "> root </span> <span style="color: #45fc74"> ${terminal.value} </span> <br>`;
        terminal.value = "";
        setTimeout(() => {
          compile();
        }, 50);
      } 
      else {
        terminalHistory.innerHTML += ` <span style="color: red"> ➜ </span> <span style="color: #55BAD0 "> root </span> <span style="color: #f00"> ${compile()} </span> <br>`;
        terminal.value = "";
      }
      break;
    case "step()":
      terminalHistory.innerHTML += ` <span style="color: red"> ➜ </span> <span style="color: #55BAD0 "> root </span> <span style="color: #45fc74"> ${terminal.value} </span> <br>`;
      terminal.value = "";
      step();
      break;
    case "execute()":
      terminalHistory.innerHTML += ` <span style="color: red"> ➜ </span> <span style="color: #55BAD0 "> root </span> <span style="color: #45fc74"> ${terminal.value} </span> <br>`;
      terminal.value = "";
      setTimeout(() => {
        execute();
      }, 50);
      break;
    default:
      terminalHistory.innerHTML += ` <span style="color: red"> ➜ </span> <span style="color: #55BAD0 "> root </span> ${terminal.value}<br>myTerm: command not found: ${terminal.value} `;
      terminal.value = "";
      break;
  }
}

function toggleEditor() {
  document.getElementById("codeEditor").classList.toggle("hide-element");
}
function toggleRam() {
  document.getElementById("ram").classList.toggle("hide-element");
}
function toggleVariables() {
  document.getElementById("variables").classList.toggle("hide-element");
}
function toggleTerminal() {
  document.getElementById("terminal-wrapper").classList.toggle("hide-element");
}
