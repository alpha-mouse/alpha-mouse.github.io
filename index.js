$('.tabular.menu a.item').tab();

let latestText = '';
let typesettingPromise = Promise.resolve();

const channel = new BroadcastChannel('math_render_channel');
channel.onmessage = function ({ data }) { setRender(data); }

$('#rawLatex').keyup(function({ originalEvent }){
//$('#rawLatex').keypress(function({ originalEvent }){
//  if (originalEvent && originalEvent.ctrlKey && (originalEvent.keyCode === 13 || originalEvent.keyCode === 10)) {
    const text = $('#rawLatex').val();
    //console.log(text);
    channel.postMessage(text);
    if ($("#ownRender").prop('checked'))
        setRender(text);
//  }
});

function setRender(text) {
  latestText = text;
  typeset(text);
}

function typeset(text) {
    typesettingPromise = typesettingPromise
        .then(() => {
            if (latestText === text) {
                $('#renderedLatex').text(text);
                return MathJax.typesetPromise()
            }
            else
                return Promise.resolve()
        })
        .catch((err) => console.log('Typeset failed: ' + err.message));
}

 $.ajax({url: "template.tex", success: function(text) {
     $("#rawLatex").val(text);
     setRender(text);
    }});
