$('.tabular.menu .item').tab();

const channel = new BroadcastChannel('math_render_channel');
channel.onmessage = function ({ data }) { setRender(data); }

$('#rawLatex').keypress(function({ originalEvent }){
  if (originalEvent && originalEvent.ctrlKey && originalEvent.keyCode === 13) {
    const text = $('#rawLatex').val();
    console.log(text);
    channel.postMessage(text);
    setRender(text);
  }
});

function setRender(text) {
  $('#renderedLatex').text(text);
  MathJax.typeset();
}