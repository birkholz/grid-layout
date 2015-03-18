var options = {
    widget_size: 100,
    cols: 5,
    rows: 5
},
    _startX = 0,
    _startY = 0,
    _offsetX = 0,
    _offsetY = 0,
    _dragElement = null;

var grid = document.getElementById("grid_container");

// Widgets [x, y, sx, sy]
var widgets = [
    [1,1],
    [4,2],
    [2,5],
    [3,3],
    [5,3],
    [2,2],
    [3,5]
];

// Generate CSS for grid
(function(){
    var styles = '';
    for (i = options.cols; i >= 0; i--) {
        styles += ('[data-x="'+ (i + 1) + '"]{left:' + (i * options.widget_size) + 'px;}\n');
    }
    for (i = options.rows; i >= 0; i--) {
        styles += ('[data-y="' + (i + 1) + '"]{top:' + (i * options.widget_size) + 'px;}\n');
    }
    // for (var y = 1; y <= options.rows; y++) {
    //     styles += ('[data-sy="' + y + '"]{height:' + (y * options.widget_size) + 'px;}\n');
    // }
    // for (var x = 1; x <= options.cols; x++) {
    //     styles += ('[data-sx="' + x + '"]{width:' + (x * options.widget_size) + 'px;}\n');
    // }
    var tag = document.createElement('style');
    document.getElementsByTagName('head')[0].appendChild(tag);
    tag.setAttribute('type', 'text/css');
    if (tag.styleSheet) tag.styleSheet.cssText = styles;
    else tag.appendChild(document.createTextNode(styles));

    grid.style.height = options.rows * options.widget_size;
    grid.style.width = options.cols * options.widget_size;
})();

// Add widgets to grid
(function(){
    for (var x=0;x<widgets.length;x++) {
        var widget = widgets[x];
        var tag = document.createElement('div');
        grid.appendChild(tag);
        tag.classList.add('grid_widget');
        tag.setAttribute('data-x', widget[0]);
        tag.setAttribute('data-y', widget[1]);
        // tag.setAttribute('data-sx', widget[2]);
        // tag.setAttribute('data-sy', widget[3]);
    }
})();

grid.addEventListener("click",function(e) {
    if(e.target && e.target.classList.contains('grid_widget')) {

    }
});

InitDragDrop();

function InitDragDrop() {
    document.onmousedown = OnMouseDown;
    document.onmouseup = OnMouseUp;
}

function OnMouseDown(e) {
    if(e.target && e.target.classList.contains('grid_widget')) {
        _startX = e.clientX;
        _startY = e.clientY;
        _offsetX = e.target.offsetLeft;
        _offsetY = e.target.offsetTop;
        _dragElement = e.target;
        _dragElement.classList.add('dragging');
        document.onmousemove = OnMouseMove;
        // document.body.style.cursor = "none";
        return false;
    }
}

function getChildren(n, skipMe){
    var r = [];
    var elem = null;
    for ( ; n; n = n.nextSibling ) 
       if ( n.nodeType == 1 && n != skipMe)
          r.push( n );        
    return r;
};

function getSiblings(n) {
    return getChildren(n.parentNode.firstChild, n);
}

function OnMouseMove(e) {
    var x1 = options.widget_size * Math.floor(e.clientX/options.widget_size),
        y1 = options.widget_size * Math.floor(e.clientY/options.widget_size),
        x2 = x1 + _dragElement.offsetWidth,
        y2 = y1 + _dragElement.offsetHeight;
    // Keep within bounds
    if (x1 < 0) x1 = 0;
    if (y1 < 0) y1 = 0;
    if (x2 > grid.offsetLeft+grid.offsetWidth) x1 = x1 - (x2 - grid.offsetWidth);
    if (y2 > grid.offsetTop+grid.offsetHeight) y1 = y1 - (y2 - grid.offsetWidth);
    var new_col = x1/options.widget_size +1,
        new_row = y1/options.widget_size +1;
    // check collision
    _dragElement.classList.remove('colliding');
    var widgets = getSiblings(_dragElement);
    for (var x=0;x<widgets.length;x++) {
        var widget = widgets[x],
            wcol = parseInt(widget.getAttribute('data-x')),
            wrow = parseInt(widget.getAttribute('data-y'));

        if (new_col == wcol && new_row == wrow) {
            _dragElement.classList.add('colliding');
            break;
        }
    }
    _dragElement.style.left = x1 + 'px';
    _dragElement.style.top = y1 + 'px';
}

function OnMouseUp() {
    if (_dragElement !== null && _dragElement.classList.contains('colliding') === false) {
        _placing = false;
        _dragElement.classList.remove('dragging');
        var new_col = _dragElement.offsetLeft/options.widget_size +1,
            new_row = _dragElement.offsetTop/options.widget_size +1;
        _dragElement.setAttribute('data-x', new_col);
        _dragElement.setAttribute('data-y', new_row);
        // document.body.style.cursor = "default";
        document.onmousemove = null;
        _dragElement = null;
    }
}