import Realm from 'realm';
import moment from 'moment';

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
  getForDate: function(date) {
    let today = date;
    let nextDay = moment(today).add(1, 'days').toDate();
    let dataList = repository.objects('Notification').filtered("createdAt >= $0 && createdAt < $1", today, nextDay);
    console.log('DDDDDDDDDDDDDD dataList: ', dataList);
    return dataList;
  },
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