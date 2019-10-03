var instructionCount = 0;
var instructions = {
  nop: {
    hex: format8(instructionCount++),
    argCount: 0,
    f: function() {
      registers.ra = registers.ic;
      registers.ic++;
      registers.ir = "00000";
      registers.op = "0";
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
      registers.op = "1";
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
      registers.op = "2";
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
      registers.op = "3";
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
      registers.op = "4";
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
      registers.op = "5";
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
      registers.op = "5";
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
      registers.op = "6";
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
      registers.op = "6";
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
      registers.op = "7";
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
      registers.op = "7";
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
      registers.op = "8";
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
      registers.op = "8";
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
      registers.op = "9";
      registers.oi = fmt;
    }
  },
  stor: {
    hex:format8(instructionCount++),
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
      registers.ir = `A${fmt}`;
      registers.op = "A";
      registers.oi = fmt;
    }
  },
  sc: {
    hex:format8(instructionCount++),
    argCount: 1,
    f: function(arg) {
      if (registers.stack.length >= 16) {
        throw "Stack overflow";
      }
      var dest = arg & 0xfff;
      var fmt = format16(dest);
      registers.ra = registers.ic;
      registers.ic = dest;
      registers.ir = `B${fmt}`;
      registers.op = "B";
      registers.oi = fmt;
      registers.stack.push(registers.ra + 1);
    }
  },
  rc: {
    hex:format8(instructionCount++),
    argCount: 0,
    f: function() {
      if (!registers.stack.length) {
        throw "Stack underflow";
      }
      registers.ra = registers.ic;
      registers.ic = registers.stack.pop();
      registers.ir = "C0000";
      registers.op = "C";
      registers.oi = "0000";
    }
  },
  end: {
    hex:format8(instructionCount++),
    argCount: 0,
    f: function() {
      registers.end = true;
      registers.op = "D";
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
      registers.op = `E`;
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
      registers.op = `F`;
      registers.ir = "F0000";
    }
  }
};
