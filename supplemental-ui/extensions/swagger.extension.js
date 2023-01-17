function uniqueid(){
  // always start with a letter (for DOM friendlyness)
  var idstr=String.fromCharCode(Math.floor((Math.random()*25)+65));
  do {
    // between numbers and characters (48 is 0 and 90 is Z (42-48 = 90)
    var ascicode=Math.floor((Math.random()*42)+48);
    if (ascicode<58 || ascicode>64){
      // exclude all chars between : (58) and @ (64)
      idstr+=String.fromCharCode(ascicode);
    }
  } while (idstr.length<32);

  return (idstr);
}

// usage example: swagger::{attachmentsdir}/architecture-workspace/platform-evolution/bp-groups/rrm-swagger.yml[]

module.exports = function (registry) {
  registry.blockMacro('swagger', function () {
    var self = this
    self.process(function (parent, target, args) {
      var id = uniqueid();
      var html = `
      <div id="swagger-ui_${id}"></div>
      
      <script>
        document.addEventListener('DOMContentLoaded', function() {
          SwaggerUIBundle({
            url: "${target}",
            dom_id: "#swagger-ui_${id}",
            presets: [
              SwaggerUIBundle.presets.apis,
              SwaggerUIStandalonePreset
            ]
          })
        }, false);
      </script>
      `;
      return self.createBlock(parent, 'pass', html)
    })
  })
}
