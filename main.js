const resultTemplate = Handlebars.compile(document.getElementById('result-template').innerHTML);

Handlebars.registerHelper('trimTitle', function(title) {
  return (title.length > 35) ? title.substring(0, 35) + '...' : title;
});

Handlebars.registerHelper('getUrl', function(permalink) {
  return 'https://www.reddit.com' + permalink;
});

Handlebars.registerHelper('getImage', function(url) {
  return (hasImage(url)) ? url : '';
});

Handlebars.registerHelper('parseNum', function(num) {
  return num.toLocaleString();
});

Handlebars.registerHelper('hasImage', function(url, options) {
  return (hasImage(url)) ? options.fn(this) : options.inverse(this);
});

function hasImage(url) {
  return /.*\.(jpg|jpeg|png)/.test(url);
}

function renderResult(result) {
  console.log(result);

  let sanitizedHtml = resultTemplate({
    result,
    subreddit: result[0].data.subreddit,
    subscribers: result[0].data.subreddit_subscribers.toLocaleString()
  });

  $('.loader').css('display', 'none');
  $('#results').html(sanitizedHtml);
  $('#results').css('opacity', 1);
}

$(document).ready(function() {
  $('#redditForm').submit(async function(e) {
    e.preventDefault();
    $('#error').css('display', 'none');
    $('.loader').css('display', 'block');
    let subreddit = $(this).find('input[name="subreddit"]').val();

    try {
      let results = await $.ajax({
        method: 'GET',
        url: 'https://www.reddit.com/r/' + subreddit + '.json'
      });
      renderResult(results.data.children);
    } catch (e) {
      console.log(e)
      $('#error').css('display', 'block');
      $('#results').html('');
      $('.loader').css('display', 'none');
    }
  });
});
