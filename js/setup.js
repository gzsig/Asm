"use strict";
var editor, codeEditor, codeEditorClean, currentLineMarker;
function editor_GetValue() {
	return editor.getValue("\n");
}
function editor_SetValue(x) {
	editor.setValue(x);
}
function editor_IsClean() {
	return editor.isClean();
}
function editor_MarkClean() {
	return editor.markClean();
}
function makeMarker() {
	var marker = document.createElement("div");
	marker.textContent = "●";
	marker.className = "breakpoint";
	return marker;
}
function makeCurrentLineMarker() {
	var marker = document.createElement("div");
	marker.textContent = "→";
	marker.className = "currentLineMarker";
	return marker;
}
function editor_GutterClick(cm, n) {
	var info = cm.lineInfo(n);
	cm.setGutterMarker(n, "breakpoints", (info.gutterMarkers && info.gutterMarkers["breakpoints"]) ? null : makeMarker());
}
function codeEditor_Change() {
	codeEditorClean = false;
	return true;
}

currentLineMarker = makeCurrentLineMarker();
codeEditor = document.getElementById("codeEditor");
editor = CodeMirror.fromTextArea(codeEditor, {
	lineNumbers: true,
	lineWrapping: false,
	//lineNumberFormatter: function (line) { },
	styleActiveLine: true,
	gutters: ["CodeMirror-linenumbers", "breakpoints", "currentLine"],
	undoDepth: 128,
	showCursorWhenSelecting: true,
	dragDrop: false,
	indentWithTabs: true,
	tabSize: 4,
	smartIndent: false,
	indentUnit: 4
});
codeEditor.removeAttribute("id");
codeEditor.value = "";
codeEditor.parentNode.removeChild(codeEditor);
codeEditor = editor.getWrapperElement();
codeEditor.id = "codeEditor";
// editor.on("gutterClick", editor_GutterClick);
editor_MarkClean();
