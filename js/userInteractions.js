window.onload = () => {
  welcome();
};

let terminalHistory = document.getElementById("term-his");
terminalHistory.innerHTML = Date() + "<br>";
let historyArr = [];
let historyIndex = 0;

function handelProgramMnemonic() {
  let ram = document.getElementById("mnemonic");
  ram.innerHTML = "<p>MNEMONIC</p>";
  for (let i = 0; i < program.length; i++) {
    if (program[i] != 0) {
      let value = document.createElement("span");
      let addr = document.createElement("span");
      let line = document.createElement("p");
      addr.setAttribute("class", "hex-num");
      addr.innerHTML = `0x${format16(i)}`;
      value.innerHTML = `: ${program[i].str}`;
      value.setAttribute("style", "font-size: 10px");
      line.appendChild(addr);
      line.appendChild(value);
      ram.appendChild(line);
    }
  }
}

function handelProgramAssembly() {
  let ram = document.getElementById("assembly");
  ram.innerHTML = "<p>ASSEMBLY</p>";
  for (let i = 0; i < program.length; i++) {
    if (program[i] != 0) {
      let value = document.createElement("span");
      let addr = document.createElement("span");
      let line = document.createElement("p");
      addr.setAttribute("class", "hex-num");
      addr.innerHTML = `0x${format16(i)}`;
      value.innerHTML = `: ${program[i].hex}`;
      line.appendChild(addr);
      line.appendChild(value);
      ram.appendChild(line);
    }
  }
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

function isEnter(event) {
  if (event.keyCode === 13 || event.which === 13) {
    terminalComands();
  }
}

function handleOnkeydown(event) {
  if (event.keyCode === 9 || event.which === 9) {
    isTab(event);
  } else if (event.keyCode === 38 || event.which === 38) {
    getHistory(event, 1);
  } else if (event.keyCode === 40 || event.which === 40) {
    getHistory(event, 0);
  }
}

function isTab(event) {
  event.preventDefault();
  let comand = event.target.value;
  let comandInput = document.getElementById(event.target.id);
  if (shouldAutocomplete(comand, "compile()")) {
    comandInput.value = "compile()";
  } else if (shouldAutocomplete(comand, "step()")) {
    comandInput.value = "step()";
  } else if (shouldAutocomplete(comand, "execute()")) {
    comandInput.value = "execute()";
  }
}

function getHistory(event, dir) {
  let comandInput = document.getElementById(event.target.id);
  event.preventDefault();
  if (historyIndex >= 0 && dir == 1 && historyArr.length) {
    if (historyIndex > 0) {
      historyIndex--;
    }
    comandInput.value = historyArr[historyIndex];
  } else if (
    historyIndex < historyArr.length &&
    dir == 0 &&
    historyArr.length
  ) {
    if (historyIndex < historyArr.length) {
      historyIndex++;
      if (historyIndex == historyArr.length) {
        comandInput.value = "";
      } else {
        comandInput.value = historyArr[historyIndex];
      }
    }
  }
}

function shouldAutocomplete(abrv, extended) {
  let res = true;
  for (let i = 0; i < abrv.length; i++) {
    if (abrv[i] !== extended[i]) {
      res = false;
    }
  }
  return res;
}

function terminalComands() {
  let terminal = document.getElementById("terminal-input");
  historyArr.push(terminal.value);
  historyIndex = historyArr.length;
  switch (terminal.value) {
    case "":
      break;
    case "compile()":
      if (compile() == null) {
        terminalHistory.innerHTML += ` <span style="color: red"> ➜ </span> <span style="color: #55BAD0 "> root </span> <span style="color: #45fc74"> ${terminal.value} </span> <br>`;
        terminal.value = "";
        setTimeout(() => {
          compile();
        }, 50);
      } else {
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
      terminalHistory.innerHTML += ` <span style="color: red"> ➜ </span> <span style="color: #55BAD0 "> root </span> ${terminal.value}<br>myTerm: command not found: ${terminal.value} <br>`;
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
function toggleMnemonic() {
  document.getElementById("mnemonic").classList.toggle("hide-element");
}
function toggleAssembly() {
  document.getElementById("assembly").classList.toggle("hide-element");
}

function targetTerm() {
  let termInput = document.getElementById("terminal-input");
  termInput.focus();
}

function welcome() {
  let msg =
    "Welcome to ASM. Glad your here. for a full documentation check out the full doc ";
  typeWriter(msg, () => {
    let docLink = document.createElement("a");
    docLink.setAttribute(
      "href",
      "https://github.com/gzsig/Asm/blob/master/README.md"
    );
    docLink.setAttribute("target", "_blank");
    let com = document.getElementById("comunication");
    docLink.innerHTML = "here";
    com.appendChild(docLink);
  });
}
