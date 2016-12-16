(function() {

    var _indexOf = function(buffer, pattern, i) {
	var length, good;

	if ( !Buffer.isBuffer(pattern) )  pattern = new(Buffer)(pattern);
	if ( typeof i == 'undefined' ) i = 0;

	var length = buffer.length - pattern.length;
	while ( i <= length ) {
	    good = true;
	    
	    for ( var j = 0; j < pattern.length; j++ ) {
		if ( buffer[i+j ] !== pattern[j] ) {
		    good = false;
		    break;
		}
	    }
	    
	    if ( good ) return i;
	    i++;
	}
	
	return -1;

    };


    var _concat = function(buffers) {
	var _buffers = [];
	buffers.forEach(function(buffer) {
	    if ( !Buffer.isBuffer(buffer) ) {
		buffer = new(Buffer)(buffer);
	    }

	    _buffers.push(buffer);

	});

	return Buffer.concat(_buffers);

    };

    
    var to = function(obj) { 
	if ( !Array.isArray(obj) ) {
	    obj = Array.prototype.slice.call(arguments);
	}

	return new to_wrapper(obj); 

    };

    var to_wrapper = function(obj) { this._wrapped = obj; };

    to_wrapper.prototype.append = function(buffers) {
	if ( !Array.isArray(buffers) ) {
	    buffers = Array.prototype.slice.call(arguments);
	}

	var _buffers = [];
	this._wrapped.forEach(function(buffer) {
	    _buffers.push(_concat([buffer].concat(buffers)));

	});

	return _buffers;

    };


    to_wrapper.prototype.prepend = function(buffers) {
	if ( !Array.isArray(buffers) ) {
	    buffers = Array.prototype.slice.call(arguments);
	}

	var _buffers = [];
	this._wrapped.forEach(function(buffer) {
	    _buffers.push(_concat(buffers.concat(buffer)));

	});

	return _buffers;

    };


    var using = function(obj) {
	return new using_wrapper(obj);
    };


    var using_wrapper = function(obj) { this._wrapped = obj; };

    using_wrapper.prototype.split = function(buffer) {
	var pattern = this._wrapped, buffers = [];
	var _buffer, i = 0, j = 0;

	if ( !Buffer.isBuffer(buffer) ) {
	    buffer = new(Buffer)(buffer);
	}

	while ( i > -1 ) {
	    i = _indexOf(buffer, pattern, j);
	    if ( i == -1 ) {
		buffers.push(buffer.slice(j));
		break;
	    } 

	    _buffer = buffer.slice(j, i);
	    buffers.push(_buffer);
	    j += (_buffer.length+pattern.length);

	}

	return ( buffers.length > 0 )? buffers : [buffer];

    };

    using_wrapper.prototype.join = function(buffers) {
	if ( !Array.isArray(buffers) ) {
	    buffers = Array.prototype.slice.call(arguments);
	}
	
	var glue = this._wrapped, _buffers = [];
	buffers.forEach(function(buffer) {
	    _buffers.push(buffer);
	    if ( _buffers.length < buffers.length+(buffers.length-1) ){
		_buffers.push(glue);
		return;
	    }

	});

	return _concat(_buffers);
    };
    

    exports.using = using;
    exports.to = to;

})();