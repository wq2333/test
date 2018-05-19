function squareSelect(uids){
         var clickTime = "";
         var startLoc = [];
         var endLoc = [];
         var flag = "";
	     var rect = svg.append("rect")
	                   .attr("width", 0)
	                   .attr("height", 0)
	                   .style("fill", "rgba(22,22,22,0.3)")
	                   .style("stroke", "#ccc")
	                   .style("stroke-width", "2px")
	                   .attr("id", "idSquareSelect");

	          svg.on("mousedown", function(){
	                 clickTime = (new Date()).getTime();
	                 flag = true;
	                 rect.attr("transform", "translate("+d3.event.layerX+","+d3.event.layerY+")");
	                 startLoc = [d3.event.layerX, d3.event.layerY];
	          });

	          svg.on("mouseover", function(){
                    if(d3.event.target.localName == 'svg' && flag==true ||d3.event.target.localName == "rect" && flag == true) {
                             var width = d3.event.layerX - startLoc[0];
                             var height = d3.event.layerY - startLoc[1];
                             if (width < 0) {
                                   rect.attr("transform", "translate(" + d3.event.layerX + "," + startLoc[1] + ")");
                             }
                             if (height < 0) {
                                   rect.attr("transform", "translate(" + startLoc[0] + "," + d3.event.layerY + ")");
                             }
                             if (height < 0 && width < 0) {
                                   rect.attr("transform", "translate(" + d3.event.layerX + "," + d3.event.layerY + ")");
                             }
                                   rect.attr("width", Math.abs(width)).attr("height", Math.abs(height));
                    }
	          });

	          svg.on("mouseup", function(){
                     if(flag == true){
                             flag = false;
                             endLoc = [d3.event.layerX, d3.event.layerY];
                             var leftTop = [];
                             var rightBottom = []
                             if(endLoc[0]>=startLoc[0]){
                                     leftTop[0] = startLoc[0];
                                     rightBottom[0] = endLoc[0];
                             }else{
                                     leftTop[0] = endLoc[0];
                                     rightBottom[0] = startLoc[0];
                             }

                             if(endLoc[1]>=startLoc[1]){
                                     leftTop[1] = startLoc[1];
                                     rightBottom[1] = endLoc[1];
                             }else{
                                     leftTop[1] = endLoc[1];
                                     rightBottom[1] = startLoc[1];
                             }

                         d3.selectAll("#idPoint")
                            .attr("temp", function(d){
                                  if(xScale(d.x)<rightBottom[0] && xScale(d.x)>leftTop[0] && yScale(d.y)>leftTop[1] && yScale(d.y)<rightBottom[1]){
                                          if(d.attr.toString() in dataPortrait){
                                                if(d.attr.toString() in dataPortraitFromW2){
                                                      dataPortraitFromW2[d.attr.toString()] = dataPortraitFromW2[d.attr.toString()]+1;
                                                }else{
                                                      dataPortraitFromW2[d.attr.toString()] = 1;
                                                }
                                                d3.select(this).style("fill", "purple");
                                          }
                                  }
                         });
              //rect.attr("width",0).attr("height",0);
            }
            current = 2;
            drawWindow3(dataPortraitFromW2, page);
        });
}
