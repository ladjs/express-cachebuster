(function(){
  var scripts = document.getElementsByTagName('script')
    , self = scripts[scripts.length - 1]
    , message = self.getAttribute('data-message');

  document.body.innerHTML += message;
}());