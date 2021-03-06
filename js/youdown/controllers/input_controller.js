YouDown.InputController = Em.Controller.extend({
  status: 'ready',
  
  processing: Em.computed.equal('status', 'processing'),
  done: Em.computed.equal('status', 'done'),
  
  actions: {
    download: function() {
      if (!this.get('video')) return;
      
      var desiredFormat = this.get('selectedTarget') || this.get('video.orderedFormats.firstObject'),
          video = this.get('video');
      
      video.set('desiredFormat', desiredFormat);
      
      this.send('addToQueue', video);     
      this.reset(true);
    }
  },
  
  urlChange: function() {
    var url = this.get('videoUrl');
    if (YouDown.Video.matches(url)) return this.process(url);
    return this.reset(false);
  }.observes('videoUrl'),
  
  inputsDisabled: function() {
    return !this.get('video');
  }.property('status'),
  
  targets: function() {
    if (!this.get('video')) return Em.A([]);
    
    return this.get('video.orderedFormats');
  }.property('video'),
  
  reset: function(cleanUrl) {
    this.set('status', 'ready');
    this.set('saveName', null);
    this.set('video', null);
    if (cleanUrl) this.set('videoUrl', null);
  },
  
  process: function(url) {
    var self = this;
    this.set('status', 'processing');
    
    YouDown.Video.createVideo(url).then(function(video) {
      self.set('video', video);
      self.set('saveName', video.get('filename'));
      self.set('status', 'done');
    });
  }
});