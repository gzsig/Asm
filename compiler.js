"use strict";

//editor_GetValue()

var program = [],
  memory = new Array(4096),
  labels = {};

var registers = {
  ac: 0,
  ic: 0,
  ra: 0,
  mar: 0,
  mdr: 0,
  ir: 0,
  op: 0,
  oi: 0,
  end: false,
  stack: [],
  init: function() {
    registers.ic = 0;
    registers.ra = 0;
    registers.mar = 0;
    registers.mdr = 0;
    registers.ir = 0;
    registers.op = 0;
    registers.oi = 0;
    registers.ac = 0;
    registers.end = false;
    registers.stack = [];
  }
};

var instructions = {
  nop: {
    hex: "0",
    argCount: 0,
    f: function() {
      registers.ra = registers.ic;
      registers.ic++;
      registers.mdr = "0000";
      registers.ir = "00000";
      registers.op = "0";
      registers.oi = "0000";
    }
  },
  jmp: {
    hex: "1",
    argCount: 1,
    f: function(arg) {
      var dest = arg & 0xfff;
      var fmt = format16(dest);
      registers.ra = registers.ic;
      registers.ic = dest;
      registers.mdr = fmt;
      registers.ir = `1${fmt}`;
      registers.op = "1";
      registers.oi = fmt;
    }
  },
  jz: {
    hex: "2",
    argCount: 1,
    f: function(arg) {
      var dest = arg & 0xfff;
      var fmt = format16(dest);
      registers.ra = registers.ic;
      if (!registers.ac) registers.ic = dest;
      else registers.ic++;
      registers.mdr = fmt;
      registers.ir = `2${fmt}`;
      registers.op = "2";
      registers.oi = fmt;
    }
  },
  jnz: {
    hex: "3",
    argCount: 1,
    f: function(arg) {
      var dest = arg & 0xfff;
      var fmt = format16(dest);
      registers.ra = registers.ic;
      if (registers.ac) registers.ic = dest;
      else registers.ic++;
      registers.mdr = fmt;
      registers.ir = `3${fmt}`;
      registers.op = "3";
      registers.oi = fmt;
    }
  },
  lv: {
    hex: "4",
    argCount: 1,
    f: function(arg) {
      var fmt = format16(arg);
      registers.ac = arg;
      registers.ra = registers.ic;
      registers.ic++;
      registers.mdr = fmt;
      registers.ir = `4${fmt}`;
      registers.op = "4";
      registers.oi = fmt;
    }
  },
  add: {
    hex: "5",
    argCount: 1,
    f: function(arg) {
      var fmt = format16(arg);
      registers.ac = (registers.ac + arg) & 0xffff;
      registers.ra = registers.ic;
      registers.ic++;
      registers.mdr = fmt;
      registers.ir = `5${fmt}`;
      registers.op = "5";
      registers.oi = fmt;
    }
  },
  sub: {
    hex: "6",
    argCount: 1,
    f: function(arg) {
      var fmt = format16(arg);
      registers.ac = (registers.ac - arg) & 0xffff;
      registers.ra = registers.ic;
      registers.ic++;
      registers.mdr = fmt;
      registers.ir = `6${fmt}`;
      registers.op = "6";
      registers.oi = fmt;
    }
  },
  mul: {
    hex: "7",
    argCount: 1,
    f: function(arg) {
      var fmt = format16(arg);
      registers.ac = (registers.ac * arg) & 0xffff;
      registers.ra = registers.ic;
      registers.ic++;
      registers.mdr = fmt;
      registers.ir = `7${fmt}`;
      registers.op = "7";
      registers.oi = fmt;
    }
  },
  div: {
    hex: "8",
    argCount: 1,
    f: function(arg) {
      var fmt = format16(arg);
      registers.ac = (registers.ac / arg) & 0xffff;
      registers.ra = registers.ic;
      registers.ic++;
      registers.mdr = fmt;
      registers.ir = `8${fmt}`;
      registers.op = "8";
      registers.oi = fmt;
    }
  },
  load: {
    hex: "9",
    argCount: 1,
    f: function(arg) {
      var src = arg & 0xfff;
      var fmt = format16(arg);
      registers.ac = memory[src];
      registers.ra = registers.ic;
      registers.ic++;
      registers.mdr = fmt;
      registers.ir = `9${fmt}`;
      registers.op = "9";
      registers.oi = fmt;
    }
  },
  stor: {
    hex: "A",
    argCount: 1,
    f: function(arg) {
      var dest = arg & 0xfff;
      if (dest < program.length && !program[dest].isLabel) {
        throw "Não é permitido sobrescrever a instrução no endereço " +
          arg.toString(16);
      }
      var fmt = format16(dest);
      memory[dest] = registers.ac;
      registers.ra = registers.ic;
      registers.ic++;
      registers.mdr = fmt;
      registers.mar = fmt;
      registers.ir = `A${fmt}`;
      registers.op = "A";
      registers.oi = fmt;
    }
  },
  sc: {
    hex: "B",
    argCount: 1,
    f: function(arg) {
      if (registers.stack.length >= 16) {
        throw "Stack overflow";
      }
      var dest = arg & 0xfff;
      var fmt = format16(dest);
      registers.ra = registers.ic;
      registers.ic = dest;
      registers.mdr = fmt;
      registers.ir = `B${fmt}`;
      registers.op = "B";
      registers.oi = fmt;
      registers.stack.push(registers.ra + 1);
    }
  },
  rc: {
    hex: "C",
    argCount: 0,
    f: function() {
      if (!registers.stack.length) {
        throw "Stack underflow";
      }
      registers.ra = registers.ic;
      registers.ic = registers.stack.pop();
      registers.mdr = "0000";
      registers.ir = "C0000";
      registers.op = "C";
      registers.oi = "0000";
    }
  },
  end: {
    hex: "D",
    argCount: 0,
    f: function() {
      registers.end = true;
      registers.op = "D";
      registers.oi = "0000";
      registers.ir = "D0000";
      registers.ra = registers.ic;
      registers.mdr = "0000";
    }
  },
  in: {
    hex: "E",
    argCount: 0,
    f: function() {
      let inAlertInput = parseInt(
        window.prompt("Entre com um valor (hexadecimal)"),
        16
      );
      if (isNaN(inAlertInput)) {
        alert("erro");
        return;
      }
      registers.ac = inAlertInput;
      registers.op = `E`;
      registers.oi = "0000";
      registers.ir = `E0000`;
      registers.ra = registers.ic;
      registers.ic++;
      registers.mdr = `0000`;
    }
  },
  out: {
    hex: "F",
    argCount: 0,
    f: function() {
      alert(format16(registers.ac));
      registers.ra = registers.ic;
      registers.ic++;
      registers.op = `F`;
      registers.mdr = "0000";
      registers.ir = "F0000";
    }
  }
};

function format16(x) {
  var s = "000" + x.toString(16).toUpperCase();
  return s.substr(s.length - 4);
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

    if (tokens.length - 1 !== instruction.argCount)
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

    var arg = 0,
      argNumber = true;
    if (tokens.length > 1) {
      arg = parseInt(tokens[1], 16);
      if (isNaN(arg)) {
        arg = tokens[1];
        argNumber = false;
      } else if (arg < 0 || arg > 0xffff) {
        return "valor inválido na linha " + (i + 1) + ": " + tokens[1];
      }
    }
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
}

function execute() {
  while (!registers.end) step();
}
