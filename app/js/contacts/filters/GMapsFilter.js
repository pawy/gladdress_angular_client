angular.module('starterapp').filter('gMapsFilter', function(){
   return function(address)
   {
       var x = address.replace(/\n|-| /g,'+');
       console.log(x);
       return x;
   }
});