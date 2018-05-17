
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

  function init() {

        var container = document.getElementById( 'window3' );

        raycaster = new THREE.Raycaster();
        //
        scene = new THREE.Scene();
        scene.background = new THREE.Color( 0x8b8b8b );

        //
        camera = new THREE.PerspectiveCamera( 50, window.innerWidth*0.65 / window.innerHeight, 0.1, 100 );
        camera.position.set( 0, 18, 0 );
        //camera.position.set(8.278324114488553, 23.715105536749885, 5.334970045945842);
        camera.up.set(0, 0.3, -0.3);

        //
        var group = new THREE.Group();
        scene.add( group );

        //
        var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.6 );
        directionalLight.position.set( 0.75, 0.75, 1.0 ).normalize();
        scene.add( directionalLight );
        var ambientLight = new THREE.AmbientLight( 0xcccccc, 0.2 );
        scene.add( ambientLight );

        //
        var helper = new THREE.GridHelper( 10, 10 );
        helper.rotation.x = Math.PI / 2;
        group.add( helper );

        //
        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth*0.65, window.innerHeight );
        container.appendChild( renderer.domElement );
        //
		controls = new THREE.OrbitControls( camera, renderer.domElement );

        //controls.minDistance = 10;
        //controls.maxDistance = 50;

        //
        //stats = new Stats();
        //container.appendChild( stats.dom );
        //
        window.addEventListener( 'resize', onWindowResize, false );
        document.addEventListener('mousemove', onDocumentMouseMove, false);
        window.requestAnimationFrame(updateInfoBox);

        positioning = new THREE.Matrix4();

        var tmp = new THREE.Matrix4();
        positioning.multiply(tmp.makeRotationX(Math.PI/2));
        positioning.multiply(tmp.makeTranslation(-480, -250, 0));
    }


    function animate() {
        renderer.render( scene, camera );
        //stats.update();
        updateInfoBox();
        requestAnimationFrame( animate );
    }

    function updateInfoBox(){
        raycaster.setFromCamera( mouse, camera );

        var intersects = raycaster.intersectObjects(scene.children);

        var html = '';

        for (var i=0; i<intersects.length; i++) {
            intersects[i].object.material.color.set(0x00ff00);
            var bid = intersects[i].object.bid;
            console.log("point at: ", bid);
        }

    }


    function initSVGObject() {
        var features = mapjson.features;

        var path = d3.geo.path().projection(d3.geo.mercator().center([114.16, 22.63]));

        features.forEach(function(feature){
            var shape = $d3g.transformSVGPath(path(feature));
            var simpleShape = shape.toShapes(true);
            var bid = feature.properties.bid;
            var amount = getNumber(bid)*(-50)/odsum;
            var color = getColor(bid);
            //var color = d3.hsl(105, 0.8, luminance).toString();

            var extrudeMaterial = new THREE.MeshLambertMaterial({color: color, emissive: color});

            var extrudeSettings = {
                amount: amount,
                bevelEnabled: false
            };
            var shape3d = new THREE.ExtrudeBufferGeometry(simpleShape,extrudeSettings);

            var mesh = new THREE.Mesh(shape3d, extrudeMaterial);
            mesh.bid = bid;

            mesh.applyMatrix(positioning);
            //mesh.translateZ(-5);

            scene.add(mesh);

            return mesh;

        });

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


    function getNumber(bid){
        var numberback = 1;
        for (var i=0;i<numberjson.length;i++){
            if(numberjson[i].id==bid){
                numberback = numberjson[i].n;
            }
        }
        return numberback;
    }

    function getColor(bid){
	    var colors = ['#FF2D2D', '#FF77FF', '#7D7DFF','#2894FF','#4DFFFF','#02F78E','#28FF28','#9AFF02','#F9F900',
	    '#FF9224','#F75000','#AD5A5A','#AFAF61','#6FB7B7','#8080C0','#AE57A4', '#FF0080','#921AFF'];
        var out;
        var flag = 1;
        var num = getNumber(bid);
        if(num==1){
            out = "rgb(100,100,100)";
        }else{
             for (var i=0;i<clusterjson.length;i++){
                if(clusterjson[i].id==bid){
                   flag = 2;
                   out = colors[clusterjson[i].c];
                   break;
                }
             }
             if(flag ==1){
                 out = "rgb(200,200,200)";
             }
        }
        return out;
    }

