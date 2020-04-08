window.onload = () => {
  welcome();
};

let terminalHistory = document.getElementById("term-his");
terminalHistory.innerHTML = Date() + "<br>";
let historyArr = [];
let historyIndex = 0;

function handelProgramMnemonic() {
  let ram = document.getElementById("mnemonic");
  ram.innerHTML = "<p>PROGRAM</p>";
  for (let i = 0; i < program.length; i++) {
    if (program[i] != 0) {
      let value = document.createElement("span");
      let addr = document.createElement("span");
      let line = document.createElement("p");
      addr.setAttribute("class", "hex-num");
      addr.innerHTML = `0x${format16(i)}`;
      value.innerHTML = `: ${program[i].str}`;
      // value.setAttribute("style", "font-size: 10px");
      line.appendChild(addr);
      line.appendChild(value);
      line.setAttribute("style", "font-size: 12px");
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
      line.setAttribute("style", "font-size: 12px");
      ram.appendChild(line);
    }
  }
}

function handelRam() {
  let ram = document.getElementById("ram");
  ram.innerHTML = "<p>VALUES</p>";
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
      line.setAttribute("style", "font-size: 12px");
      ram.appendChild(line);
    }
  }
}

function handelLabels() {
  let variables = document.getElementById("variables");
  variables.innerHTML = "<p>VARIABLES</p>";
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
    line.setAttribute("style", "font-size: 12px");
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
  } else if (shouldAutocomplete(comand, "help()")) {
    comandInput.value = "help()";
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

function terminalComands(command = null) {
  let terminal = document.getElementById("terminal-input");
  let nextCommand = command ? command : terminal.value;
  historyArr.push(nextCommand);
  historyIndex = historyArr.length;
  switch (nextCommand) {
    case "":
      break;
    case "compile()":
      if (compile() == null) {
        terminalHistory.innerHTML += ` <span style="color: red"> ➜ </span> <span style="color: #55BAD0 "> root </span> <span style="color: #21ba45"> ${nextCommand} </span> <br>`;
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
      terminalHistory.innerHTML += ` <span style="color: red"> ➜ </span> <span style="color: #55BAD0 "> root </span> <span style="color: #21ba45"> ${nextCommand} </span> <br>`;
      terminal.value = "";
      step();
      break;
    case "execute()":
      terminalHistory.innerHTML += ` <span style="color: red"> ➜ </span> <span style="color: #55BAD0 "> root </span> <span style="color: #21ba45"> ${nextCommand} </span> <br>`;
      terminal.value = "";
      setTimeout(() => {
        execute();
      }, 50);
      break;
    case "help()":
      terminalHistory.innerHTML += ` <span style="color: red"> ➜ </span> <span style="color: #55BAD0 "> root </span> <span style="color: #21ba45"> ${nextCommand} <br> need help? check out the full docs at: <a target="_blank" href="https://github.com/gzsig/Asm/blob/master/README.md">ASM documentation</a> </span> <br>`;
      terminal.value = "";
      break;
    default:
      terminalHistory.innerHTML += ` <span style="color: red"> ➜ </span> <span style="color: #55BAD0 "> root </span> ${nextCommand}<br>myTerm: command not found: ${nextCommand} <br>`;
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
  // e.target.parentNode.classList.toggle("on")
}
function toggleAssembly() {
  document.getElementById("assembly").classList.toggle("hide-element");
}
function toggleExamples() {
  document.querySelector("#examples").classList.toggle("fade-out");
}
function toggleSidebar() {
  document.querySelector("#setting-modal").classList.toggle("fade-out");
}

function targetTerm() {
  let termInput = document.getElementById("terminal-input");
  termInput.focus();
}


function welcome() {
  let msg =
    "Welcome to ASM. Glad your here. For a full documentation check out the ";
  typeWriter(msg, () => {
    let docLink = document.createElement("a");
    docLink.setAttribute(
      "href",
      "https://github.com/gzsig/Asm/blob/master/README.md"
    );
    docLink.setAttribute("target", "_blank");
    docLink.setAttribute(
      "style",
      "color: #00d4ff; text-decoration: none; font-weight:bold"
    );
    let com = document.getElementById("comunication");
    docLink.innerHTML = "DOCS";
    com.appendChild(docLink);
  });
}
