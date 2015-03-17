describe('Kubernetes UI Graph', function() {
  it('should have all the expected components loaded', function() {
    browser.get('http://localhost:8000');
    expect(browser.getTitle()).toEqual('Kubernetes UI');

    // Navigate to the graph page.
    var graphTab = element(by.id('tab_002'));
    expect(graphTab).toBeDefined();
    graphTab.click();
    expect(browser.getLocationAbsUrl()).toBe('/graph');

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

    // Make sure the svg is drawn.
    var svg = element(by.css('svg'));
    expect(svg).toBeDefined();
  });

  it('should have all the details pane working correctly', function() {
    browser.get('http://localhost:8000');
    expect(browser.getTitle()).toEqual('Kubernetes UI');

    // Navigate to the graph page.
    var graphTab = element(by.id('tab_002'));
    expect(graphTab).toBeDefined();
    graphTab.click();
    expect(browser.getLocationAbsUrl()).toBe('/graph');

    var toggleBtn = element(by.id('toggleDetails'));
    expect(toggleBtn).toBeDefined();
    expect(element(by.repeater('type in getLegendLinkTypes()'))).toBeDefined();

    var details = element(by.id('details'));
    expect(details).toBeDefined();
    expect(details.isDisplayed()).toBe(false);
  });

  it('should have all the graph working correctly', function() {
    browser.get('http://localhost:8000');
    expect(browser.getTitle()).toEqual('Kubernetes UI');

    // Navigate to the graph page.
    var graphTab = element(by.id('tab_002'));
    expect(graphTab).toBeDefined();
    graphTab.click();
    expect(browser.getLocationAbsUrl()).toBe('/graph');

    var svg = element(by.css('d3-visualization svg'));
    expect(svg).toBeDefined();

    // Make sure the graph is drawn with necessary components.
    expect(element(by.css('d3-visualization svg marker'))).toBeDefined();
    expect(element(by.css('d3-visualization svg text'))).toBeDefined();
    expect(element(by.css('d3-visualization svg path'))).toBeDefined();
    expect(element(by.css('d3-visualization svg image'))).toBeDefined();
    expect(element(by.css('d3-visualization svg circle'))).toBeDefined();

    var toggleSource = element(by.id('ToggleSource'));
    expect(toggleSource).toBeDefined();
    var pollOnce = element(by.id('PollOnce'));
    expect(pollOnce).toBeDefined();

    // Use mock data to ease testing.
    toggleSource.click();
    // Just pull once to get a stable graph.
    pollOnce.click();
    var firstNode = element(by.id('d3Node0'));
    expect(firstNode).toBeDefined(firstNode);

    // Now click to select this node.
    firstNode.click();
    // Make sure the details pane should be showing something.
    var details = element(by.id('details'));
    expect(details).toBeDefined();
    expect(details.isDisplayed()).toBe(true);
    // Also make sure the details are populated from real data.
    expect(element(by.repeater('(tag, value) in getSelectionDetails()'))).toBeDefined();

    // Now ensure we can navigate to the node inspection page.
    var inspectBtn = element(by.id('inspectBtn'));
    expect(inspectBtn).toBeDefined();
    inspectBtn.click();
    // Check if we arrive at the inspection page.
    expect(browser.getLocationAbsUrl()).toBe('/graph/inspect');

    // Ensure the inspection page has the details populated.
    expect(element(by.repeater('(key, val) in json track by $index'))).toBeDefined();

    // Ensure the inspection page has a back button and it works.
    var backBtn = element(by.id('backButton'));
    expect(backBtn).toBeDefined();
    backBtn.click();
    expect(browser.getLocationAbsUrl()).toBe('/graph');
  });

});
