'use strict';

angular.module('fontStoryApp')
  .controller('MainCtrl', function ($scope, $http) {
		var todayTopFonts = [];
		var allTimesTopFonts = [];


		$scope.topFonts = [];

		$scope.count = 1000;
		$scope.serif = {};
		$scope.icon = {};
		$scope.daterange = 'All Times';


		$http.get('/api/records/count').success(function(res){
			$scope.count = res.count || 1000;

		});

		function getTopFonts(range){
			$http.get('/api/records/top'+range).success(function(res){
				var resorted = res.reverse();
				$scope.topFonts = resorted;

				if(range){
					todayTopFonts = resorted;
				}
				else{
					allTimesTopFonts = resorted;
				}

				//import google fonts by name if there is any

				var tops = res;

				var css = '';


				var capitalize = function(str){
					return    str.charAt(0).toUpperCase() + str.slice(1);
				};

				for(var i=0;i<tops.length;i++){

					var name = tops[i]._id.split(' ').map(capitalize).join('+');

					var googleImport = '@import url(http://fonts.googleapis.com/css?family='+name+');\n';
					css +=  googleImport;

				}

				var style = document.createElement('style');
				style.type = 'text/css';
				style.innerHTML = css;
				document.head.appendChild(style);

			});
		}

		getTopFonts('');



		$http.get('/api/records/serif-vs-sans-serif').success(function(res){
			var serifCount =    res.serif;
			var sansSerifCount = res['sans-serif'];
			$scope.serif.serif = serifCount;
			$scope.serif['sans-serif'] =  sansSerifCount;
			if(serifCount > sansSerifCount){
				$scope.serif.winner = 'Serif';
				$scope.serif.percentage = Math.round(serifCount/ (serifCount+sansSerifCount+1) *100);
				$scope.serif.style = 'traditional';
			}
			else{
				$scope.serif.winner = 'Sans-Serif';
				$scope.serif.percentage = Math.round(sansSerifCount/ (serifCount+sansSerifCount+1) * 100);
				$scope.serif.style = 'modern';
			}


		});


		$http.get('/api/records/awesome-vs-glyph').success(function(res){
			var awesomeCount =    res.awesome;
			var glyphCount = res.glyph;
			var awesomeDisplay = new Array(Math.round(awesomeCount/ (awesomeCount+glyphCount+1) *100));
			var glyphDisplay =  new Array(Math.round(glyphCount/ (awesomeCount+glyphCount+1) * 100));
			$scope.icon.awesomeIcons =  awesomeDisplay;
			$scope.icon.glyphIcons = glyphDisplay;

			$scope.icon.awesome = awesomeCount;
			$scope.icon.glyph =  glyphCount;
			if(awesomeCount > glyphCount){
				$scope.icon.winner = 'Font Awesome';
				$scope.icon.times = (awesomeCount/ (glyphCount+0.001)).toFixed(2);
				$scope.icon.loser = 'Glyphicon';
				$scope.icon.reason = 'it offers 2 times more icons';
				$scope.icon.highlighted = 'a';

			}
			else{
				$scope.icon.winner = 'Glyphicon';
				$scope.icon.times = (glyphCount/ (awesomeCount+0.001)).toFixed(2);
				$scope.icon.loser = 'Font Awesome';
				$scope.icon.reason = 'it is the default icon set for bootstrap';
				$scope.icon.highlighted = 'g';
			}


		});

		$scope.isHighLighted = function(flag){
			return ($scope.icon.highlighted === flag);
		};



		$scope.numberWithCommas = function(x) {
			return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		};

		$scope.find = function(){
			var target = $scope.searchTerm.toLowerCase();
			$http.get('/api/records/fallbacks/'+target).success(function(res){
				$scope.findFonts = res;

				if(res.length){
					$scope.showNoResErr = false;
				}
				else{
					$scope.showNoResErr = true;
				}
			});
		};

		$scope.findSelected = function(fontName){
			$scope.searchTerm = fontName.toLowerCase();
			var target = fontName.toLowerCase();
			$http.get('/api/records/fallbacks/'+target).success(function(res){
				$scope.findFonts = res;
				if(res.length){
					$scope.showNoResErr = false;
				}
				else{
					$scope.showNoResErr = true;
				}
			});
		};

		$scope.toggleDateRange = function(){
			if($scope.daterange === 'All Times'){
				$scope.daterange = 'Today';
				if (todayTopFonts.length){
					$scope.topFonts = todayTopFonts;
				}
				else{
					getTopFonts('/today');
				}
			}
			else{
				$scope.daterange = 'All Times';
				$scope.topFonts = allTimesTopFonts;
			}
		} ;


		$scope.applyFont = function(fontname){
			fontname = '"'+fontname+'"';
			return {fontFamily:fontname};
		};



  });