function Posts() {
  G.textFactory = new THREE.GLTextFactory();
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


  //add scroll events to scroll blogs
  function onMouseWheel(event) {
    if(G.hoveredPost){
      G.hoveredPost.scrollText(event);
    }
    preventDefault(event);
  }

  function preventDefault(e) {
    e = e || window.event;
    if (e.preventDefault)
      e.preventDefault();
    e.returnValue = false;
  }

  window.addEventListener('wheel', onMouseWheel, false)



}

Posts.prototype.createPosts = function(posts) {
  G.totalPosts = posts.length;
  var string;
  var post;
  var maxCharsPerLine = 30;
  var curCharCount = 0;
  var radius = 7000;
  var position = new THREE.Vector3();


  for (var i = 0; i < posts.length; i++) {
    //we need to create one big string from this guy, with new lines and such
    post = posts[i];
    string = "";
    post.title = post.title.toUpperCase()
    words = post.title.split(' ');
    for (var j = 0; j < words.length; j++) {
      string += words[j] + " ";
      curCharCount += words[j].length;
      if (curCharCount >= maxCharsPerLine) {
        string += "\n";
        curCharCount = 0;
      }
    }
    curCharCount = 0;
    string += '\n\n\n';
    _.each(post.paragraphs, function(paragraph) {
      words = paragraph.split(' ');
      for (var j = 0; j < words.length; j++) {
        string += words[j] + " ";
        curCharCount += words[j].length;
        if (j !== 0 &&  curCharCount > maxCharsPerLine) {
          string += '\n';
          curCharCount = 0;
        }
      }
      string += '\n\n';
    });

    //Set up posts in semicircle around user
    var segment = (-Math.PI- .11) + i / posts.length * (Math.PI * 1.1);
    position.x = radius * Math.cos(segment);
    position.z = radius * Math.sin(segment);
    new Post(string, position, post.imageURL, post.videoURL);
  }

}