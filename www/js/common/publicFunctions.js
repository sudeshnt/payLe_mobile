angular.module('starter')
.factory('comFunc',[function(){
  return{
    sliceArray:function(arr,slice){
      var sliced_arr = [];
      for(var i=0;i<arr.length;i++){
        if(sliced_arr[Math.floor((i)/slice)]==undefined){
          sliced_arr[Math.floor((i)/slice)] = [];
          sliced_arr[Math.floor((i)/slice)].data = [];
        }
        sliced_arr[Math.floor((i)/slice)].data.push(arr[i]);
      }
      return sliced_arr;
    }
  }
}]);
