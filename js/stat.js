jQuery(function($) {
  var url = 'https://docs.google.com/spreadsheet/ccc?key=1xyRk6nd9piGTWsrGKXUqNajfO9YjBGfNzrmsb2aC6Lo#gid=2067272081';
  var tmpl = $('#stat-template').html();
  recline.Backend.GDocs.fetch({url: url})
    .done(function(results) {
      // take off first row as it is instructions
      results.stats = results.stats.slice(1);
      results.stats = _.map(results.stats, function(stat) {
        stat.owners = parseOwners(stat.owners);
        stat.noOwner = (stat.owners.length === 0)
        stat.description = markup(stat.description);
        stat.notes = markup(stat.notes);
        return stat
      });
      var out = Mustache.render(tmpl, results);
      $el.html(out);
    });
  $('.source-url').attr('href', url);
  $('.js-more-info').live('click', function(e) {
    e.preventDefault();
    $(e.target) .closest('.stat').find('.more-info').toggle();
  });
});

function strip(s) {
  return s.replace(/^ */, '').replace(/ *$/, '');
}

function parseOwners(owners) {
  owners = strip(owners);
  if (owners == '') {
    return [];
  }
  var out = _.map(owners.split(','), function(owner) {
    var parts = strip(owner).match(/^([^<]*)(<(.*)>)?/);
    newowner = {
      name: parts[1],
      email: parts[3] || ''
    }
    if (newowner.email) {
      newowner.gravatar = 'http://www.gravatar.com/avatar/' + md5(newowner.email.toLowerCase()) + '?s=40&d=retro';
    }
    return newowner;
  });
  return out;
}

// replace http:// to a string ...
function markup(str) {
  str = str.replace(/(https?:\/\/[^ ]+)/g, '<a href="$1">$1</a>');
  return str;
}
