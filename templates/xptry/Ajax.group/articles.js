{
  {exp:channel:entries channel='article' backspace='4' status='{segment_3}'}
  "{url_title}" : {
    "title" : {title:json},
    "image" : {article_image:json},
    "body" : {body_of_article:json},
    "authors" : [
      {authors backspace="8"}
      {
        "name": {authors:title:json},
        "photo": {authors:author_photo:json}
      },
      {/authors}
    ],
    "status" : "{status}",
    "thread" : {thread status='not closed'}'{thread:url_title}'{/thread}
  },
  {/exp:channel:entries}
}