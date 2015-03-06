describe('Kubernetes UI Graph', function() {
  it('should have all the expected components loaded', function() {
    browser.get('http://localhost:8000');
    expect(browser.getTitle()).toEqual('Kubernetes UI');

    // Navigate to the graph page.
    var graphTab = element(by.id('tab_002'));
    expect(graphTab).toBeDefined();
    graphTab.click();
    expect(browser.getLocationAbsUrl())
        .toBe('/graph');

    // Verify if the control action icons have been loaded.
    var expandCollapse = element(by.id('ExpandCollapse'));
    expect(expandCollapse).toBeDefined();
    var toggleSelect = element(by.id('ToggleSelect'));
    expect(toggleSelect).toBeDefined();
    var toggleSource = element(by.id('ToggleSource'));
    expect(toggleSource).toBeDefined();
    var pollOnce = element(by.id('PollOnce'));
    expect(pollOnce).toBeDefined();

    // Use mock data to ease testing.
    toggleSource.click();
    // Just pull once to get a stable graph.
    pollOnce.click();
  });
});
