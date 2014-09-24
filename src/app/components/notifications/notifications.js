angular.module('skybrand.notifications', [
  'skybrand.server',
  'ivpusic.cookie'
])

.service('notificationsService', function notificationsService(serverService, ipCookie) {
  
  var self = this;

  this.news = 0;
  this.campaigns = 0;
  this.total = 0;

  this.resetCampaigns = function(){
    self.campaigns = 0;
    self.total = self.news;
  };

  this.resetNews = function(){
    self.news = 0;
    self.total = self.campaigns;
  };

  var newsLastVisit = Math.floor(parseInt(ipCookie('newsLastVisit'), 10) / 1000) || new Date().getTime();
  var campaignsLastVisit = Math.floor(parseInt(ipCookie('campaignsLastVisit'), 10) / 1000) || new Date().getTime();

  serverService.user.getNotifications({
    news_last_visit: newsLastVisit,
    campaigns_last_visit: campaignsLastVisit
  }).then(function(response){
    if(!response) { return; }
    self.news = response.news;
    self.campaigns = response.campaigns;
    self.total = response.total;
  });

})

;