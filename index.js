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

/*
function readTextFile(file) {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                console.log(allText);
                setRender(allText);
            }
        }
    }
    rawFile.send(null);
}
readTextFile("template.tex");
*/

// var template = new FileReader();
// template.onload = function(){ getElementById("rawLatex").innterText = reader.result; };
// template.readAsText("template.tex");

 $.ajax({url: "template.tex", success: function(text) {
    console.log(text);
     $("#rawLatex").val(text);
    }});
