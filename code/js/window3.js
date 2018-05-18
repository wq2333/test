function clearCurrentFigures(){
			setBasicPathsVisible(false);
			var libasePaths = g_16Root.getItems({'name': 'temp'});
			console.log(' pre page click! ', libasePaths.length);
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

  		console.log(" [1] ")
	   	var libasePaths = g_16Root.getItems({'name': /^suser_base/});
		console.log(" [2] ", libasePaths.length)
	   	libasePaths[index].visible = true
	   	var pos = getBasePos(libasePaths[index]);
	   	var boundaryBox = libasePaths[index].bounds;

	   	console.log(" Boundary Box ", boundaryBox);

	   	console.log(' mapFeature ', mapFeature, mapFeature[1]);
	   //gender
	   addGender(mapFeature[1], pos);

	   //education
	   addEdu(mapFeature[2], pos);

	   //age
	   addAge(mapFeature[1], mapFeature[0], pos);

	   //job
	   addJob(mapFeature[4], pos);

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

	   // var glassitem = g_16Root.children[mapFeature['edu'] + '_glass']
	   // var glass_copy = glassitem.clone();
	   // glass_copy.visible = true;
	   // glass_copy.position = pos + new Point(SHIFTBAG['glass'][0], SHIFTBAG['glass'][1]);
  }


	function setBasicPathsVisible(visible){
		var libasePaths = g_16Root.getItems({'name': /^suser_base/});
		for(var i = 0; i < libasePaths.length; i ++){
			var basePath = libasePaths[i];
			basePath.visible = visible;
		}
	}


	function addGender(gender, pos){
		console.log(' error [1] ', 'gender_' + gender)
	   	var hairitem = g_16Root.children['gender_' + gender]
	   	var hair_copy = hairitem.clone()
	   	console.log(' error [2] ')
	   	hair_copy.name = 'temp'
	   	hair_copy.visible = true;
	   	hair_copy.position = pos + new paper.Point(SHIFTBAG['hair'][0], SHIFTBAG['hair'][1]);
	}

	function addHouse(house, pos){
		var house = Number(house)
		var liHouse = [1]
		if(liHouse.indexOf(house) == -1){
			return;
		}
		var houseItem = g_16Root.children['house']
		var house_copy = houseItem.clone()
	    house_copy.name = 'temp';
		house_copy.visible = true
		house_copy.position = pos + new paper.Point(SHIFTBAG['house'][0], SHIFTBAG['house'][1]);
	}

	function addCar(car, pos){
		var car = Number(car)
		var liCar = [1]
		if(liCar.indexOf(car) == -1){
			return;
		}
		var carItem = g_16Root.children['car']
		var car_copy = carItem.clone()
	    car_copy.name = 'temp';
		car_copy.visible = true
		car_copy.position = pos + new paper.Point(SHIFTBAG['car'][0], SHIFTBAG['car'][1]);
	}

	function addEdu(edu, pos){
		if(edu == 1){
			console.log(" edu==1 ");
			return;
		}
	   var glassitem = g_16Root.children['edu_'+edu]
	   var glass_copy = glassitem.clone();
	   glass_copy.name = 'temp';
	   glass_copy.visible = true;
	   glass_copy.position = pos + new paper.Point(SHIFTBAG['glass'][0], SHIFTBAG['glass'][1]);
	}

	function addAge(gender, age, pos){
	   var liAge = ['young', 'old', 'older'];
		if(age==2){
			console.log(" age==2 ");
			return;
		}
	   var ageitem = g_16Root.children['age_' + gender + '_'+ age]
	   var age_copy = ageitem.clone();
	   age_copy.name = 'temp';
	   age_copy.visible = true;
	   age_copy.position = pos + new paper.Point(SHIFTBAG[age + '_age'][0], SHIFTBAG[age + '_age'][1]);
	}

	function addJob(job, pos){
		var liJob = ['management', 'student', 'business', 'worker', 'server', 'technique', 'goverment', 'retired', 'other']
		if(liJob.indexOf(job) == -1){
			console.log(" EMPAY ", job);
			return;
		}

	   var jobitem = g_16Root.children['job_' + job]
	   var job_copy = jobitem.clone();
	   job_copy.name = 'temp';
	   job_copy.visible = true;
	   if(job == 2){
	     	job_copy.position = pos + new paper.Point(SHIFTBAG[job + '_job'][0], SHIFTBAG[job + '_job'][1]);
	   }else
	   		job_copy.position = pos + new paper.Point(SHIFTBAG['job'][0], SHIFTBAG['job'][1]);
	}

	function addIncome(income, pos){
		var liIncome = [1,2,3,4,5]
		if(liIncome.indexOf(income) == -1){
			console.log(" EMPAY ", income);
			return;
		}
		var incomeitem = g_16Root.children['income']
		var income_copy = incomeitem.clone();
	    income_copy.visible = true;
	    income_copy.name = 'temp';
	    income_copy.scale(1 + income * 0.1);
	    income_copy.position = pos + new paper.Point(SHIFTBAG['income'][0], SHIFTBAG['income'][1]);
	}

	function addResident(resident, pos){
		var resident = Number(resident)
		var liResident = [1]
		if(liResident.indexOf(resident)){
			return;
		}
		var residentitem = g_16Root.children['resident']
		var resident_copy = residentitem.clone()
		resident_copy.visible = true;
		resident_copy.name = 'temp'
		resident_copy.position = pos + new paper.Point(SHIFTBAG['resident'][0], SHIFTBAG['resident'][1]);
	}

	function addText(count, pos, boundaryBox){
	   var text = new paper.PointText(pos + new paper.Point(0, boundaryBox.height/2. + 13));
		text.justification = 'center';
		// text.name = 'temp'
		g_liText.push(text);
		text.fillColor = 'black';
		text.content = count;
	}

   function getBasePos(basePath){
	   	console.log(" basePath.position ", basePath.position)
	   	var pos = basePath.position
	   	return pos
   }

function drawWindow3(obInput){
        var values = Object.values(obInput);
        values.sort();
        values.sort(function(a,b){
              return b-a;
        });
        console.log(values);

        var alreadydraw = [];
        var i=0;
        while(i<16){
          for(x in obInput){
             if(obInput[x]==values[i]){
                if(!(x in alreadydraw)){
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
    for(var i=0;i<8;i++){
        attrDataset[i] = parseInt(temp[i]);
    }

    console.log(" error ", attrDataset);

    drawFigure(i, attrDataset, num);
}