/**
 * Created by mattjohansen on 11/7/13.
 */
module.exports = {
  type: 'RCE',
  inspectors: [
    {
      name:'PHP RCE CVE-2012-1823 URL Encoded',
      id:1,
      regex: /\/cgi\-bin\/php\?%2D%64\+%61%6C%6C%6F%77%5F%75%72%6C%5F%69%6E%63%6C%75%64%65%3D%6F%6E\+%2D%64\+%73%61%66%65%5F%6D%6F%64%65%3D%6F%66%66\+%2D%64\+%73%75%68%6F%73%69%6E%2E%73%69%6D%75%6C%61%74%69%6F%6E%3D%6F%6E\+%2D%64\+%64%69%73%61%62%6C%65%5F%66%75%6E%63%74%69%6F%6E%73%3D%22%22\+%2D%64\+%6F%70%65%6E%5F%62%61%73%65%64%69%72%3D%6E%6F%6E%65\+%2D%64\+%61%75%74%6F%5F%70%72%65%70%65%6E%64%5F%66%69%6C%65%3D%70%68%70%3A%2F%2F%69%6E%70%75%74\+%2D%64\+%63%67%69%2E%66%6F%72%63%65%5F%72%65%64%69%72%65%63%74%3D%30\+%2D%64\+%63%67%69%2E%72%65%64%69%72%65%63%74%5F%73%74%61%74%75%73%5F%65%6E%76%3D%30\+%2D%6E/i,
      score: 10
    },
    {
      name: 'PHP RCE CVE-2012-1823 Decoded',
      id: 2,
      regex: /\/cgi\-bin\/php\?\-d\+allow_url_include\=on\+\-d\+safe_mode\=off\+\-d\+suhosin\.simulation\=on\+\-d\+disable\_functions\=\"\"\+\-d\+open_basedir\=none\+\-d\+auto_prepend_file\=php\:\/\/input\+\-d\+cgi\.force_redirect\=0\+\-d\+cgi\.redirect_status_env\=0\+\-n/i,
      score: 10
    }
  ]
}