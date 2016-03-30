'use strict';

class NavbarController {
  //start-non-standard
  menu = [{
    'title': 'HOME',
    'link': '/'
}];

  projectsDropdown = [{
    'title': 'PROJECTS',
    'link': '#'
}];

  automationDropdown = [{
    'title': 'AUTOMATION',
    'link': '#'
}];

  projects = [{
    'title': 'BattleShip',
    'link': '/projects/BattleShip'
 }, {
    'title': 'JaxComedy',
    'link': '/projects/JaxComedy'
 }, {
    'title': 'OOP Game',
    'link': '/projects/OOPGame'
 }, {
    'title': 'Senior Project',
    'link': '/projects/SeniorProject'
 }, {
    'title': 'The Force Media Group',
    'link': '/projects/ForceMediaGroup'
 }, {
    'title': 'Watch Yo Wrist',
    'link': '/projects/WatchYoWrist'
}];

  automation = [{
      'title': 'Overview',
      'link': '/automation/Overview'
  }, {
      'title': 'Alarm',
      'link': '/automation/Alarm'
  }, {
      'title': 'Lights',
      'link': '/automation/Lights'
  }, {
      'title': 'Weather',
      'link': '/automation/Weather'
 }];


  isCollapsed = true;
  //end-non-standard

  constructor($location, Auth) {
    this.$location = $location;
    this.isLoggedIn = Auth.isLoggedIn;
    this.isAdmin = Auth.isAdmin;
    this.currentUser = Auth.getCurrentUser;
} // end constructor

  isActive(route) {
    return route === this.$location.path();
} // end isActive

  isProject() {
      for(var i = 0; i < this.projects.length; i++) {
          if(this.isActive(this.projects[i].link)) {
              return true;
          }
      }
      return false;
  } // end isProject

  isAutomation() {
      for(var i = 0; i < this.automation.length; i++) {
          if(this.isActive(this.automation[i].link)) {
              return true;
          }
      }
      return false;
  } // end isAutomation
} // end class NavbarController

angular.module('fullstackApp')
  .controller('NavbarController', NavbarController);
