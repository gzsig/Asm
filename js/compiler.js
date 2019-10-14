"use strict";

//editor_GetValue()

let program = [],
  memory = new Array(4096),
  labels = {};

let registers = {
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
  let s = "000" + x.toString(16).toUpperCase();
  return s.substr(s.length - 4);
}

function format8(x) {
  let s = "0" + x.toString(16).toUpperCase();
  return s.substr(s.length - 2);
}

function compile() {
  program = [];
  labels = {};
  for (let i = 0; i < memory.length; i++) memory[i] = 0;
  registers.init();

  let regTab = /\t/g;
  let lines = editor_GetValue().split("\n");

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    let comment = line.indexOf("/");
    if (comment >= 0) line = line.substr(0, comment);
    line = line.trim().toLowerCase();

    if (!line) continue;

    let tokens = line.replace(regTab, " ").split(" ");
    let opcode = tokens[0];

    for (let t = tokens.length - 1; t >= 0; t--) {
      if (!tokens[t]) tokens.splice(t, 1);
    }

    let instruction = instructions[opcode],
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

    let arg = 0,
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

  for (let i = 0; i < program.length; i++) {
    let p = program[i];
    if (p.argNumber) continue;
    if (!(p.arg in labels))
      return "label " + p.arg + " nao definido na linha " + p.line;
    p.arg = labels[p.arg];
    memory[i] = p.arg;
    p.hex = p.hex.substr(0,2) + format16(memory[i]);
    p.str = `${p.str.split(" ")[0]} ${format16(memory[i])}`;
  }

  handelRam();
  handelLabels();
  handelProgramMnemonic();
  handelProgramAssembly();

  return null;
}

function step() {
  if (registers.end) return;
  if (registers.ic >= program.length) {
    registers.end = true;
    alert("endereco invalido!");
    return;
  }
  let p = program[registers.ic];
  p.instruction.f(p.arg);
  renderRegister();
  handelRam();
}

function execute() {
    while (!registers.end){
      step();
    } 
    renderRegister();
}
