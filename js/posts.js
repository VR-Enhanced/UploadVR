function Posts(){
  $.ajax({

    url: 'posts/posts.json',
    dataType: 'json',
    error: function(jqXHR, textStatus, errorThrown){
      console.log(jqXHR)
      console.log(textStatus)
      console.log(errorThrown)
    },
    success: function(data){
      this.createPanel(data.post, new THREE.Vector3(0, 100, -500));
      this.createPanel(data.post, new THREE.Vector3(300, 100, -500));
    }.bind(this)
  });

}

Posts.prototype.createPanel = function(post, position){
    var $post = $('<div class = "post"><div class = "title"></div><div class="content"></div></div>');
    $post.find('.title').text(post.title);
    var $content = $post.find('.content');
    _.each(post.paragraphs, function(paragraph){
      var $paragraph = $('<p>')
      $paragraph.text(paragraph);
      $content.append($paragraph)
    });


    var scale = 8;
    var mat = new THREE.MeshBasicMaterial({
      color: 0xff00ff,
      transparent: true,
      opacity: 0.7
    })
    this.panelContainer = new THREE.Mesh(new THREE.PlaneBufferGeometry(200, 200), mat);
    this.panelContainer.position.copy(position)
    scene.add(this.panelContainer);

    this.panel = new THREE.Object3D();
    this.panelContainer.add(this.panel);
    this.panel.html = $post[0];
    this.panel.content = new THREE.CSS3DObject(this.panel.html);
    this.panel.content.scale.set(0.2, 0.2, .2);
    this.panel.add(this.panel.content);

    this.created = true;

}

Posts.prototype.update = function(){
  if(!this.created){
    return;
  }

}