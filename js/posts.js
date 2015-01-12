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
      this.createPanel(data.post.body);
    }.bind(this)
  });

}

Posts.prototype.createPanel = function(text){
    var $post = $('<p class="panel">');
    $post.text(text);

    var scale = 8;
    var mat = new THREE.MeshBasicMaterial({
      color: 0xff00ff,
      transparent: true,
      opacity: 0.7
    })
    this.panelContainer = new THREE.Mesh(new THREE.PlaneBufferGeometry(200, 200), mat);
    this.panelContainer.position.set(0, 100, -500);
    scene.add(this.panelContainer);

    this.panel = new THREE.Object3D();
    this.panelContainer.add(this.panel);
    this.panel.html = $post[0];
    this.panel.content = new THREE.CSS3DObject(this.panel.html);
    this.panel.content.scale.set(0.2, 0.2, .2);
    this.panel.add(this.panel.content);
    this.panel.position.set(0, -50, 0);

    this.created = true;

}

Posts.prototype.update = function(){
  if(!this.created){
    return;
  }

}