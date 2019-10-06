function typeWriter(txt) {
  let i = 0;
  let speed = 15; /* The speed/duration of the effect in milliseconds */
  let printing = document.getElementById("comunication");
  printing.innerHTML = ''
  let typingId = setInterval(() => {
    if (i < txt.length) {
      printing.innerHTML += txt.charAt(i);
      i++;
    } else {clearInterval(typingId)}
  }, speed);
}