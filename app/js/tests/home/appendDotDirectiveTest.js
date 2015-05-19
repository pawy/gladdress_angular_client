describe('directive: appendDot', function() {
	var element, scope;

	beforeEach(module('starterapp'));

	beforeEach(inject(function($rootScope, $compile) {
		scope = $rootScope.$new();

		element = '<span append-dot>{{item}}</span>';

		scope.item = 'Continue';

		element = $compile(element)(scope);
		scope.$digest();
	}));

	describe('on each click', function() {
		it('a dot should be appended to the text', function() {
			expect(element.text()).toBe('Continue');
			element.trigger('click');
			expect(element.text()).toBe('Continue.');
			element.trigger('click');
			expect(element.text()).toBe('Continue..');
		});
	});
});
