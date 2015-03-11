describe('Kubernetes UI Dashboard', function() {
  it('should have all the expected components loaded', function() {
    browser.get('http://localhost:8000');
    expect(browser.getTitle()).toEqual('Kubernetes UI');

    // Navigate to the graph page.
    var dashboardTab = element(by.id('tab_001'));
    expect(dashboardTab).toBeDefined();
    dashboardTab.click();
    expect(browser.getLocationAbsUrl())
        .toBe('/dashboard');

    // Verify if the views dropdown list has been loaded.
    var views = element(by.model('page'));
    expect(views).toBeDefined();
  });
});
