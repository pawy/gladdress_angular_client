angular.module('starterapp').filter('gMapsFilter', function(){
   return function(address)
   {
       return address.replace(/\n|-| /g,'+');
   }
});