function Posts(){
  this.panels = [];
  $.ajax({

    url: 'posts/posts.json',
    dataType: 'json',
    error: function(jqXHR, textStatus, errorThrown){
      console.log(jqXHR)
      console.log(textStatus)
      console.log(errorThrown)
    },
    success: function(data){
      this.createPosts(data.posts);
    }.bind(this)
  });

}

Posts.prototype.createPosts = function(posts){
  G.totalPosts = posts.length;
  for(var i = 0; i < posts.length; i++){
    var post = posts[i];
    var $post = $('<div class = "post"><div class = "title"></div><div class="content"></div></div>');
    $post.find('.title').text(post.title);
    var $content = $post.find('.content');
    _.each(post.paragraphs, function(paragraph){
      var $paragraph = $('<p>')
      $paragraph.text(paragraph);
      $content.append($paragraph)
    }); 
   new Post($post, i);
  }



}



