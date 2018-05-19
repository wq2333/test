function clearCurrentFigures(){
			setBasicPathsVisible(false);
			var libasePaths = g_16Root.getItems({'name': 'temp'});
			for(var i = 0; i < libasePaths.length; i ++){
				var path_temp = libasePaths[i];
				path_temp.remove()
			}
			for(var i = 0; i < g_liText.length; i ++){
				var path_temp = g_liText[i];
				path_temp.remove()
			}
			g_liText = []
		}


  function drawFigure(index, mapFeature, count){

  	    var libasePaths = g_16Root.getItems({'name': /^suser_base/});

	   	libasePaths[index].visible = true
	   	var pos = getBasePos(libasePaths[index]);
	   	var boundaryBox = libasePaths[index].bounds;

	   	//console.log(' mapFeature ', mapFeature, mapFeature[1]);

	   //job
	   addJob(mapFeature[4], pos);

	   //gender
	   addGender(mapFeature[1], pos);

	   //education
	   addEdu(mapFeature[2], pos);

	   //age
	   addAge(mapFeature[1], mapFeature[0], pos);

	   //income
	   addIncome(mapFeature[3], pos);

	   //resident
	   addResident(mapFeature[5], pos);

	   //house
	   addHouse(mapFeature[7], pos);

	   //car
	   addCar(mapFeature[6], pos);

	   //count text
	   addText(count, pos, boundaryBox);

  }


	function setBasicPathsVisible(visible){
		var libasePaths = g_16Root.getItems({'name': /^suser_base/});
		for(var i = 0; i < libasePaths.length; i ++){
			var basePath = libasePaths[i];
			basePath.visible = visible;
		}
	}


	function addGender(gender, pos){
	   	var hairitem = g_16Root.children['gender_' + gender.toString()]
	   	var hair_copy = hairitem.clone()
	   	hair_copy.name = 'temp'
	   	hair_copy.visible = true;
	   	hair_copy.position = new paper.Point(pos._x + SHIFTBAG['hair'][0], pos._y +SHIFTBAG['hair'][1]);
	}

	function addHouse(house, pos){
		if((house == 2)||(house==3)){
			return;
		}
		var houseItem = g_16Root.children['house']
		var house_copy = houseItem.clone()
	    house_copy.name = 'temp';
		house_copy.visible = true
		house_copy.position = new paper.Point(pos._x + SHIFTBAG['house'][0], pos._y + SHIFTBAG['house'][1]);
	}

	function addCar(car, pos){
		if(car == 2){
			return;
		}
		var carItem = g_16Root.children['car']
		var car_copy = carItem.clone()
	    car_copy.name = 'temp';
		car_copy.visible = true
		car_copy.position = new paper.Point(pos._x + SHIFTBAG['car'][0], pos._y + SHIFTBAG['car'][1]);
	}

	function addEdu(edu, pos){
		if(edu == 1){
			return;
		}
	   var name = 'edu_'+edu.toString();
	   var glassitem = g_16Root.children[name];
	   var glass_copy = glassitem.clone();
	   glass_copy.name = 'temp';
	   glass_copy.visible = true;
	   glass_copy.position = new paper.Point(pos._x + SHIFTBAG['glass'][0], pos._y + SHIFTBAG['glass'][1]);
	}

	function addAge(gender, age, pos){
	   var liAge = ['young', 'old', 'older'];
		if(age==2){
			return;
		}
	   var ageitem = g_16Root.children['age_' + gender + '_'+ age]
	   var age_copy = ageitem.clone();
	   age_copy.name = 'temp';
	   age_copy.visible = true;
	   age_copy.position = new paper.Point(pos._x + SHIFTBAG['age_'+ age][0], pos._y + SHIFTBAG['age_'+age][1]);
	}

	function addJob(job, pos){
	   var jobitem = g_16Root.children['job_' + job]
	   var job_copy = jobitem.clone();
	   job_copy.name = 'temp';
	   job_copy.visible = true;
	   if(job == 2){
	     	job_copy.position = new paper.Point(pos._x + SHIFTBAG['job_2'][0], pos._y + SHIFTBAG['job_2'][1]);
	   }else
	   		job_copy.position = new paper.Point(pos._x + SHIFTBAG['job'][0], pos._y + SHIFTBAG['job'][1]);
	}

	function addIncome(income, pos){
		var incomeitem = g_16Root.children['income']
		var income_copy = incomeitem.clone();
	    income_copy.visible = true;
	    income_copy.name = 'temp';
	    income_copy.scale(0.7 + income * 0.15);
	    income_copy.position = new paper.Point(pos._x + SHIFTBAG['income'][0], pos._y + SHIFTBAG['income'][1]);
	}

	function addResident(resident, pos){
		if(resident!=1){
		     return;
		}
		var residentitem = g_16Root.children['resident']
		var resident_copy = residentitem.clone()
		resident_copy.visible = true;
		resident_copy.name = 'temp'
		resident_copy.position = new paper.Point(pos._x + SHIFTBAG['resident'][0], pos._y + SHIFTBAG['resident'][1]);
	}

	function addText(count, pos, boundaryBox){
	   var text = new paper.PointText( new paper.Point(pos._x, boundaryBox.height/2. + 13 + pos._y));
		text.justification = 'center';
		g_liText.push(text);
		text.fillColor = 'black';
		text.content = count;
	}

   function getBasePos(basePath){
	   	var pos = basePath.position
	   	return pos
   }

function drawWindow3(obInput, page){
        console.log("drawWindow3:");

        var values = getObjectValues(obInput);
        values.sort();
        values.sort(function(a,b){
              return b-a;
        });
        console.log("after sort,", values);

        clearCurrentFigures();

        var alreadydraw = [];
        var i=0;
        while((i<16)&&((i+16*page)<values.length)){
            for(x in obInput){
               if(obInput[x]==values[i+16*page]){
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

    console.log(" ready for Portrait ", i, attrDataset, num);
    drawFigure(i, attrDataset, num);
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