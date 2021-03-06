CodeMirror.defineMode("asm86", function ()
{
	let keywords1 = /^(lv|load|stor|add|sub|div|mul|addm|subm|mulm|divm|nop)\b/i;
	let keywords2 = /^(end|sc|rc|jmp|jnz|jz|in|out)\b/i;
	let keywords3 = /^(e?[abcd]x|[abcd][lh]|e?(si|di|bp|sp)|eip)\b/i;
	let keywords4 = /^(d?word|byte|ptr)\b/i;
	let numbers = /^(0x[0-9a-f]+)\b/i;
	return {
		startState: function () {
			return { context: 0 };
		},
		token: function (stream, state) {
			//if (!stream.column())
			//	state.context = 0;
			if (stream.eatSpace())
				return null;
			let w;
			if (stream.eatWhile(/\w/)) {
				w = stream.current();
				if (keywords1.test(w)) {
					//state.context = 1;
					return "keyword";
				} else if (keywords2.test(w)) {
					//state.context = 2;
					return "keyword-2";
				} else if (keywords3.test(w)) {
					//state.context = 3;
					return "keyword-3";
				} else if (keywords4.test(w)) {
					return "operator";
				} else if (numbers.test(w)) {
					return "number";
				} else {
					return null;
				}
			} else if (stream.eat("/")) {
				stream.skipToEnd();
				return "comment";
			} else if (stream.eat(",") || stream.eat(".") || stream.eat(":") || stream.eat("[") || stream.eat("]") || stream.eat("+") || stream.eat("-") || stream.eat("*")) {
				return "operator";
			} else {
				stream.next();
			}
			return null;
		}
	};
});
CodeMirror.defineMIME("text/plain", "txt");
