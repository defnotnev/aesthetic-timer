window.onerror = function(message, source, lineno, colno, error) {
  alert("Error: " + message + "\nLine: " + lineno + "\n" + source);
  return false;
};
