'use strict';

angular.module('fontStoryApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    $scope.awesomeThings = [];
		$scope.topFonts = [];
		$scope.count = 1000;
		$scope.serif = {};



    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
      socket.syncUpdates('thing', $scope.awesomeThings);
    });

		$http.get('/api/records/count').success(function(res){
			$scope.count = res.count || 1000;

		});

		$http.get('/api/records/top').success(function(res){
			$scope.topFonts = res.reverse();

		});

		$http.get('/api/records/serif-vs-sans-serif').success(function(res){
			var serifCount =    res.serif;
			var sansSerifCount = res['sans-serif'];
			$scope.serif.serif = serifCount;
			$scope.serif['sans-serif'] =  sansSerifCount;
			if(serifCount > sansSerifCount){
				$scope.serif.winner = 'Serif';
				$scope.serif.percentage = parseInt(serifCount/ (serifCount+sansSerifCount+1) *100);
				$scope.serif.style = 'traditional';
			}
			else{
				$scope.serif.winner = 'Sans-Serif';
				$scope.serif.percentage = parseInt(sansSerifCount/ (serifCount+sansSerifCount+1) * 100);
				$scope.serif.style = 'modern';
			}


		});

    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });


		$scope.numberWithCommas = function(x) {
			return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		};

		$scope.find = function(){
			var target = $scope.searchTerm.toLowerCase();
			$http.get('/api/records/fallbacks/'+target).success(function(res){
				$scope.findFonts = res;
			});
		};

		$scope.findSelected = function(fontName){
			$scope.searchTerm = fontName.toLowerCase();
			var target = fontName.toLowerCase();
			$http.get('/api/records/fallbacks/'+target).success(function(res){
				$scope.findFonts = res;
			});
		};


		$scope.applyFont = function(fontname){
			fontname = '"'+fontname+'"';
			return {fontFamily:fontname};
		};
  });