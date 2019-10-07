var instructionCount = 0;
var instructions = {
  nop: {
    hex: format8(instructionCount++),
    argCount: 0,
    f: function() {
      registers.ra = registers.ic;
      registers.ic++;
      registers.ir = "00000";
      registers.op = "nop";
      registers.oi = "0000";
    }
  },
  jmp: {
    hex: format8(instructionCount++),
    argCount: 1,
    f: function(arg) {
      var dest = arg & 0xfff;
      var fmt = format16(dest);
      registers.ra = registers.ic;
      registers.ic = dest;
      registers.ir = `1${fmt}`;
      registers.op = "jmp";
      registers.oi = fmt;
    }
  },
  jz: {
    hex:format8(instructionCount++),
    argCount: 1,
    f: function(arg) {
      var dest = arg & 0xfff;
      var fmt = format16(dest);
      registers.ra = registers.ic;
      if (!registers.ac) registers.ic = dest;
      else registers.ic++;
      registers.ir = `2${fmt}`;
      registers.op = "jz";
      registers.oi = fmt;
    }
  },
  jnz: {
    hex:format8(instructionCount++),
    argCount: 1,
    f: function(arg) {
      var dest = arg & 0xfff;
      var fmt = format16(dest);
      registers.ra = registers.ic;
      if (registers.ac) registers.ic = dest;
      else registers.ic++;
      registers.ir = `3${fmt}`;
      registers.op = "jnz";
      registers.oi = fmt;
    }
  },
  lv: {
    hex:format8(instructionCount++),
    argCount: 1,
    f: function(arg) {
      var fmt = format16(arg);
      registers.ac = arg;
      registers.ra = registers.ic;
      registers.ic++;
      registers.ir = `4${fmt}`;
      registers.op = "lv";
      registers.oi = fmt;
    }
  },
  add: {
    hex:format8(instructionCount++),
    argCount: 1,
    f: function(arg) {
      var fmt = format16(arg);
      registers.ac = (registers.ac + arg) & 0xffff;
      registers.ra = registers.ic;
      registers.ic++;
      registers.ir = `5${fmt}`;
      registers.op = "add";
      registers.oi = fmt;
    }
  },
  addm: {
    hex:format8(instructionCount++),
    argCount: 1,
    f: function(arg) {
      var src = arg & 0xfff;
      var fmt = format16(arg);
      registers.ac = (registers.ac + memory[src]) & 0xffff;
      registers.ra = registers.ic;
      registers.ic++;
      registers.ir = `5${fmt}`;
      registers.op = "addm";
      registers.oi = fmt;
    }
  },
  sub: {
    hex:format8(instructionCount++),
    argCount: 1,
    f: function(arg) {
      var fmt = format16(arg);
      registers.ac = (registers.ac - arg) & 0xffff;
      registers.ra = registers.ic;
      registers.ic++;
      registers.ir = `6${fmt}`;
      registers.op = "sub";
      registers.oi = fmt;
    }
  },
  subm: {
    hex:format8(instructionCount++),
    argCount: 1,
    f: function(arg) {
      var src = arg & 0xfff;
      var fmt = format16(arg);
      registers.ac = (registers.ac - memory[src]) & 0xffff;
      registers.ra = registers.ic;
      registers.ic++;
      registers.ir = `6${fmt}`;
      registers.op = "subm";
      registers.oi = fmt;
    }
  },
  mul: {
    hex:format8(instructionCount++),
    argCount: 1,
    f: function(arg) {
      var fmt = format16(arg);
      registers.ac = (registers.ac * arg) & 0xffff;
      registers.ra = registers.ic;
      registers.ic++;
      registers.ir = `7${fmt}`;
      registers.op = "mul";
      registers.oi = fmt;
    }
  },
  mulm: {
    hex:format8(instructionCount++),
    argCount: 1,
    f: function(arg) {
      var src = arg & 0xfff;
      var fmt = format16(arg);
      registers.ac = (registers.ac * memory[src]) & 0xffff;
      registers.ra = registers.ic;
      registers.ic++;
      registers.ir = `7${fmt}`;
      registers.op = "mulm";
      registers.oi = fmt;
    }
  },
  div: {
    hex:format8(instructionCount++),
    argCount: 1,
    f: function(arg) {
      var fmt = format16(arg);
      registers.ac = (registers.ac / arg) & 0xffff;
      registers.ra = registers.ic;
      registers.ic++;
      registers.ir = `8${fmt}`;
      registers.op = "div";
      registers.oi = fmt;
    }
  },
  divm: {
    hex:format8(instructionCount++),
    argCount: 1,
    f: function(arg) {
      var src = arg & 0xfff;
      var fmt = format16(arg);
      registers.ac = (registers.ac / memory[src]) & 0xffff;
      registers.ra = registers.ic;
      registers.ic++;
      registers.ir = `8${fmt}`;
      registers.op = "divm";
      registers.oi = fmt;
    }
  },
  load: {
    hex:format8(instructionCount++),
    argCount: 1,
    f: function(arg) {
      var src = arg & 0xfff;
      var fmt = format16(arg);
      registers.ac = memory[src];
      registers.ra = registers.ic;
      registers.ic++;
      registers.ir = `9${fmt}`;
      registers.op = "load";
      registers.oi = fmt;
    }
  },
  stor: {
    hex:format8(instructionCount++),
    argCount: 1,
    f: function(arg) {
      var dest = arg & 0xfff;
      if (dest < program.length && !program[dest].isLabel) {
        let terminalHistory = document.getElementById("term-his");
        terminalHistory.innerHTML += ` <span style="color: red"> ➜ </span> <span style="color: #55BAD0 "> root </span> <span style="color: #f00"> Não é permitido sobrescrever a instrução no endereço ${arg.toString(16)} </span> <br>`;
        terminal.value = "";
      }
      var fmt = format16(dest);
      memory[dest] = registers.ac;
      registers.ra = registers.ic;
      registers.ic++;
      registers.ir = `A${fmt}`;
      registers.op = "stor";
      registers.oi = fmt;
    }
  },
  sc: {
    hex:format8(instructionCount++),
    argCount: 1,
    f: function(arg) {
      if (registers.stack.length >= 16) {


        let terminalHistory = document.getElementById("term-his");
        terminalHistory.innerHTML += ` <span style="color: red"> ➜ </span> <span style="color: #55BAD0 "> root </span> <span style="color: #f00"> Stack overflow </span> <br>`;
        terminal.value = "";


        // throw "Stack overflow";
      }
      var dest = arg & 0xfff;
      var fmt = format16(dest);
      registers.ra = registers.ic;
      registers.ic = dest;
      registers.ir = `B${fmt}`;
      registers.op = "sc";
      registers.oi = fmt;
      registers.stack.push(registers.ra + 1);
    }
  },
  rc: {
    hex:format8(instructionCount++),
    argCount: 0,
    f: function() {
      if (!registers.stack.length) {
        
        
        let terminalHistory = document.getElementById("term-his");
        terminalHistory.innerHTML += ` <span style="color: red"> ➜ </span> <span style="color: #55BAD0 "> root </span> <span style="color: #f00"> Stack underflow </span> <br>`;
        terminal.value = "";
        
        
        // throw "Stack underflow";
      }
      registers.ra = registers.ic;
      registers.ic = registers.stack.pop();
      registers.ir = "C0000";
      registers.op = "rc";
      registers.oi = "0000";
    }
  },
  end: {
    hex:format8(instructionCount++),
    argCount: 0,
    f: function() {
      registers.end = true;
      registers.op = "end";
      registers.oi = "0000";
      registers.ir = "D0000";
      registers.ra = registers.ic;
    }
  },
  in: {
    hex:format8(instructionCount++),
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
      registers.op = `in`;
      registers.oi = "0000";
      registers.ir = `E0000`;
      registers.ra = registers.ic;
      registers.ic++;
    }
  },
  out: {
    hex:format8(instructionCount++),
    argCount: 0,
    f: function() {
      alert(format16(registers.ac));
      registers.ra = registers.ic;
      registers.ic++;
      registers.op = `out`;
      registers.ir = "F0000";
    }
  }
};
