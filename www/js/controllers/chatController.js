angular.module('starter').controller('ChatController', function($scope, $ionicFrostedDelegate, $ionicScrollDelegate, $rootScope,dateFilter, $stateParams,$timeout,$state,$ionicHistory,serviceLocator,httpService,$ionicPopup) {

    $ionicHistory.clearCache();
    // console.log($rootScope);
    // console.log($rootScope.$$listerCount['CallParentMethod']);
    // if(!$rootScope.$$listerCount['CallParentMethod']){
    var receiveMessage = $rootScope.$on("receiveMessage", function(event, data){
        $scope.receiveMessage(data);
    });
    //}
    $scope.$on('$destroy', function() {
      receiveMessage(); // remove listener.
    });

    $timeout(function(){
      $ionicScrollDelegate.$getByHandle('myScroll').scrollBottom(false);
    },1);

    $scope.messageType = null;
    // $scope.message = null;
    $scope.messages = {};
    $scope.sender = null;

    if($stateParams.sender!='' && $stateParams.senderType!=''){
      $scope.sender = $stateParams.sender;
      $scope.senderType = $stateParams.senderType;
      if($stateParams.senderType == 'customer' || $stateParams.senderType == 'admin'){
        $scope.messageType = $stateParams.senderType+'Messages'+'_'+$scope.authenticatedUser.merchantCode;
      }else{
        $scope.messageType = $stateParams.senderType+'Messages'+'_'+localStorage.getItem('deviceToken');
      }
      // $scope.messageType = $stateParams.senderType+'Messages';
    }

    if($scope.sender==null){
      $state.go('home');
    }

    if(localStorage.getItem($scope.messageType)!=null){
      $scope.messages = JSON.parse(localStorage.getItem($scope.messageType));
      // set read = true to all unread messages of the merchant
      // console.log($scope.messages[$scope.sender.senderCode]);
      if($scope.messages[$scope.sender.senderCode]!=null){
        for(var i=0;i<$scope.messages[$scope.sender.senderCode].messages.length;i++){
          $scope.messages[$scope.sender.senderCode].messages[i].read=true;
        }
        localStorage.setItem($scope.messageType,JSON.stringify($scope.messages));
      }
    }

    $scope.sendMessage = function(message) {
      console.log($scope.message);
      var userType;
      var icon = '';
      switch($stateParams.senderType){
        case 'customer':
          userType = 'merchant';
          icon = 'img/message_icon/m.png';
          break;
        case 'merchant':
          userType = 'customer';
          icon = 'img/message_icon/c.png';
          break;
      }
      var nextMessage = {
        messageType: 'sent',
        read:true,
        dateTime: dateFilter(new Date(), 'yy-MMM-d hh:mm:ss a'),
        sender: {
          name: userType,
          profilePic: icon
        },
        content: {
          type: 'text',
          content: message
        }
      };
      if(!$scope.messages.hasOwnProperty($scope.sender.senderCode)){
        $scope.messages[$scope.sender.senderCode] = {
          senderName:$scope.sender.name,
          messages:[]
        };
      }
      $scope.messages[$scope.sender.senderCode].messages.push(angular.extend({}, nextMessage));
      localStorage.setItem($scope.messageType,JSON.stringify($scope.messages));
      // console.log($scope.message);
      // $scope.message = null;
      //$scope.$apply()
      $ionicFrostedDelegate.update();
      $ionicScrollDelegate.scrollBottom(true);
      //send message to service
      var reqObj = null;
      var extended_url = null;
      // console.log(JSON.stringify($scope.authenticatedUser));
      switch($stateParams.senderType){
        case 'customer':
          extended_url = '/merchant/chatToCustomer';
          reqObj = {
            "merchantCode":$scope.authenticatedUser.merchantCode,
            "chatSessionId":$scope.sender.senderCode,
            "title":"New Message",
            "body":message
          };
          break;
        case 'merchant':
          extended_url = '/merchant/chatToMerchant';
          reqObj = {
            "merchantCode":$scope.sender.senderCode,
            "customerDeviceKey":localStorage.getItem('deviceToken'),
            "customerName":$scope.sender.customerName,
            "title":"New Message",
            "body":message
          };
          break;
      }
      sendMessage(reqObj,extended_url);
      // Update the scroll area and tell the frosted glass to redraw itself

    };

    function sendMessage(reqObj,extended_url){
      console.log(JSON.stringify(reqObj));
      console.log(extended_url);
      var payLeService = serviceLocator.serviceList.PayLeService;
      httpService.postRequest(payLeService,extended_url,reqObj,{}).then(function(response){
        console.log(JSON.stringify(response));
        if(response!=null){
            // console.log(JSON.stringify(response));
        }
      });
    }

    $scope.receiveMessage = function(data) {
      // console.log(data.sender.senderType+'Messages');
      var icon = '';
      var messageType = null;
      switch (data.sender.senderType) {
        case 'merchant' :
          icon = 'img/message_icon/m.png';
          messageType = data.sender.senderType+'Messages'+'_'+localStorage.getItem('deviceToken');
          break;
        case 'customer' :
          icon = 'img/message_icon/c.png';
          messageType = data.sender.senderType+'Messages'+'_'+JSON.parse(localStorage.getItem('loginResponse')).merchantCode;
          break;
        case 'admin' :
          icon = 'img/message_icon/a.png';
          messageType = data.sender.senderType+'Messages'+'_'+JSON.parse(localStorage.getItem('loginResponse')).merchantCode;
          break;
      }
      if(localStorage.getItem(messageType)!=null){
        $scope.messages = JSON.parse(localStorage.getItem(messageType));
      }else{
        $scope.messages = {};
      }
      var nextMessage = {
        messageType:'received',
        dateTime: data.date,
        sender: {
          name: data.sender.senderName,
          profilePic: icon
        },
        content: {
          type:'text',
          content: data.message
        }
      };
      if(!$scope.messages.hasOwnProperty(data.sender.senderCode)){
        $scope.messages[data.sender.senderCode] = {
          senderName:data.sender.senderName,
          messages:[]
        };
      }
      console.log(data.sender.senderCode );
      console.log($stateParams.sender.senderCode);
      if(data.sender.senderCode == $stateParams.sender.senderCode){
        // console.log('console apply');
        nextMessage.read = true;
        $scope.messages[data.sender.senderCode].messages.push(angular.extend({}, nextMessage));
        localStorage.setItem(messageType,JSON.stringify($scope.messages));
        $scope.$apply();
        $ionicFrostedDelegate.update();
        $ionicScrollDelegate.scrollBottom(true);
      }else{
        // console.log('console not apply');
        nextMessage.read = false;
        $scope.messages[data.sender.senderCode].messages.push(angular.extend({}, nextMessage));
        localStorage.setItem(messageType,JSON.stringify($scope.messages));
        // $scope.$apply();
      }

      // console.log(JSON.stringify($scope.messages));
      // console.log(JSON.stringify($scope.messages[data.sender.senderCode]));

      /*else{
        $ionicPopup.confirm({
          title: 'New Message From '+data.sender.senderType+' '+data.sender.senderName,
          template: 'want to open chat window ?'
        }).then(function(res) {
          if(res) {
            $state.go('chat',{senderType:data.sender.senderType,sender:data.sender});
          }
        });
      }*/

    };

    $scope.goBack = function () {
      switch($stateParams.senderType){
        case 'customer':
          $state.go('messages');
          break;
        case 'admin':
          $state.go('messages');
          break;
        case 'merchant':
          $state.go('customerHome');
          break;
      }
    };

    $scope.openGallery = function () {
      $state.go('gallery',{merchantCode:$scope.sender.senderCode,type:'customer'});
    };

});

