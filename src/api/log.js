import { ajax } from '../request';

const { get, post, put } = ajax;

const getAppOptions = () => {
  return get({
    url: '/customs/monitor/log/apps'
  });
};
