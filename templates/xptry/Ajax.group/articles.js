{
  {exp:channel:entries channel='thread' backspace='7' status='not closed'}
  {parents field='thread' status='{segment_4}'}
  "{parents:url_title}" : {
    "title" : {parents:title:json},
    "image" : {parents:article_image:json},
    "body" : {parents:body_of_article:json},
    "authors" : [
      {parents:authors backspace="8"}
      {
        "name": {parents:authors:title:json},
        "photo": {parents:authors:author_photo:json}
      },
      {/parents:authors}
    ],
    "status" : "{parents:status}"
  },
  {/parents}
  {/exp:channel:entries}
}