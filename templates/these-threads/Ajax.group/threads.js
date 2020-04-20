{
  {exp:channel:entries channel='thread' backspace='4' status='{segment_3}'}
  "{url_title}" : {
    "title" : "{title}",
    "centre_x" : {centre_x},
    "centre_y" : {centre_y},
    "width" : {width},
    "height" : {height},
    "ctor" : "{ctor}",
    "status" : "{status}",
    "images" : [
      {thread_images backspace='8'}
      {
        "name" : {thread_images:name:json},
        "type" : {thread_images:type:json},
        "file" : "{thread_images:file}"
      },
      {/thread_images}
    ]
    {parents field='thread' status='{segment_3}'}{if parents:count == 1}
    , "num_articles" : {parents:total_results}
    {/if}{/parents}
  },
  {/exp:channel:entries}
}