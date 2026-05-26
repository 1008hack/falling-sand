/**
 * @access public
 * @constant
 * Provides useful error expressions.
 * @example
 * function pow(a) {
 *     if(typeof a != `number` && !(a instanceof Number)) throw STANDARD_ERROR.WRONG_TYPE()
 *     if(Number.isNaN(a) || a == Infinity) throw STANDARD_ERROR.OUT_OF_RANGE()
 *     return a * a
 * } 
 */

const STANDARD_ERROR = {
    /**
     * @access public
     * @method
     * Returns the standard form of error(wrong type)
     * @returns { TypeError }
     */
    WRONG_TYPE() {
        return new TypeError(`Unexpected type`)
    },
    /**
     * @access public
     * @method
     * Returns the standard form of error(out of range)
     * @returns { RangeError }
     */
    OUT_OF_RANGE() {
        return new RangeError(`Out of expected range`)
    },
    /**
     * @access public
     * @method
     * @returns { Error }
     */
    UNEXPECTED_CALL() {
        return new Error(`Unexpected call`)
    }
}

Object.freeze(STANDARD_ERROR);

/**
 * @access public
 * @function
 * Returns true when a value is Number.
 * @param { any } a A value
 * @returns { Boolean }
 */
function isNumber(a) {
    if(a instanceof Number) return typeof a.valueOf() == `number`
    return typeof a == `number`
}

/**
 * @access public
 * @function
 * @param { Number } a 
 * @returns 
 */
function isValidNumber(a) {
    if(!isNumber(a)) throw STANDARD_ERROR.WRONG_TYPE()
    return !(Number.isNaN(a)) && a != Infinity
}

/**
 * @typedef { typeof Vector.POLAR | typeof Vector.ORTHOGONAL } VectorExpressMethod
 */

// section-I : volume and direction
/**
 * @access public
 * @function
 * @param { Number } a 
 * @param { Number } b 
 * @returns { Number }
 */
function hyp(a, b) {
    if(!isNumber(a) || !isNumber(b)) throw STANDARD_ERROR.WRONG_TYPE()
    if(!isValidNumber(a) || !isValidNumber(b)) throw STANDARD_ERROR.OUT_OF_RANGE()
    return Math.sqrt(a * a + b * b)
}
/**
 * @access public
 * @function
 * @param { Number } hyp 
 * @param { Number } a 
 * @returns { Number }
 */
function base(hyp, a) {
    if(!isNumber(hyp) || !isNumber(a)) throw STANDARD_ERROR.WRONG_TYPE()
    if(!isValidNumber(hyp) || !isValidNumber(a)) throw STANDARD_ERROR.OUT_OF_RANGE()
    return Math.sqrt(hyp * hyp - a * a)
}

/**
 * @access public
 * @class
 * @description Geometry module. Volume And Direction section(sectionNo.I).
 */
class Vector {
    /**
     * @static
     * @access public
     * @constant
     * @type { VectorExpressMethod } 
     */
    static POLAR = Symbol(`polar`)
    /**
     * @static
     * @property
     * @access public
     * @constant
     * @type { VectorExpressMethod }
     */
    static ORTHOGONAL = Symbol(`orthogonal`)

    constructor(expressType, a, b) {
        if(expressType !== Vector.POLAR && expressType !== Vector.ORTHOGONAL) throw STANDARD_ERROR.OUT_OF_RANGE()
        if(expressType === Vector.POLAR) this.polar = [ a, b ]
        else this.orthogonal = [ a, b ]
    }

