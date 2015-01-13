function Posts() {
  this.createTextMapping();
  this.panels = [];
  $.ajax({

    url: 'posts/posts.json',
    dataType: 'json',
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR)
      console.log(textStatus)
      console.log(errorThrown)
    },
    success: function(data) {
      this.createPosts(data.posts);
    }.bind(this)
  });



}

Posts.prototype.createPosts = function(posts) {
  G.totalPosts = posts.length;
  var string;
  var post;
  var wordsPerLine = 10;
  var words;
  var radius = 2000;
  var position = new THREE.Vector3();

  for (var i = 0; i < posts.length; i++) {
    //we need to create one big string from this guy, with new lines and such
    post = posts[i];
    string = "";
    post.title = post.title.toUpperCase()
    words = post.title.split(' ');
    for(var j = 0; j < words.length; j++){
      string += words[j] + " ";
      if(j!== 0 && j % wordsPerLine === 0){
        string+="\n";
      }
    }
    string += '\n\n\n';
    _.each(post.paragraphs, function(paragraph) {
      words = paragraph.split(' ');
      for (var j = 0; j < words.length; j++) {
        string += words[j] + " ";
        if (j !== 0 && j % wordsPerLine === 0) {
          string += '\n';
        }
      }
      string += '\n\n';
    });

    //Set up posts in semicircle around user
    var segment = (-Math.PI * 1.1) + i/posts.length * (Math.PI * 1.1);
    position.x = radius * Math.cos(segment);
    position.z = radius * Math.sin(segment);
    new Post(string, position);
  }

}

Posts.prototype.createTextMapping = function() {
  G.fontSize = 64;
  G.lettersPerSide = 16;
  var c = document.createElement('canvas');
  c.width = c.height = G.fontSize * G.lettersPerSide;
  var ctx = c.getContext('2d');
  ctx.font = G.fontSize + 'px Monospace';

  var i = 0;

  for (var y = 0; y < G.lettersPerSide; y++) {
    for (var x = 0; x < G.lettersPerSide; x += 1, i++) {
      var ch = String.fromCharCode(i);
      ctx.fillText(ch, x * G.fontSize, -(8 / 32) * G.fontSize + (y + 1) * G.fontSize);
    }
  }

  G.textMap = new THREE.Texture(c);
  G.textMap.flipY = false;
  G.textMap.needsUpdate = true;
  G.textMap.anisotropy = renderer.getMaxAnisotropy()

}