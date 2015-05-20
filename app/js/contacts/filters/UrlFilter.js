angular.module('starterapp').filter('urlFilter', function(){
   return function(url, external)
   {
       return '<a' + (external ? ' target="blank"' : '') + ' href="' + url + '">' + url + '</a>';
   }
});