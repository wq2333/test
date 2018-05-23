function initPurpose(item){

  for(var j=1;j<11;j++){
            var a = "p"+String(j);
            var pBar = item.children[a];


            pBar._AttrClick = true
			pBar.strokeWidth = 4;
			pBar.strokeColor = 'black';
		    pBar.onClick = function(){
					this._AttrClick = !this._AttrClick;
					if(this._AttrClick){
						this.strokeColor = 'black';
						this.strokeWidth = 4;
					}else{
						this.strokeColor = null;
						this.strokeWidth = 1;
					}
			}
			pBar.onMouseEnter = function(){
					this.strokeColor = 'black';
		    }
			pBar.onMouseLeave = function(){
					if(this._AttrClick == false)
						this.strokeColor = null;
			}
        }
}


 function d3threeD( exports ) {
        var DEGS_TO_RADS = Math.PI / 180, UNIT_SIZE = 100;
        var DIGIT_0 = 48, DIGIT_9 = 57, COMMA = 44, SPACE = 32, PERIOD = 46, MINUS = 45;
        exports.transformSVGPath = function transformSVGPath( pathStr ) {
            var path = new THREE.ShapePath();
            var idx = 1, len = pathStr.length, activeCmd,
                    x = 0, y = 0, nx = 0, ny = 0, firstX = null, firstY = null,
                    x1 = 0, x2 = 0, y1 = 0, y2 = 0,
                    rx = 0, ry = 0, xar = 0, laf = 0, sf = 0, cx, cy;
            function eatNum() {
                var sidx, c, isFloat = false, s;
                // eat delims
                while ( idx < len ) {
                    c = pathStr.charCodeAt( idx );
                    if ( c !== COMMA && c !== SPACE ) break;
                    idx ++;
                }
                if ( c === MINUS ) {
                    sidx = idx ++;
                } else {
                    sidx = idx;
                }
                // eat number
                while ( idx < len ) {
                    c = pathStr.charCodeAt( idx );
                    if ( DIGIT_0 <= c && c <= DIGIT_9 ) {
                        idx ++;
                        continue;
                    } else if ( c === PERIOD ) {
                        idx ++;
                        isFloat = true;
                        continue;
                    }
                    s = pathStr.substring( sidx, idx );
                    return isFloat ? parseFloat( s ) : parseInt( s );
                }
                s = pathStr.substring( sidx );
                return isFloat ? parseFloat( s ) : parseInt( s );
            }
            function nextIsNum() {
                var c;
                // do permanently eat any delims...
                while ( idx < len ) {
                    c = pathStr.charCodeAt( idx );
                    if ( c !== COMMA && c !== SPACE ) break;
                    idx ++;
                }
                c = pathStr.charCodeAt( idx );
                return ( c === MINUS || ( DIGIT_0 <= c && c <= DIGIT_9 ) );
            }
            var canRepeat;
            activeCmd = pathStr[ 0 ];
            while ( idx <= len ) {
                canRepeat = true;
                switch ( activeCmd ) {
                    // moveto commands, become lineto's if repeated
                    case 'M':
                        x = eatNum();
                        y = eatNum();
                        path.moveTo( x, y );
                        activeCmd = 'L';
                        firstX = x;
                        firstY = y;
                        break;
                    case 'm':
                        x += eatNum();
                        y += eatNum();
                        path.moveTo( x, y );
                        activeCmd = 'l';
                        firstX = x;
                        firstY = y;
                        break;
                    case 'Z':
                    case 'z':
                        canRepeat = false;
                        if ( x !== firstX || y !== firstY ) path.lineTo( firstX, firstY );
                        break;
                    // - lines!
                    case 'L':
                    case 'H':
                    case 'V':
                        nx = ( activeCmd === 'V' ) ? x : eatNum();
                        ny = ( activeCmd === 'H' ) ? y : eatNum();
                        path.lineTo( nx, ny );
                        x = nx;
                        y = ny;
                        break;
                    case 'l':
                    case 'h':
                    case 'v':
                        nx = ( activeCmd === 'v' ) ? x : ( x + eatNum() );
                        ny = ( activeCmd === 'h' ) ? y : ( y + eatNum() );
                        path.lineTo( nx, ny );
                        x = nx;
                        y = ny;
                        break;
                    // - cubic bezier
                    case 'C':
                        x1 = eatNum(); y1 = eatNum();
                    case 'S':
                        if ( activeCmd === 'S' ) {
                            x1 = 2 * x - x2;
                            y1 = 2 * y - y2;
                        }
                        x2 = eatNum();
                        y2 = eatNum();
                        nx = eatNum();
                        ny = eatNum();
                        path.bezierCurveTo( x1, y1, x2, y2, nx, ny );
                        x = nx; y = ny;
                        break;
                    case 'c':
                        x1 = x + eatNum();
                        y1 = y + eatNum();
                    case 's':
                        if ( activeCmd === 's' ) {
                            x1 = 2 * x - x2;
                            y1 = 2 * y - y2;
                        }
                        x2 = x + eatNum();
                        y2 = y + eatNum();
                        nx = x + eatNum();
                        ny = y + eatNum();
                        path.bezierCurveTo( x1, y1, x2, y2, nx, ny );
                        x = nx; y = ny;
                        break;
                    // - quadratic bezier
                    case 'Q':
                        x1 = eatNum(); y1 = eatNum();
                    case 'T':
                        if ( activeCmd === 'T' ) {
                            x1 = 2 * x - x1;
                            y1 = 2 * y - y1;
                        }
                        nx = eatNum();
                        ny = eatNum();
                        path.quadraticCurveTo( x1, y1, nx, ny );
                        x = nx;
                        y = ny;
                        break;
                    case 'q':
                        x1 = x + eatNum();
                        y1 = y + eatNum();
                    case 't':
                        if ( activeCmd === 't' ) {
                            x1 = 2 * x - x1;
                            y1 = 2 * y - y1;
                        }
                        nx = x + eatNum();
                        ny = y + eatNum();
                        path.quadraticCurveTo( x1, y1, nx, ny );
                        x = nx; y = ny;
                        break;
                    // - elliptical arc
                    case 'A':
                        rx = eatNum();
                        ry = eatNum();
                        xar = eatNum() * DEGS_TO_RADS;
                        laf = eatNum();
                        sf = eatNum();
                        nx = eatNum();
                        ny = eatNum();
                        if ( rx !== ry ) console.warn( 'Forcing elliptical arc to be a circular one:', rx, ry );
                        // SVG implementation notes does all the math for us! woo!
                        // http://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes
                        // step1, using x1 as x1'
                        x1 = Math.cos( xar ) * ( x - nx ) / 2 + Math.sin( xar ) * ( y - ny ) / 2;
                        y1 = - Math.sin( xar ) * ( x - nx ) / 2 + Math.cos( xar ) * ( y - ny ) / 2;
                        // step 2, using x2 as cx'
                        var norm = Math.sqrt( ( rx * rx * ry * ry - rx * rx * y1 * y1 - ry * ry * x1 * x1 ) /
                                ( rx * rx * y1 * y1 + ry * ry * x1 * x1 ) );
                        if ( laf === sf ) norm = - norm;
                        x2 = norm * rx * y1 / ry;
                        y2 = norm * -ry * x1 / rx;
                        // step 3
                        cx = Math.cos( xar ) * x2 - Math.sin( xar ) * y2 + ( x + nx ) / 2;
                        cy = Math.sin( xar ) * x2 + Math.cos( xar ) * y2 + ( y + ny ) / 2;
                        var u = new THREE.Vector2( 1, 0 );
                        var v = new THREE.Vector2( ( x1 - x2 ) / rx, ( y1 - y2 ) / ry );
                        var startAng = Math.acos( u.dot( v ) / u.length() / v.length() );
                        if ( ( ( u.x * v.y ) - ( u.y * v.x ) ) < 0 ) startAng = - startAng;
                        // we can reuse 'v' from start angle as our 'u' for delta angle
                        u.x = ( - x1 - x2 ) / rx;
                        u.y = ( - y1 - y2 ) / ry;
                        var deltaAng = Math.acos( v.dot( u ) / v.length() / u.length() );
                        // This normalization ends up making our curves fail to triangulate...
                        if ( ( ( v.x * u.y ) - ( v.y * u.x ) ) < 0 ) deltaAng = - deltaAng;
                        if ( ! sf && deltaAng > 0 ) deltaAng -= Math.PI * 2;
                        if ( sf && deltaAng < 0 ) deltaAng += Math.PI * 2;
                        path.absarc( cx, cy, rx, startAng, startAng + deltaAng, sf );
                        x = nx;
                        y = ny;
                        break;
                    default:
                        throw new Error( 'Wrong path command: ' + activeCmd );
                }
                // just reissue the command
                if ( canRepeat && nextIsNum() ) continue;
                activeCmd = pathStr[ idx ++ ];
            }
            return path;
        }
    }

  function init41() {
        container = document.getElementById( 'window41' );
        if(container.childNodes.length!=0){
            container.removeChild(container.childNodes[0]);
        }

        raycaster = new THREE.Raycaster();
        //
        scene = new THREE.Scene();
        scene.background = new THREE.Color( 0x8b8b8b );

        console.log(window.innerWidth, window.innerHeight);
        camera = new THREE.OrthographicCamera( window.innerWidth*0.19/-260, window.innerWidth*0.19/260, window.innerHeight*0.3/260, window.innerHeight*0.3/-260, 1, 100 );
        camera.lookAt(new THREE.Vector3(0,0,0));
        camera.position.set(0,10,0);

        //
        var group = new THREE.Group();
        scene.add( group );

        //
        var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.6 );
        directionalLight.position.set( 0.75, 0.75, 1.0 ).normalize();
        scene.add( directionalLight );
        var ambientLight = new THREE.AmbientLight(0xcccccc, 1);
        scene.add(ambientLight);

        //
        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth*0.19, window.innerHeight*0.3 );

        container.appendChild( renderer.domElement );
        //
		controls = new THREE.OrbitControls( camera, renderer.domElement );
		controls.zoom0 = 100;

        window.addEventListener( 'resize', onWindowResize, false );
        //document.addEventListener('click', onDocumentMouseClick, false);
        //window.requestAnimationFrame(updateInfoBox);

        positioning = new THREE.Matrix4();

        var tmp = new THREE.Matrix4();
        positioning.multiply(tmp.makeRotationX(Math.PI/2));
        positioning.multiply(tmp.makeTranslation(-480, -250, 0));
    }

  function init42() {
        container = document.getElementById( 'window42' );
        if(container.childNodes.length!=0){
            container.removeChild(container.childNodes[0]);
        }

        scene = new THREE.Scene();
        scene.background = new THREE.Color( 0x8b8b8b );

        camera = new THREE.OrthographicCamera( window.innerWidth*0.19/-260, window.innerWidth*0.19/260, window.innerHeight*0.3/260, window.innerHeight*0.3/-260, 1, 10 );
        camera.lookAt(new THREE.Vector3(0,0,0));
        camera.position.set(0,1,0);

        //
        var group = new THREE.Group();
        scene.add( group );

        //
        var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.6 );
        directionalLight.position.set( 0.75, 0.75, 1.0 ).normalize();
        scene.add( directionalLight );
        var ambientLight = new THREE.AmbientLight(0xcccccc, 1);
        scene.add(ambientLight);

        //
        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth*0.19, window.innerHeight*0.3 );

        container.appendChild( renderer.domElement );
        //
		controls = new THREE.OrbitControls( camera, renderer.domElement );
		controls.zoom0 = 100;

        window.addEventListener( 'resize', onWindowResize, false );
        //document.addEventListener('click', onDocumentMouseClick, false);
        //window.requestAnimationFrame(updateInfoBox);

        positioning = new THREE.Matrix4();

        var tmp = new THREE.Matrix4();
        positioning.multiply(tmp.makeRotationX(Math.PI/2));
        positioning.multiply(tmp.makeTranslation(-480, -250, 0));
    }

  function init43() {
       container = document.getElementById( 'window43' );
        if(container.childNodes.length!=0){
            container.removeChild(container.childNodes[0]);
        }

        raycaster = new THREE.Raycaster();
        //
        scene = new THREE.Scene();
        scene.background = new THREE.Color( 0x8b8b8b );

        console.log(window.innerWidth, window.innerHeight);
        camera = new THREE.OrthographicCamera( window.innerWidth*0.19/-260, window.innerWidth*0.19/260, window.innerHeight*0.3/260, window.innerHeight*0.3/-260, 1, 100 );
        camera.lookAt(new THREE.Vector3(0,0,0));
        camera.position.set(0,10,0);

        //
        var group = new THREE.Group();
        scene.add( group );

        //
        var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.6 );
        directionalLight.position.set( 0.75, 0.75, 1.0 ).normalize();
        scene.add( directionalLight );
        var ambientLight = new THREE.AmbientLight(0xcccccc, 1);
        scene.add(ambientLight);

        //
        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth*0.19, window.innerHeight*0.3 );

        container.appendChild( renderer.domElement );
        //
		controls = new THREE.OrbitControls( camera, renderer.domElement );
		controls.zoom0 = 100;

        window.addEventListener( 'resize', onWindowResize, false );
        //document.addEventListener('click', onDocumentMouseClick, false);
        //window.requestAnimationFrame(updateInfoBox);

        positioning = new THREE.Matrix4();

        var tmp = new THREE.Matrix4();
        positioning.multiply(tmp.makeRotationX(Math.PI/2));
        positioning.multiply(tmp.makeTranslation(-480, -250, 0));
    }

  function init44(mode) {
        container = document.getElementById('window44');
         if(container.childNodes.length!=0){
            container.removeChild(container.childNodes[0]);
        }
        raycaster = new THREE.Raycaster();
        //
        scene = new THREE.Scene();
        scene.background = new THREE.Color( 0x8b8b8b );

        camera = new THREE.PerspectiveCamera(35, window.innerWidth*0.65 / (window.innerHeight*0.7), 0.1, 500);
        camera.position.set(0, 5, 3);  //x,左右倾斜；y,远近；z，正对xy平面
        camera.up.set(0,0.3,-0.1);  //前两个数控制左右倾斜程度

        //
        var group = new THREE.Group();
        scene.add( group );

        //
/*        var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.6 );
        directionalLight.position.set( 0.75, 0.75, 1.0 ).normalize();
        scene.add( directionalLight );*/
        var ambientLight = new THREE.AmbientLight(0xcccccc, 1);
        scene.add(ambientLight);
        var pointLight = new THREE.PointLight(0xff0000,1);
        pointLight.position.set(0,-10,10);
        scene.add(pointLight);

        //
        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth*0.65, window.innerHeight*0.7 );
        container.appendChild( renderer.domElement );
        //
		controls = new THREE.OrbitControls( camera, renderer.domElement );
		controls.zoom0 = 100;

        window.addEventListener( 'resize', onWindowResize, false );
        document.addEventListener('click', onDocumentMouseClick, false);
        //window.requestAnimationFrame(updateInfoBox);

        positioning = new THREE.Matrix4();

        var tmp = new THREE.Matrix4();
        positioning.multiply(tmp.makeRotationX(Math.PI/2));
        positioning.multiply(tmp.makeTranslation(-480, -250, 0));
    }

    function animate() {
        renderer.render( scene, camera );
        requestAnimationFrame( animate );
    }

    function initSVGObject(mode, uidnumber, max) {

        if(scene.children.length>10){
             clearObject();
        }

        var features = mapjson.features;

        var path = d3.geo.path().projection(d3.geo.mercator().center([114.16, 22.63]));

        features.forEach(function(feature){
            var shape = $d3g.transformSVGPath(path(feature));
            var simpleShape = shape.toShapes(true);
            var bid = feature.properties.bid;
            var amount = getAmount(bid, mode, uidnumber);
            var color = getColor(bid, mode, uidnumber, max);

            var extrudeMaterial = new THREE.MeshLambertMaterial({color: color, emissive: color});

            var extrudeSettings = {
                amount: amount,
                bevelEnabled: false
            };
            var shape3d = new THREE.ExtrudeBufferGeometry(simpleShape,extrudeSettings);

            var mesh = new THREE.Mesh(shape3d, extrudeMaterial);
            mesh.bid = bid;

            mesh.applyMatrix(positioning);
            scene.add(mesh);

            return mesh;
        });
    }

    function clearObject(){
         for(var i=0;i<1070;i++){
              scene.children.pop();
         }
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
    }

    function onDocumentMouseMove( event ) {
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    }

    function getAmount(bid, m, n){
        if((m==5)||(m==7)){
            var a = -1*getNumber(bid)*20/n;
            return a;
        }else if(m==6){
            p = 0;
            for (var i=0;i<numberjson.length;i++){
                if(numberjson[i].id==bid){
                    p = numberjson[i].n;
                }
            }
            return p/(-100);
        }else{
            return 1;
        }
    }

    function getNumber(bid){
            var numberback = 0;
            for (var i=0;i<numberjson.length;i++){
                    if(numberjson[i].id==bid){
                        numberback = numberjson[i].n;
                    }
            }
            return numberback;
    }

    function getColor(bid, m, uidnumber, max){
        var num = getNumber(bid);
        if((m==41)||(m==42)||(m==43)){
              if(num!=0){
                   var g = 255-Math.round(255*Math.log(num)/Math.log(max));
                   return "rgb(255,"+g+","+g+")";
              }else{
                   return "rgb(255,255,255)";
              }

        }else if(m==5){
              var num = getNumber(bid);
              if (num == 0) {
                     return "rgb(0,0,0)";
              } else {
                     var a= Math.round(255*num/max);
                     return "rgb("+a+",0,0)";
              }
        }else if(m==6){
              var colors = ["rgba(70,30,230,0.3)", "rgba(20,20,255,0.3)", "rgba(0,140,0,0.3)", "rgba(240,240,0,1)", "rgba(210,60,0,1)",
                            "rgba(0,220,220,1)", "rgba(255,0,0,1)","rgba(150,75,75,1)", "rgba(255,0,255,1)", "rgba(255,255,255,1)"];
              for (var i=0;i<numberjson.length;i++){
                if(numberjson[i].id==bid){
                    return colors[numberjson[i].t-1];
                }
            }
        }else if(m==7){
              var colors = ["#ff0000", "#4A4AFF", "#FF0080", "#00CACA", "#921AFF","#00DB00", "#FF8000","4F9D9D",  "#AD5A5A", "#82D900"];
              var num =getNumber(bid);
              if(num==0){
                     return "rgb(0,0,0)";
              }else{
                     return colors[max-1];
              }
        }
    }


