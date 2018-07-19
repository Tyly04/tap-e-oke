;Use %1%
if InStr(%2%, down){
  Send, {%1% down}
  KeyWait %1%
  Send, {%1% up}
}
else if InStr(%2%, up)
  Send, {%1% up}
else
  Send, %1%
