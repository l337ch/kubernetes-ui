app.service('SidebarService', function () {
  var service = this;
  service.sidebarItems= [];

  service.clearSidebarItems = function() {
    service.sidebarItems= [];
  }

  service.addSidebarItem = function(item) {

    service.sidebarItems.push(item);

    service.sidebarItems.sort(function (a, b) { 
      return (a.order > b.order) ? 1 : ((b.order > a.order) ? -1 : 0); 
    });
  };
});