    /**
     * @access private
     * @property { Number } x
     * @property { Number } y
     */
    #props = {
        x : 0,
        y : 0
    }

    /**
     * @access public
     * @returns { Number }
     */
    get x() {
        return this.#props.x
    }

    /**
     * @access public
     * @param { Number } x
     */
    set x(x) {
        if(!isNumber(x)) throw STANDARD_ERROR.WRONG_TYPE()
        if(!isValidNumber(x)) throw STANDARD_ERROR.OUT_OF_RANGE()
        this.#props.x = x
    }

    /**
     * @access public
     * @returns { Number }
     */
    get y() {
        return this.#props.y
    }

    /**
     * @access public
     * @param { Number } y
     */
    set y(y) {
        if(!isNumber(y)) throw STANDARD_ERROR.WRONG_TYPE()
        if(!isValidNumber(y)) throw STANDARD_ERROR.OUT_OF_RANGE()
        this.#props.y = y
    }

    /**
     * @access public
     * @returns { Number }
     */
    get theta() {
        return this.polar[0]
    }

    /**
     * @access public
     * @param { Number } radian
     */
    set theta(radian) {
        this.polar = [ radian, this.radius ]
    }

    /**
     * @access public
     * @returns { Number }
     */
    get radius() {
        return this.polar[1]
    }

    /**
     * @access public
     * @param { Number } r
     */
    set radius(r) {
        this.polar = [ this.theta, r ]
    }

    /**
     * @access public
     * @returns { [ Number, Number ] }
     */
    get polar() {
        return [ Math.atan2(this.y, this.x), hyp(this.x, this.y) ]
    }

    /**
     * @access public
     * @param { [ Number, Number ] } polar
     */
    set polar([ a, r ]) {
        if(!isNumber(a) || !isNumber(r)) throw STANDARD_ERROR.WRONG_TYPE()
        if(!isValidNumber(a) || !isValidNumber(r)) throw STANDARD_ERROR.OUT_OF_RANGE()
        if(r < 0) throw STANDARD_ERROR.OUT_OF_RANGE()
        const SINE = Math.sin(a) * r
        const COSINE = Math.cos(a) * r
        this.orthogonal = [ SINE, COSINE ]
    }
    
    /**
     * @access public
     * @returns { [ Number, Number ] }
     */
    get orthogonal() {
        return [ this.x, this.y ]
    }

    /**
     * @access public
     * @param { [ Number, Number ] } orthogonal 
     */
    set orthogonal([ x, y ]) {
        if(!isNumber(x) || !isNumber(y)) throw STANDARD_ERROR.WRONG_TYPE()
        if(!isValidNumber(x) || !isValidNumber(y)) throw STANDARD_ERROR.OUT_OF_RANGE()
        this.x = x
        this.y = y
    }

    /**
     * @access public
     * @returns { Number }
     */
    get volume() {
        return Math.abs(this.x * this.y)
    }

    /**
     * @access public
     * @param { Number } volume
     */
    set volume(volume) {
        this.scale(Math.sqrt(volume / this.volume))
    }

    /**
     * @access public
     * @method
     * Returns clone of itself.
     * @returns { Vector }
     */
    clone() {
        return new Vector(Vector.ORTHOGONAL, this.x, this.y)
    }

    /**
     * @access public
     * @method
     * @param { Number } radian 
     * @returns { typeof this }
     */
    tilt(radian) {
        this.theta += radian
        return this
    }

    /**
     * @access public
     * @method
     * @param { Number } a 
     * @returns { Vector }
     */
    scale(a) {
        this.radius *= a
        return this
    }

    /**
     * @access public
     * @method
     * @param { Number } x 
     * @returns { Vector }
     */
    translateX(x) {
        this.x += x
        return this
    }

    /**
     * @access public
     * @method
     * @param { Number } y 
     * @returns { Vector }
     */
    translateY(y) {
        this.y += y
        return this
    }

    /**
     * @access public
     * @method
     * @param { Vector } vector 
     * @returns { Vector }
     */
    translate(vector) {
        if(!(vector instanceof Vector)) throw STANDARD_ERROR.WRONG_TYPE()
        const { X, Y } = vector
        if(!isNumber(X) || !isNumber(Y)) throw STANDARD_ERROR.WRONG_TYPE()
        if(!isValidNumber(X) || !isValidNumber(Y)) throw STANDARD_ERROR.OUT_OF_RANGE()
        this.x += X
        this.y += Y
        return this
    }
}

// section-II : shape
/**
 * @access public
 * @function
 * Returns the inside angle(radian) of a regular polygon of 
 * @param { Number } numberOfAngles 
 * @returns { Number } 
 * @example
 * @description Geometry module. Shape section(sectionNo.II).
 */
function getInsideAngleSize(numberOfAngles) {
    if(!isNumber(numberOfAngles)) throw STANDARD_ERROR.WRONG_TYPE()
    if(!isValidNumber(numberOfAngles)) throw STANDARD_ERROR.OUT_OF_RANGE()
    if(numberOfAngles < 3 || numberOfAngles % 1 != 0) throw STANDARD_ERROR.OUT_OF_RANGE() 
    return (Math.PI * 2 - (numberOfAngles - 2)) / numberOfAngles
}