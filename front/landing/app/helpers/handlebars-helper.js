import Handlebars from 'hbsfy/runtime'
import moment from 'moment'

export default class ViewHelper{
  initialize(){
    Handlebars.registerHelper('dateFormat', function (dateString, format) {
      return moment(dateString).format(format)
    });

    Handlebars.registerHelper('dateFormatToLocal', function (dateString, format) {
      var localTime  = moment.utc(dateString).toDate();
      return moment(localTime).format(format);
    });

    Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
      switch (operator) {
        case '==':
          return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
          return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '<':
          return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
          return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
          return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
          return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
          return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
          return (v1 || v2) ? options.fn(this) : options.inverse(this);
        case 'in':
          if (v2.indexOf(v1) !== -1){
            return options.fn(this)
          } else {
            return options.inverse(this)
          }

        default:
          return options.inverse(this);
      }
    });

  }
}
