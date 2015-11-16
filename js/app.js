// Tasks may have: description, isUrgent, isDone, dueDate
// The app should re-render automatically (by use of the Backbone events)
// Add sorting to the TodoList collection, using:
// - All "urgent" Tasks should be at the top, sorted by due date and description
// - All "done" Tasks should be at the bottom, sorted by due date and description
// - All Tasks that are neither "done" or "urgent" should be in the middle
// ## Hard Mode
// Add user authentication with Facebook or a Login form.
// Your Router should show a login/registration page if a user is not logged in,
// otherwise it should show the HomeView.
// When a user logs in, they have access to a private list of Task items that no-one else can view.

////////////////////////////////////////////////////////////////////////////////
//////////////////////////      Models      ///////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

var Add = Backbone.Model.extend({
  urlRoot: 'http://tiny-starburst.herokuapp.com/collections/shawntodo'
});

var Task = Backbone.Model.extend({
  urlRoot: 'http://tiny-starburst.herokuapp.com/collections/shawntodo'
});

////////////////////////////////////////////////////////////////////////////////
//////////////////////////      Collections      //////////////////////////////
//////////////////////////////////////////////////////////////////////////////

var TodoList = Backbone.Collection.extend({
  url: 'http://tiny-starburst.herokuapp.com/collections/shawntodo',
  model: Task
});

////////////////////////////////////////////////////////////////////////////////
//////////////////////////      Views      ////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

var AddView = Backbone.View.extend({
  tagName: 'article',
  template: _.template($('#addTemplate').html()),
  events: {
    'keypress #add': 'handleAdd'
  },
  send: function(){
    var description = $('#add').val();
    var add = new Add({
      "description":description
    });
    add.save();
    this.collection.add(add);
    $('#task').val('');
  },
  handleAdd: function(hit){
    var code = hit.keyCode;
    if (code == 13) {
      // event.preventDefault();
      this.send();
    }
  },
  render: function(){
    this.$el.html(this.template({
      todolist: this.collection.toJSON()
    }));
    return this;
  }
});

var ListView = Backbone.View.extend({
  initialize: function(){
    this.listenTo(this.collection, 'fetch sync', this.render);
    var tasks = new TodoList();
    var listMaker = new AddView({
        collection: tasks
    });
    tasks.fetch({
      success: function(){
        $('#listTemplate').append(ListView.el);
      }
    });
  },

  render: function(){
    var view = this;
    this.collection.forEach(function(model){
      var task = new AddView({
        model: model
      });
      task.render();
      view.$el.append(task.el);
    });
    return this;
  }
});

var TaskView = Backbone.View.extend({
  template: _.template($('#listTemplate').html()),
  render: function(){
    this.$el.html(this.template(this.model.toJSON()));
  }
});

////////////////////////////////////////////////////////////////////////////////
//////////////////////////      Instantiations      ///////////////////////////
//////////////////////////////////////////////////////////////////////////////

function buildMain(){
  var collection = new TodoList();
  var mainView = new AddView({
    collection: collection
  });
  var listView = new ListView();

  collection.fetch({
    success: function(){
      mainView.render();
      $('main').html(mainView.el);
    }
  });
}


buildMain();
