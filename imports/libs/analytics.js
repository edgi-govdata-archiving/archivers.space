const analytics = [];

analytics.invoked = !0;
analytics.methods = [
  'trackSubmit',
  'trackClick',
  'trackLink',
  'trackForm',
  'pageview',
  'identify',
  'reset',
  'group',
  'track',
  'ready',
  'alias',
  'debug',
  'page',
  'once',
  'off',
  'on'];

analytics.factory = (t) => {
  return () => {
    const e = Array.prototype.slice.call(arguments);
    e.unshift(t);
    analytics.push(e);
    return analytics;
  };
};
for (let t=0; t < analytics.methods.length; t++){
  const e = analytics.methods[t];
  analytics[e] = analytics.factory(e);
}

analytics.load = (t) => {
  const e = document.createElement('script');
  e.type = 'text/javascript';
  e.async = !0;
  e.src = ("https:"===document.location.protocol ? "https://" : "http://")+"cdn.segment.com/analytics.js/v1/"+t+"/analytics.min.js";
  const n = document.getElementsByTagName('script')[0];
  n.parentNode.insertBefore(e, n);
};

analytics.SNIPPET_VERSION = '4.0.0';
analytics.load('FwUGnmKzryJpDpApVzdQy9rmwwWSiK1M');

export default analytics;
