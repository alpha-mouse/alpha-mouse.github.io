$('.tabular.menu a.item').tab();

let typesettingPromise = Promise.resolve();

const paragraphs = [];
const channel = new BroadcastChannel('math_render_channel');
channel.onmessage = function ({ data }) { setRender(data); }

$('#rawLatex').keyup(function({ originalEvent }){
    const text = $('#rawLatex').val();
    channel.postMessage(text);
    if ($("#ownRender").prop('checked'))
        setRender(text);
});

function setRender(text) {
  var paragraphTexts = text.split(/\r?\n\r?\n/g)
  // kill off excess paragraphs
  for (let i = paragraphs.length - 1; paragraphTexts.length <= i ; --i) {
    $(`#paragraph_${i}`).remove()
    paragraphs.pop()
  }
  // update and add
  for (let i = 0; i < paragraphTexts.length; ++i) {
    if (paragraphs.length <= i)
      $('#paragraphs').append(`<div id="paragraph_${i}" style="width: 50%; white-space: pre;` + (i == 0 ? "height: 100em; " : "" ) + `" />`)
    const newText = paragraphTexts[i].trim();
    const needsTypesetting = paragraphs[i] !== newText
    paragraphs[i] = newText
    if (needsTypesetting)
      typeset(i, newText)
  }

}

function typeset(i, text) {
    typesettingPromise = typesettingPromise
        .then(() => {
            if (paragraphs[i] === text) {
                //console.log('typesetting', i, text)
                var paragraph = $(`#paragraph_${i}`)
                paragraph.text(text)
                paragraph[0].scrollIntoView()
                return MathJax.typesetPromise(paragraph)
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
