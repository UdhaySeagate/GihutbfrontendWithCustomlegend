import axios from 'axios';
import moment from 'moment';
import * as URL from './configURL';
/**
 * Description: Class used to handle the service call to third party api
 * Author: Baskar.V.P
 * Date: 15-06-2020
 */
class ApiServiceCall {
  /**
   * Method: Following Method is used to handle the service based on url
   * Author: Baskar.V.P
   * Date: 16-06-2020
   * */

  callApiServiceMethod = (urlParam, paramData) => {
    const paramCopy = { ...paramData };
    delete paramCopy.filtertype;
    // Make a request for a user with a given ID
    const url = URL[urlParam];
    return (
      axios({
        method: 'get',
        url,
        params: paramCopy
      })
        /* eslint func-names: ["error", "never"] */
        .then(function (response) {
          return response.data;
        })
        .catch(function (error) {
          // handle error
          return error;
        })
        .finally(function () {
          // always executed
        })
    );
  };

  callMutliApicall = (urlsarr, paramsarr) => {
    const issueapi = axios({
      method: 'get',
      url: URL[urlsarr[0]],
      params: paramsarr[0]
    });
    return axios
      .all([issueapi])
      .then(
        axios.spread((...responses) => {
          return responses;
        })
      )
      .catch((errors) => {
        // react on errors.
        return errors;
      });
  };

  getNoofDaysBetween = (startDateVal, endDateVal) => {
    const todayDate = moment(moment(startDateVal).format('YYYY-MM-DD'), 'YYYY-MM-DD');
    const endDate = moment(moment(endDateVal).format('YYYY-MM-DD'), 'YYYY-MM-DD');
    return endDate.diff(todayDate, 'days');
  };

  compareDatesisSameorBefore = (firstDate, secondDate) => {
    const firstDateFor = moment(firstDate).format('YYYY-MM-DD');
    const secondDateFor = moment(secondDate).format('YYYY-MM-DD');
    return moment(firstDateFor).isSameOrBefore(secondDateFor); // true or false
  };

  /**
   * DEscription: function is used to set hours to 00:00:00
   */
  changeTimeFormat = (dateVal) => {
    const m = moment(dateVal);
    m.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    m.toISOString();
    return m;
  };

  /**
   * Description: function is used to set hours to 23:59:59
   */
  changeEndTimeFormat = (dateVal) => {
    const m = moment(dateVal);
    m.set({ hour: 23, minute: 59, second: 59, millisecond: 0 });
    m.toISOString();
    return m;
  };

  changeOrgDateFormat = (date) => {
    let localTime = moment.utc(date).toDate();
    localTime = moment(localTime).format('YYYY-MM-DD');
    return localTime;
  };
}

export default ApiServiceCall;
