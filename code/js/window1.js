	function initEvent(item){
		for(var i = 0; i < g_liAttrName.length; i ++){

			var attrName = g_liAttrName[i];
			var childItem = item.children[attrName];
			var liOptionBar = childItem.getItems(
				{'name': /^attr/});

			for(var j = 0; j < liOptionBar.length; j ++){
				var optionBar = liOptionBar[j]
			    optionBar._AttrClick = true
				optionBar.strokeWidth = 1;
				optionBar.opacity = 1.
				// optionBar.strokeColor = 'blue';
				optionBar.onClick = function(){
					this._AttrClick = !this._AttrClick;
					if(this._AttrClick){
						this.opacity = 1.;
						// this.strokeColor = 'blue';
						this.strokeWidth = 1;
					}else{
						this.opacity = 0.1;
						this.strokeColor = null;
						// this.strokeWidth = 2;
					}
                    get8dDataset(this._name, this._AttrClick);
				}
				optionBar.onMouseEnter = function(){
					this.opacity = 1.;
					this.strokeColor = 'gray';
					this.strokeWidth = 0.5
				}
				optionBar.onMouseLeave = function(){

					this.strokeColor = null;
					// this.strokeWidth = 0.5
					// if(this._AttrClick == false)
						// this.strokeColor = null;
				}
			}
		}
	}


	function get8dDataset(optionName, attrClicked){
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

