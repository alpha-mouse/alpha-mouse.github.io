$('.tabular.menu .item').tab();

const channel = new BroadcastChannel('math_render_channel');
channel.onmessage = function ({ data }) { setRender(data); }

$('#rawLatex').keyup(function({ originalEvent }){
//$('#rawLatex').keypress(function({ originalEvent }){
//  if (originalEvent && originalEvent.ctrlKey && (originalEvent.keyCode === 13 || originalEvent.keyCode === 10)) {
    const text = $('#rawLatex').val();
    console.log(text);
    channel.postMessage(text);
    setRender(text);
//  }
});

function setRender(text) {
  $('#renderedLatex').text(text);
  MathJax.typeset();
}