import Realm from 'realm';
import moment from 'moment';

let repository = new Realm({
  schema: [{
    name: 'Notification',
    properties: {
      appName: 'string',
      key: 'string',
      packageName: 'string',
      title: 'string',
      subText: 'string',
      text: 'string',
      bigText: 'string',
      summeryText: 'string',
      createdAt: 'date',
      ticker: 'string',
      textLines: 'string?[]',
      extra: 'string'
    }
  }]
});

let NotificationService = {
  getForDate: function(date) {
    let today = date;
    let nextDay = moment(today).add(1, 'days').toDate();
    let dataList = repository.objects('Notification').filtered("createdAt >= $0 && createdAt < $1", today, nextDay);
    return dataList;
  },
  filterByAppAndDate: function(packageName, date) {
    let dataList = repository.objects('Notification').filtered("packageName = $0", packageName);
    if(date){
      let today = date;
      let nextDay = moment(today).add(1, 'days').toDate();
      dataList = dataList.filtered("createdAt >= $0 && createdAt < $1", today, nextDay);
    }
    dataList = dataList.sorted('createdAt', true);
    return dataList;
  },

  getAll: function (sortBy) {
    // if (!sortBy) sortBy = [['completed', false], ['updatedAt', true]];
    // return repository.objects('Notification').sorted(sortBy);
    return repository.objects('Notification').sorted('createdAt', true);
  },

  save: function (notification) {
    console.log('save notification: ', notification);
    let textualMatch = repository.objects('Notification').filtered("text = $0 && createdAt = $1", notification.text, notification.createdAt).length;
    if (textualMatch){
     console.log('Returning notification ', notification);
     return; 
    }
    if(!(notification.text || notification.title || notification.bigText || notification.summeryText || notification.textLines.length > 0)) {
      console.log('Returning notification coz of empty', notification);
      return; 
    }
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
  },
  removeListener: function (listenerFunction) {
    repository.removeListener('change', listenerFunction);
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