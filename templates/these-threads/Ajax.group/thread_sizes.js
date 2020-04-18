{
  {exp:channel:entries channel='thread' status='{segment_3}' backspace='7'}
  {parents field='thread' status='{segment_4}'}{if parents:count == 1}
  "{url_title}" : {parents:total_results},
  {/if}{/parents}
  {/exp:channel:entries}
}