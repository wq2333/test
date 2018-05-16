function resetOptions(){
		g_CurrentAttribteOptions = {}
		g_CurrentShowFigureIndex = -1
		for(var i = 0; i < g_liAttrName.length; i ++){
			g_CurrentAttribteOptions[g_liAttrName[i]] = [];
		}
	}


function updateOptions(dressBag, attrClicked){

		var attr = dressBag['attr']
		var option = dressBag['option']

		var index = g_CurrentAttribteOptions[attr].indexOf(option)
		if(attrClicked == true && index == -1){
			g_CurrentAttribteOptions[attr].push(option)
		}else if(attrClicked == false && index != -1){
			g_CurrentAttribteOptions[attr].splice(index, 1);
		}

		console.log(" g_CurrentAttribteOptions ", g_CurrentAttribteOptions);

		//update render
		var multiple = false
		// var liMultipleOptionAttribute = []
		var mapMAttriOptions = {}
		var liSingleOptionAttribute = []
		for(var i = 0; i < g_liAttrName.length; i ++){
			var attr = g_liAttrName[i]
			if(g_CurrentAttribteOptions[attr].length > 1){
				multiple = true
				mapMAttriOptions[attr] = g_CurrentAttribteOptions[attr]
			}else if(g_CurrentAttribteOptions[attr].length == 1){
				liSingleOptionAttribute.push(attr);
			}
		}
		g_Root.getItem({'name': 'button_checkmore'}).visible = multiple;

		//create the Figure
		for(var i = 0; i < g_liFigure.length; i ++){
			for(var j = 0; j < g_liFigure[i].length; j ++){
				g_liFigure[i][j].visible = false;
				g_liFigure[i][j].remove();
			}
		}
		g_liFigure = []

		console.log(" SINGLE = ", liSingleOptionAttribute, ' MULTIPE = ', liMultipleOptionAttribute)

		var liFigureOptions = []
		var commonOption = [];

		// console.log(" liCommoptonp before ", commonOption_t, commonOption_t.length, commonOption_t[0], liFigureOptions_t);

		for(var i = 0; i < liSingleOptionAttribute.length; i ++){
			var singleAttr = liSingleOptionAttribute[i]
			var option = g_CurrentAttribteOptions[singleAttr];
			var dressOn = 'dresslater_' + option;

			if((option[0]=='age_l3')||(option[0]=='age_l4')){
                  dressOn = 'dresslater_age'+currentGender+option[0].substr(3)
			}

			if(option[0]=='age_l2'){
			     dressOn = 'dresslater_gender_'+currentGender
			}
		    console.log(" single ATTR:", singleAttr, " dressOn:", dressOn)
			commonOption.push(dressOn);
		}
		liFigureOptions.push(commonOption)
		console.log("liFigureOption ", liFigureOptions);

		// console.log(" liCommoptonp after ", commonOption_t, liFigureOptions);

		var liMultipleOptionAttribute = Object.keys(mapMAttriOptions);

		for(var i = 0; i < liMultipleOptionAttribute.length; i ++){
			var mAtrri = liMultipleOptionAttribute[i]
			var liOption = mapMAttriOptions[mAtrri]
			var liNewFigureOption = [];
			for(var j = 0; j < liOption.length; j ++){
				var option = liOption[j]
				console.log(' add M-option ', option)
				for(var p = 0; p < liFigureOptions.length; p ++){
					var option_temp = liFigureOptions[p];
					option_temp.push('dresslater_' + option);
					liNewFigureOption.push(option_temp);
				}
			}
			liFigureOptions = liNewFigureOption
		}

		console.log(' new figure options ', liFigureOptions);

		//render the figure, make the first one visible
		for(var i = 0; i < liFigureOptions.length; i ++){

			if(i >= 1)
				break;

			var figureOptions = liFigureOptions[i];

			var liChild = []
			console.log(' [1] ')
			var basePath = g_Root.children['suser_base'].clone()
			liChild.push(basePath)
			if(i == 0)
				basePath.visible = true;
			console.log(' [2] ')
			for(var j = 0; j < figureOptions.length; j ++){
				console.log(" [3] ", figureOptions[j])   //dresslater_agem_l4
				var temp = g_Root.children[figureOptions[j]].clone();
				temp.name = 'xx_' + i+ "_" + j
				if(i == 0)
					temp.visible = true;
				else
					temp.visible = false;
				liChild.push(temp)
			}
			g_liFigure.push(liChild);
		}
	}

	function initItems(item){
		//invisible dresslater
		var liDressLater = item.getItems({'name': /^dresslater/});
		for(var i = 0; i < liDressLater.length; i ++){
			var dressLater = liDressLater[i]
			dressLater.visible = false;
		}

		//invisible button_checkmore
		item.getItem({'name': 'button_checkmore'}).visible = false;
	}

	function initEvent(item){

		for(var i = 0; i < g_liAttrName.length; i ++){
			var attrName = g_liAttrName[i];
			var childItem = item.children[attrName];
			var liOptionBar = childItem.getItems(
				{'name': /^attr/});

			for(var j = 0; j < liOptionBar.length; j ++){
				var optionBar = liOptionBar[j]
				optionBar.strokeWidth = 2
				optionBar._AttrClick = false
				optionBar.onClick = function(){
					this._AttrClick = !this._AttrClick;
					if(this._AttrClick){
						this.strokeColor = 'white';
					}else{
						this.strokeColor = null;
					}
					if((this._name=='attr_gender_1')&&(this._AttrClick)){
                        currentGender = "1";
					}
					if((this._name=='attr_gender_2')&&(this._AttrClick)){
                        currentGender = "2";
					}
                    changeOption(this._name, this._AttrClick);
                    getDataforw2(this._name, this._AttrClick);
				}
				optionBar.onMouseEnter = function(){
					this.strokeColor = 'white';
				}
				optionBar.onMouseLeave = function(){
					if(this._AttrClick == false)
						this.strokeColor = null;
				}
			}
		}
	}

	function changeOption(optionName, attrClicked){
		var dressBag = getDressbag(optionName);
		//update the options
		updateOptions(dressBag, attrClicked);
		// if(attrClicked){
		// 	console.log(' Dress On ', liDressOn);
		// 	g_Root.children[liDressOn].visible = true;
		// }else{
		// 	console.log(' Dress Off ', liDressOn);
		// 	g_Root.children[liDressOn].visible = false;
		// }
	}

	function getDressbag(optionName){
	    var attr = optionName.split('_')[1]   //gender
		var deSuffix = optionName.substr('attr_'.length, optionName.length - 'attr_'.length);  //gender_m
		return {
			'attr': attr,
			'option': deSuffix,
			'dresslater': 'dresslater_' + deSuffix
		}
	}

	function getDataforw2(optionName, attrClicked){
	       var zu = 0;
	   	   if(optionName.indexOf('age')>0){
	           zu = 0;
	       }else if(optionName.indexOf('gen')>0){
	           zu = 1;
	       }else if(optionName.indexOf('edu')>0){
	           zu = 2;
	       }else if(optionName.indexOf('inc')>0){
	           zu = 3;
	       }else if(optionName.indexOf('job')>0){
	           zu = 4;
	       }else if(optionName.indexOf('res')>0){
	           zu = 5;
	       }else if(optionName.indexOf('car')>0){
	           zu = 6;
	       }else if(optionName.indexOf('hou')>0){
	           zu = 7;
	       }

           var num = parseInt(optionName.substr(optionName.length-1,optionName.length-1));

         if(attrClicked){
             if(inp[zu].length==attributesLength[zu]){
                 inp[zu] = [];
                 inp[zu].push(num);
             }else{
                 inp[zu].push(num);
             }
         }else{
              if(inp[zu].length==1){
                 inp[zu] = [];
                 for(var i=1;i<=attributesLength.length;i++){
                     inp[zu].push(i);
                 }
              }else{
                  var n = inp[zu].indexOf(num);
                  inp[zu].splice(n,1);
              }
         }

         drawWindow2(inp, 1);

	}