function initTimeSlider(){
$(function() {
        $( "#timeline" ).slider({
                range: true,
                min: 0,
                max: 24,
                values: [ 6, 12 ],
                slide: function( event, ui ) {
                    $( "#timeText" ).val( ui.values[ 0 ] + "-" + ui.values[ 1 ] );
                }
            });
        });

}


  function onDocumentMouseClick(event) {
        mouse.x = ( event.clientX / window.innerWidth*0.65 ) * 2 - 1;
        mouse.y = -( event.clientY / (window.innerHeight*0.7) ) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        var intersects = raycaster.intersectObjects(scene.children);

        for (var i = 0; i < intersects.length; i++) {

            var bid = intersects[i].object.bid;
            if (bid) {
                intersects[i].object.material.color.set(0x00ff00);

                var self = this;
                var formData = new FormData();
	            formData.append('value', uids);
	            formData.append('st', parseInt($( "#timeText" ).val().split("-")[0])*60);
	            formData.append('et', parseInt($( "#timeText" ).val().split("-")[1])*60);
	            formData.append('ebid', bid);
	            var url = 'http://localhost:30030/chart';
	            lSendUrl('POST', url, formData, drawchart);

                function drawchart(response){
                    numberjson = JSON.parse(response['number']);
                    console.log(numberjson);
                    updateChartInfo({
                        title: 'purpose distribution',
                        xLabel: 'purpose',
                        yLabel: 'percent',
                        maxY: 100,
                        chartData: numberjson
                    });
                }
            }

        }
  }