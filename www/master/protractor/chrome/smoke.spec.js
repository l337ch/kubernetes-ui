describe('Kubernetes UI chrome', function() {
  it('should have the right title', function() {
    browser.get('http://localhost:8000');
    expect(browser.getTitle()).toEqual('Kubernetes UI');
  });
});
