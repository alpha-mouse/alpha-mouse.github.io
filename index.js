$('.tabular.menu a.item').tab();

let typesettingPromise = Promise.resolve();

const hello = "Hello";
const hi = "Hi!";
const emph = "Emphasize";
const orange = "\\color{orange}";
const black = "\\color{black}";
const textCmd = "\\text{"

const paragraphs = [];
const textChannel = new BroadcastChannel('math_render_text_channel');
const serviceChannel = new BroadcastChannel('math_render_service_channel');
transmitter = true;

textChannel.onmessage = function ({ data }) { setRender(data); }
serviceChannel.onmessage = function ({ data }) { serviceMessage(data); }

serviceChannel.postMessage(hello);

$('#rawLatex').keyup(function({ originalEvent }){
    text = $('#rawLatex').val();
    if (originalEvent.key == "F8") {
        start = $('#rawLatex').prop("selectionStart");
        finish = $('#rawLatex').prop("selectionEnd");

        if (start != finish)
            text = text.substring(0, start) + orange + text.substring(start, finish) + black + text.substring(finish);
        else
        {
            paragraphBegin = text.lastIndexOf("\n\n", start - 1);

            if (paragraphBegin < 0)
                paragraphBegin = 0;
            else
                paragraphBegin += 2;

            paragraphEnd = text.indexOf("\n\n", finish);

            if (paragraphEnd < 0)
                paragraphEnd = text.length;

            newText = text.substring(0, paragraphBegin);
            j = paragraphBegin;

            for (var i = paragraphBegin; i < paragraphEnd; )
                if (text.substr(i, 2) == "\\[") {
                    newText += "$" + orange + textCmd + text.substring(j, i) + "}$";
                    j = i;
                    i += 2;
                    newText += text.substring(j, i) + orange;
                    j = i;
                    i = text.indexOf("\\]", i) + 2;
                    newText += text.substring(j, i);
                    j = i;
                }
                else if (text.substr(i, 2) == "$$") {
                    newText += "$" + orange + textCmd + text.substring(j, i) + "}$";
                    j = i;
                    i += 2;
                    newText += text.substring(j, i) + orange;
                    j = i;
                    i = text.indexOf("$$", i) + 2;
                    newText += text.substring(j, i);
                    j = i;
                }
                else if (text.charAt(i) == "$") {
                    newText += "$" + orange + textCmd + text.substring(j, i) + "}";
                    i++;
                    j = i;
                    i = text.indexOf("$", i) + 1;
                    newText += text.substring(j, i);
                    j = i;
                }
                else
                    i++;

            newText += "$" + orange + textCmd + text.substring(j, paragraphEnd) + "}$";
            newText += text.substring(paragraphEnd);
            text = newText;
        }
    }

    textChannel.postMessage(text);
    if ($("#ownRender").prop('checked'))
        setRender(text);
});

function serviceMessage(text) {
  parts = text.split(/ /g);

  if (text == hello) {
    if (transmitter)
        serviceChannel.postMessage(hi);
    return;
  }

  if (text == hi) {
    transmitter = false;
    document.getElementById("render").click();
    return;
  }
}

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
      $('#paragraphs').append(`<div id="paragraph_${i}" style="width: 50%; white-space: pre;` + (i == 0 ? `height: 100%; ` : ``) + `" />`)
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
