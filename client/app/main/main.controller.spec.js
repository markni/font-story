'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('fontStoryApp'));
  beforeEach(module('socketMock'));

  var MainCtrl,
      scope,
      $httpBackend;

	var topFonts = [
		{
			_id: 'helvetica neue',
			count: 834
		},
		{
			_id: 'verdana',
			count: 713
		}
	];

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$httpBackend_, $controller, $rootScope) {
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('/api/records/count')
      .respond({count:100});
		$httpBackend.expectGET('/api/records/top')
			.respond(topFonts);
		$httpBackend.expectGET('/api/records/serif-vs-sans-serif')
			.respond({serif:10,'sans-serif':80});
				$httpBackend.expectGET('/api/records/awesome-vs-glyph')
			.respond({awesome:40,glyph:20});

    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));




	it('should return 100 counts of records', function () {
		$httpBackend.flush();
		expect(scope.count).toBe(100);
	});

	it('should return top 20 fonts', function () {
		$httpBackend.flush();
		expect(scope.topFonts.length).toBe(2);
	});

	it('should sorted in descending order', function () {
		$httpBackend.flush();
		expect(scope.topFonts[0].count).toBeLessThan(scope.topFonts[scope.topFonts.length-1].count);
	});

	it('should have more awesome than glyph', function () {
		$httpBackend.flush();
		expect(scope.icon.glyph).toBeLessThan(scope.icon.awesome);
	});


	it('should have more sans-serif than serif', function () {
		$httpBackend.flush();

		expect(scope.serif.serif).toBeLessThan(scope.serif['sans-serif']);
	});

	it('should get the correct percentage',function(){
		$httpBackend.flush();
		expect(scope.serif.percentage).toBeCloseTo(88);

	});


	it('should get the correct times',function(){
		$httpBackend.flush();
		expect(scope.icon.times).toBeCloseTo(2);

	});


	it('the winner should be sans-serif', function () {
		$httpBackend.flush();

		expect(scope.serif.winner.toLowerCase()).toBe('sans-serif');
	});




});
