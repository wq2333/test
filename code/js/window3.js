function clearCurrentFigures(m){
			setSuserbaseVisible(false, m);
			var temp = "temp"+m;
			var libasePaths = g_16Root.getItems({'name': temp});
			console.log(libasePaths.length);
			for(var i = 0; i < libasePaths.length; i ++){
				var path_temp = libasePaths[i];
				path_temp.remove()
			}
			for(var i = 0; i < g_liText[m].length; i ++){
				var path_temp = g_liText[m][i];
				path_temp.remove()
			}
			g_liText[m] = []
		}


	function setSuserbaseVisible(visible, mode){
	    var libasePaths;
	    if(mode==5){
	         libasePaths = g_16Root.getItems({'name': /^suser_base/});
	    }else if(mode==0){
	         libasePaths = g_16Root.getItems({'name': /^suser_base_0/});
	    }else if(mode==1){
	         libasePaths = g_16Root.getItems({'name': /^suser_base_1/});
	    }else if(mode==2){
	         libasePaths = g_16Root.getItems({'name': /^suser_base_2/});
	    }else if(mode==3){
	         libasePaths = g_16Root.getItems({'name': /^suser_base_3/});
	    }
		for(var i = 0; i < libasePaths.length; i ++){
			var basePath = libasePaths[i];
			basePath.visible = visible;
		}
	}

  function initButtons(item){

        for(var j=1;j<14;j++){
            var a = "plus_"+String(j);
            var plusBar = item.children[a];

            plusBar.onClick = function(){
                var n = parseInt(this._name.substr(5));
                var g = document.getElementById("group");
                g.style.left = String(n*3)+"%";
                g.style.top = "96%";
                g.style.visibility="visible";
                g.ondblclick = function(){
                     var v = g.options[g.selectedIndex].value;
                     g.style.visibility = "hidden";
                     addToGroups(n, v);
                }
            }
            plusBar.onMouseEnter = function(){
					this.strokeColor = 'blue';
            }
			plusBar.onMouseLeave = function(){
					this.strokeColor = null;
		    }
        }

         g_16Root.children['pre_page_button'].onClick = function(){
                      console.log(' pre page click! ');
                      if(page!=0){
                           page--;
                           if(current==1){
                               drawWindow3(dataPortrait, page);
                           }else if(current==2){
                               drawWindow3(dataPortraitFromW2, page);
                           }
                      }else{
                           alert("This is the first page.");
                      }
         }

         g_16Root.children['next_page_button'].onClick = function(){
                      page++;
                      if(current==1){
                           drawWindow3(dataPortrait, page);
                      }else if(current==2){
                           drawWindow3(dataPortraitFromW2, page);
                      }
         }

         g_16Root.children['clear_1'].onClick = function(){
               clearCurrentFigures(1);
               groups[0] = 0;
         }

         g_16Root.children['clear_2'].onClick = function(){
               clearCurrentFigures(2);
               groups[1] = 0;
         }

         g_16Root.children['rename_1'].onClick = function(){
                var input = document.getElementById("nameInput");
                var sub = document.getElementById("nameButton");
                input.style.left = "27.5%";
                input.style.top = "38.6%";
                input.style.width = "7%";
                sub.style.left = "35%";
                sub.style.top = "38.6%";
                input.style.visibility="visible";
                sub.style.visibility="visible";

                sub.onclick = function(){
                     var name = input.value;
                     document.getElementById("g1name").style.color = "black";
                     document.getElementById("g1name").innerHTML = name;
                     input.style.visibility = "hidden";
                     sub.style.visibility = "hidden";
                }
         }

         g_16Root.children['rename_2'].onClick = function(){
                var input = document.getElementById("nameInput");
                var sub = document.getElementById("nameButton");
                input.style.left = "27.5%";
                input.style.top = "62.5%";
                input.style.width = "7%";
                sub.style.left = "35%";
                sub.style.top = "62.5%";
                input.style.visibility="visible";
                sub.style.visibility="visible";

                sub.onclick = function(){
                     var name = input.value;
                     document.getElementById("g2name").style.color = "black";
                     document.getElementById("g2name").innerHTML = name;
                     input.style.visibility = "hidden";
                     sub.style.visibility = "hidden";
                }
         }

         g_16Root.children['go_1'].onMouseEnter = function(){
					this.strokeColor = 'blue';
         }
         g_16Root.children['go_1'].onMouseEnter = function(){
					this.strokeColor = null;
         }
         g_16Root.children['go_2'].onMouseEnter = function(){
					this.strokeColor = 'blue';
         }
         g_16Root.children['go_2'].onMouseEnter = function(){
					this.strokeColor = null;
         }

         g_16Root.children['go_1'].onClick = function(){
                begintoDraw(0);
         }

         g_16Root.children['go_2'].onClick = function(){
                begintoDraw(1);
         }

  }


  function drawFigure(index, mapFeature, count, mode){
        var name = "suser_base_"+mode+"_"+index;

        var libasePaths = g_16Root.children[name];
	   	libasePaths.visible = true;
	   	var pos = getBasePos(libasePaths);
	   	var boundaryBox = libasePaths.bounds;

	   //job
	   addJob(mapFeature[4], pos, mode);

	   //gender
	   addGender(mapFeature[1], pos, mode);

	   //education
	   addEdu(mapFeature[2], pos, mode);

	   //age
	   addAge(mapFeature[1], mapFeature[0], pos, mode);

	   //income
	   addIncome(mapFeature[3], pos, mode);

	   //resident
	   addResident(mapFeature[5], pos, mode);

	   //house
	   addHouse(mapFeature[7], pos, mode);

	   //car
	   addCar(mapFeature[6], pos, mode);

	   //count text
	   addText(count, pos, boundaryBox, mode);

  }

	function addGender(gender, pos, m){
	   	var hairitem = g_16Root.children['gender_' + gender.toString()]
	   	var hair_copy = hairitem.clone()
	   	hair_copy.name = 'temp'+String(m);
	   	hair_copy.visible = true;
	   	hair_copy.position = new paper.Point(pos._x + SHIFTBAG['hair'][0], pos._y +SHIFTBAG['hair'][1]);
	}

	function addHouse(house, pos, m){
		if((house == 2)||(house==3)){
			return;
		}
		var houseItem = g_16Root.children['house']
		var house_copy = houseItem.clone()
	    house_copy.name = 'temp'+String(m);
		house_copy.visible = true
		house_copy.position = new paper.Point(pos._x + SHIFTBAG['house'][0], pos._y + SHIFTBAG['house'][1]);
	}

	function addCar(car, pos, m){
		if(car == 2){
			return;
		}
		var carItem = g_16Root.children['car']
		var car_copy = carItem.clone()
	    car_copy.name = 'temp'+String(m);
		car_copy.visible = true
		car_copy.position = new paper.Point(pos._x + SHIFTBAG['car'][0], pos._y + SHIFTBAG['car'][1]);
	}

	function addEdu(edu, pos, m){
		if(edu == 1){
			return;
		}
	   var name = 'edu_'+edu.toString();
	   var glassitem = g_16Root.children[name];
	   var glass_copy = glassitem.clone();
	   glass_copy.name = 'temp'+String(m);
	   glass_copy.visible = true;
	   glass_copy.position = new paper.Point(pos._x + SHIFTBAG['glass'][0], pos._y + SHIFTBAG['glass'][1]);
	}

	function addAge(gender, age, pos, m){
	   var liAge = ['young', 'old', 'older'];
		if(age==2){
			return;
		}
	   var ageitem = g_16Root.children['age_' + gender + '_'+ age]
	   var age_copy = ageitem.clone();
	   age_copy.name = 'temp'+String(m);
	   age_copy.visible = true;
	   age_copy.position = new paper.Point(pos._x + SHIFTBAG['age_'+ age][0], pos._y + SHIFTBAG['age_'+age][1]);
	}

	function addJob(job, pos, m){
	   var jobitem = g_16Root.children['job_' + job]
	   var job_copy = jobitem.clone();
	   job_copy.name = 'temp'+String(m);
	   job_copy.visible = true;
	   if(job == 2){
	     	job_copy.position = new paper.Point(pos._x + SHIFTBAG['job_2'][0], pos._y + SHIFTBAG['job_2'][1]);
	   }else
	   		job_copy.position = new paper.Point(pos._x + SHIFTBAG['job'][0], pos._y + SHIFTBAG['job'][1]);
	}

	function addIncome(income, pos, m){
		var incomeitem = g_16Root.children['income']
		var income_copy = incomeitem.clone();
	    income_copy.visible = true;
	    income_copy.name = 'temp'+String(m);
	    income_copy.scale(0.7 + income * 0.15);
	    income_copy.position = new paper.Point(pos._x + SHIFTBAG['income'][0], pos._y + SHIFTBAG['income'][1]);
	}

	function addResident(resident, pos, m){
		if(resident!=1){
		     return;
		}
		var residentitem = g_16Root.children['resident']
		var resident_copy = residentitem.clone()
		resident_copy.visible = true;
		resident_copy.name = 'temp'+String(m)
		resident_copy.position = new paper.Point(pos._x + SHIFTBAG['resident'][0], pos._y + SHIFTBAG['resident'][1]);
	}

	function addText(count, pos, boundaryBox, m){
	   var text = new paper.PointText( new paper.Point(pos._x-2, boundaryBox.height/2 + 15 + pos._y));
		text.justification = 'center';
		g_liText[m].push(text);
		text.fillColor = 'black';
		text.content = count;
	}

   function getBasePos(basePath){
	   	var pos = basePath.position
	   	return pos
   }



