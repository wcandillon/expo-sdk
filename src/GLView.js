'use strict';

import React, { PropTypes } from 'react';
import { View, requireNativeComponent } from 'react-native';


// A component that acts as an OpenGL render target.

export default class GLView extends React.Component {
  static propTypes = {
    // Called when the OpenGL context is created, with the context object as a
    // parameter. The context object has an API mirroring WebGL's
    // WebGLRenderingContext.
    onContextCreate: PropTypes.func,

    ...View.propTypes,
  }

  render() {
    // eslint-disable-next-line no-unused-vars
    const { onContextCreate, ...viewProps } = this.props;

    // NOTE: Removing `backgroundColor: 'transparent'` causes a performance
    //       regression. Not sure why yet...
    return (
      <View {...viewProps}>
        <GLView.NativeView
          style={{ flex: 1, backgroundColor: 'transparent' }}
          onSurfaceCreate={this._onSurfaceCreate}
        />
      </View>
    );
  }

  _onSurfaceCreate = ({ nativeEvent: { exglCtxId } }) => {
    const gl = getGl(exglCtxId);
    if (this.props.onContextCreate) {
      this.props.onContextCreate(gl);
    }
  }

  static NativeView = requireNativeComponent('ExponentGLView', GLView, {
    nativeOnly: { onSurfaceCreate: true },
  });
}


// Class of `gl` objects
global.WebGLRenderingContext = class { };

// Get the GL interface from an EXGLContextID and do JS-side setup
const getGl = (exglCtxId) => {
  const gl = global.__EXGLContexts[exglCtxId];
  delete global.__EXGLContexts[exglCtxId];
  Object.setPrototypeOf(gl, global.WebGLRenderingContext.prototype);

  // No canvas yet...
  gl.canvas = null;

  // Functions that need sequence -> TypedArray conversion
  [
    { func: 'uniform1fv', arg: 1, type: Float32Array },
    { func: 'uniform2fv', arg: 1, type: Float32Array },
    { func: 'uniform3fv', arg: 1, type: Float32Array },
    { func: 'uniform4fv', arg: 1, type: Float32Array },
    { func: 'uniform1iv', arg: 1, type: Int32Array },
    { func: 'uniform2iv', arg: 1, type: Int32Array },
    { func: 'uniform3iv', arg: 1, type: Int32Array },
    { func: 'uniform4iv', arg: 1, type: Int32Array },
    { func: 'uniformMatrix2fv', arg: 2, type: Float32Array },
    { func: 'uniformMatrix3fv', arg: 2, type: Float32Array },
    { func: 'uniformMatrix4fv', arg: 2, type: Float32Array },
    { func: 'vertexAttrib1fv', arg: 1, type: Float32Array },
    { func: 'vertexAttrib2fv', arg: 1, type: Float32Array },
    { func: 'vertexAttrib3fv', arg: 1, type: Float32Array },
    { func: 'vertexAttrib4fv', arg: 1, type: Float32Array },
  ].forEach(({ func, arg, type }) => {
    const original = gl[func];
    gl[func] = (...args) => {
      // NOTE: Keep this fast
      args[arg] = new type(args[arg]);
      return original.apply(gl, args);
    };
  });

  // Drawing buffer width/height
  // TODO(nikki): Make this dynamic
  const viewport = gl.getParameter(gl.VIEWPORT);
  gl.drawingBufferWidth = viewport[2];
  gl.drawingBufferHeight = viewport[3];

  // Enable/disable logging of all GL function calls
  let enableLogging = false;
  Object.defineProperty(gl, 'enableLogging', {
    configurable: true,
    get() {
      return enableLogging;
    },
    set(enable) {
      if (enable === enableLogging) {
        return;
      }
      if (enable) {
        Object.keys(gl).forEach((key) => {
          if (typeof gl[key] === 'function') {
            const original = gl[key];
            gl[key] = (...args) => {
              console.log(`EXGL: ${key}(${args.join(', ')})`);
              const r = original.apply(gl, args);
              console.log(`EXGL:    = ${r}`);
              return r;
            };
            gl[key].original = original;
          }
        });
      } else {
        Object.keys(gl).forEach((key) => {
          if (typeof gl[key] === 'function' && gl[key].original) {
            gl[key] = gl[key].original;
          }
        });
      }
      enableLogging = enable;
    },
  });

  return gl;
};
