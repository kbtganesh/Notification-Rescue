import Realm from 'realm';

let repository = new Realm({
  schema: [{
    name: 'Notification',
    properties: {
      appName: 'string',
      packageName: 'string',
      title: 'string',
      subText: 'string',
      text: 'string',
      bigText: 'string',
      summeryText: 'string',
      createdAt: 'date',
    }
  }]
});

let NotificationService = {
  getAll: function (sortBy) {
    // if (!sortBy) sortBy = [['completed', false], ['updatedAt', true]];
    // return repository.objects('Notification').sorted(sortBy);
    return repository.objects('Notification').sorted('createdAt', true);
  },

  save: function (notification) {
    // if (repository.objects('Notification').filtered("title = '" + todo.title + "'").length) return;
    notification = appendEmptyString(notification);
    repository.write(() => {
      repository.create('Notification', notification);
    })
  },

  // deleteAll: function () {
  //   repository.write(() => {
  //     repository.delete(this.getAll());
  //   })
  // },

  registerListener: function (listenerFunction) {
    repository.addListener('change', listenerFunction);
  }
};

function appendEmptyString(notification) {
  Object.keys(notification).forEach(item => {
    if(!notification[item] && item !== 'createdAt')
    notification[item] = '';
  });
  return notification;
}

module.exports = NotificationService;