function addToGroups(baseId, groupId){
        drawFigure(groups[groupId-1]+1, personas13[baseId-1], personasNumber[baseId-1], groupId);
        console.log(groups[groupId-1]+1, personas13[baseId-1], personasNumber[baseId-1], groupId);
        groupAttr[groupId-1].push(personas13[baseId-1]);
        groups[groupId-1]++;
}

function drawWindow3(obInput, page){

        var values = getObjectValues(obInput);
        values.sort();
        values.sort(function(a,b){
              return b-a;
        });

        clearCurrentFigures(0);

        var alreadydraw = [];
        var i=0;
        while((i<13)&&((i+13*page)<values.length)){
            for(x in obInput){
               if(obInput[x]==values[i+13*page]){
                    if(!(judgeIn(x, alreadydraw))){
               		    transform2draw(i, x, obInput[x]);
                        alreadydraw.push(x);
                        i++;
                        break;
                    }
               }
            }
        }
}

function transform2draw(i, attrString, num){
    var attrDataset = [];

    var temp = attrString.split(",");
    for(var j=0;j<8;j++){
        attrDataset[j] = parseInt(temp[j]);
    }
    drawFigure(i+1, attrDataset, num, 0);
    personas13[i] = attrDataset;
    personasNumber[i] = num;

}

function getObjectKeys(object)
{
    var keys = [];
    for (var property in object)
      keys.push(property);
    return keys;
}

function getObjectValues(object)
{
    var values = [];
    for (var property in object)
      values.push(object[property]);
    return values;
}

function judgeIn(a, ab){
    for(var i=0;i<ab.length;i++){
        if(ab[i]==a){
            return true;
        }
    }
    return false;
}