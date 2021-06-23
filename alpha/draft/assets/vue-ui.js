'use strict'
!function() {

  var util = {
    trimRe: /^[\s\u3000]+|[\s\u3000]+$/,
    trim: function(value) {
      return typeof value == 'string'?
          value.replace(this.trimRe,'') : value;
    },
    rtrimRe: /[\s\u3000]+$/,
    rtrim: function(value) {
      return typeof value == 'string'?
          value.replace(this.rtrimRe,'') : value;
    },
    numRe: /^([\+\-]?)([0-9]+)(\.[0-9]+)?$/,
    isNumber: function(value) {
      return value.match(this.numRe);
    }
  };

  var components = {};
  var mixins = {};

  components['mycomp'] ={
      template: '<div class="mycomp"></div>'
  };

  components['tooltip-ui'] ={
    template: '<div :style="bodyStyle">' +
        '<slot/>' +
        '<div :style="outerArrowStyle"></div>' +
        '<div :style="arrowStyle"></div>' +
      '</div>',
    props: {
      direction: { type: String, default: 'bottom' },
      color: { type: String, default: '' },
      backgroundColor: { type: String, default: '#f0f0f0' },
      borderColor: { type: String, default: '#666666' },
      borderWidth: { type: Number, default: 1 },
      arrowH: { type: Number, default: 10 },
      arrowW: { type: Number, default: 5 }
    },
    computed: {
      d: function() {
        return this.direction.substring(0, 1).toLowerCase();
      },
      baseStyle: function() {
        var style = {
          display: 'inline-block',
          verticalAlign: 'top',
          lineHeight: '1'
        };
        return style;
      },
      bodyStyle: function() {
        var style = {
          display: 'inline-block',
          verticalAlign: 'top',
          lineHeight: '1',
          padding: '2px 4px',
          margin: '0px',
          position: 'relative',
          backgroundColor: this.backgroundColor,
          borderStyle: 'solid',
          borderColor: this.borderColor,
          borderWidth: this.borderWidth + 'px',
          borderRadius: '4px'
        };
        if (this.d == 't') {
          style.marginTop = this.arrowH + 'px';
        } else if (this.d == 'b') {
          style.marginBottom = this.arrowH + 'px';
        } else if (this.d == 'l') {
          style.marginLeft = this.arrowH + 'px';
        } else if (this.d == 'r') {
          style.marginRight = this.arrowH + 'px';
        }
        return style;
      },
      outerArrowStyle: function() {
        var style = {
          position: 'absolute',
          width: '0',
          height: '0',
          border: this.arrowW + 'px solid transparent'
        };
        if (this.d == 't') {
          style.borderBottomColor = this.borderColor;
          style.borderBottomWidth = this.arrowH + 'px';
          style.marginLeft = -this.arrowW +'px';
          style.bottom = '100%';
          style.left = '50%';
        } else if (this.d == 'b') {
          style.borderTopColor = this.borderColor;
          style.borderTopWidth = this.arrowH + 'px';
          style.marginLeft = -this.arrowW +'px';
          style.top = '100%';
          style.left = '50%';
        } else if (this.d == 'l') {
          style.borderRightColor = this.borderColor;
          style.borderRightWidth = this.arrowH + 'px';
          style.marginTop = -this.arrowW +'px';
          style.top = '50%';
          style.right = '100%';
        } else if (this.d == 'r') {
          style.borderLeftColor = this.borderColor;
          style.borderLeftWidth = this.arrowH + 'px';
          style.marginTop = -this.arrowW +'px';
          style.top = '50%';
          style.left = '100%';
        }
        return style;
      },
      arrowStyle: function() {
        var style = {
          position: 'absolute',
          width: '0',
          height: '0',
          border: (this.arrowW - 1) + 'px solid transparent'
        };
        if (this.d == 't') {
          style.borderBottomColor = this.backgroundColor;
          style.borderBottomWidth = (this.arrowH - 1) + 'px';
          style.marginLeft = (-this.arrowW + 1) +'px';
          style.bottom = '100%';
          style.left = '50%';
        } else if (this.d == 'b') {
          style.borderTopColor = this.backgroundColor;
          style.borderTopWidth = (this.arrowH - 1) + 'px';
          style.marginLeft = (-this.arrowW + 1) +'px';
          style.top = '100%';
          style.left = '50%';
        } else if (this.d == 'l') {
          style.borderRightColor = this.backgroundColor;
          style.borderRightWidth = (this.arrowH - 1) + 'px';
          style.marginTop = (-this.arrowW + 1) +'px';
          style.top = '50%';
          style.right = '100%';
        } else if (this.d == 'r') {
          style.borderLeftColor = this.backgroundColor;
          style.borderLeftWidth = (this.arrowH - 1) + 'px';
          style.marginTop = (-this.arrowW + 1) +'px';
          style.top = '50%';
          style.left = '100%';
        }
        return style;
      }
    }
  };

  mixins['input-base'] ={
    template: '<input type="text"' +
      ' :class="styleClass"' +
      ' @input="inputHandler"' +
      ' @focus="focusHandler"' +
      ' @blur="blurHandler"' +
      ' />',
    props: { value : {} },
    data: function() {
      return {
        _value: null,
        styleClass: '',
        inputOpts: {
          format: function(value) {
            return value === null? '' : '' + value;
          },
          parse: function(dispVal) {
            dispVal = util.trim(dispVal);
            return dispVal.length == 0? null : dispVal;
          },
          // test if can parse.
          isValid: function(dispVal) {
            return true;
          }
        }
      };
    },
    watch: {
      value: function(newVal) {
        this.setValue(newVal);
      }
    },
    methods: {
      setValue: function(value) {
        this.$el.value = this.inputOpts.format(this._value = value);
      },
      inputHandler: function(event) {
        var value = this.$el.value;
        if (this.inputOpts.isValid(value) ) {
          this.$emit('input', this.inputOpts.parse(value) );
        }
      },
      focusHandler: function(event) {
        this.$el.select();
      },
      blurHandler: function(event) {
        var value = this.$el.value;
        if (!this.inputOpts.isValid(value) ) {
          // revert
          this.setValue(this._value);
        }
      }
    },
    mounted: function() {
      this.setValue(this.value);
    }
  };

  components['number-input'] ={
    mixins: [ mixins['input-base'] ],
    beforeMount: function() {
      this.styleClass = 'number-input';
      this.inputOpts = {
        format: function(value) {
          return value === null? '' : '' + value;
        },
        parse: function(dispVal) {
          dispVal = util.trim(dispVal);
          return dispVal.length == 0? null : +dispVal;
        },
        isValid: function(dispVal) {
          dispVal = util.trim(dispVal);
          return dispVal.length == 0 || util.isNumber(dispVal);
        }
      };
    }
  };

  !function() {
    for (var k in components) {
      Vue.component(k, components[k]);
    }
  }();

}();

