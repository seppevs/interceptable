const interceptable = require('../src/interceptable');

describe('interceptable', () => {

  const obj = {
    doReturn: (arg) => `success-result-for-${arg}`,
    doThrow: (arg) => {
      throw new Error(`error-result-for-${arg}`);
    },
    doResolve: (arg) => Promise.resolve(`success-result-for-${arg}`),
    doReject: (arg) => Promise.reject(new Error(`error-result-for-${arg}`)),
  };

  class MyClass {
    constructor(member) {
      this.member = member;
    }

    doReturn(arg) {
      return `success-result-for-${arg}-${this.member}`;
    }
  }

  it('should be able to intercept the `fn` and `args` before the method is called, ' +
    'without providing an after interceptor', () => {
    const interceptor = ({ fn, args }) => {
      expect(fn).toEqual('doReturn');
      expect(args).toEqual(['anArgument']);
    };
    const interceptableObj = interceptable(obj, interceptor);
    const result = interceptableObj.doReturn('anArgument');
    expect(result).toEqual('success-result-for-anArgument');
    expect.assertions(3);
  });

  it('should be able to intercept success return', () => {
    const interceptor = ({ fn, args }) => ({
      onSuccess(result) {
        expect(fn).toEqual('doReturn');
        expect(args).toEqual(['anArgument']);
        expect(result).toEqual('success-result-for-anArgument');
      },
    });
    const interceptableObj = interceptable(obj, interceptor);
    const result = interceptableObj.doReturn('anArgument');
    expect(result).toEqual('success-result-for-anArgument');
    expect.assertions(4);
  });

  it('should be able to intercept error throw', () => {
    const interceptor = ({ fn, args }) => ({
      onError(err) {
        expect(fn).toEqual('doThrow');
        expect(args).toEqual(['anArgument']);
        expect(err.message).toEqual('error-result-for-anArgument');
      },
    });
    const interceptableObj = interceptable(obj, interceptor);
    try {
      interceptableObj.doThrow('anArgument');
    } catch(err) {
      expect(err.message).toEqual('error-result-for-anArgument');
    }
    expect.assertions(4);
  });

  it('should be able to intercept success resolve', async () => {
    const interceptor = ({ fn, args }) => ({
      onSuccess(result) {
        expect(fn).toEqual('doResolve');
        expect(args).toEqual(['anArgument']);
        expect(result).toEqual('success-result-for-anArgument');
      },
    });
    const interceptableObj = interceptable(obj, interceptor);
    const result = await interceptableObj.doResolve('anArgument');
    expect(result).toEqual('success-result-for-anArgument');
    expect.assertions(4);
  });

  it('should be able to intercept error reject', async () => {
    const interceptor = ({ fn, args }) => ({
      onError(err) {
        expect(fn).toEqual('doReject');
        expect(args).toEqual(['anArgument']);
        expect(err.message).toEqual('error-result-for-anArgument');
      },
    });
    const interceptableObj = interceptable(obj, interceptor);
    try {
      await interceptableObj.doReject('anArgument');
    } catch(err) {
      expect(err.message).toEqual('error-result-for-anArgument');
    }
    expect.assertions(4);
  });

  it('should be possible to intercept before and after a method invocation', () => {
    const interceptor = ({ fn, args }) => {
      expect(fn).toEqual('doReturn');
      expect(args).toEqual(['anArgument']);
      return {
        onSuccess(result) {
          expect(fn).toEqual('doReturn');
          expect(args).toEqual(['anArgument']);
          expect(result).toEqual('success-result-for-anArgument');
        },
      };
    };
    const interceptableObj = interceptable(obj, interceptor);
    const result = interceptableObj.doReturn('anArgument');
    expect(result).toEqual('success-result-for-anArgument');
    expect.assertions(6);
  });

  it('should still be possible to get and set regular properties', () => {
    const interceptor = () => {
      return {
        onSuccess() { },
      };
    };
    const interceptableObj = interceptable(obj, interceptor);
    interceptableObj.abc = '123';
    expect(interceptableObj.abc).toEqual('123');
  });

  it('should be possible to have no after method call hooks', () => {
    const interceptor = () => {
      return {
      };
    };
    const interceptableObj = interceptable(obj, interceptor);
    const result = interceptableObj.doReturn('anArgument');
    expect(result).toEqual('success-result-for-anArgument');
  });

  it('should work with this', () => {
    const objFromClass = new MyClass('myMember');
    const interceptor = ({ fn, args }) => ({
      onSuccess(result) {
        expect(fn).toEqual('doReturn');
        expect(args).toEqual(['anArgument']);
        expect(result).toEqual('success-result-for-anArgument-myMember');
      },
    });
    const interceptableObj = interceptable(objFromClass, interceptor);
    const result = interceptableObj.doReturn('anArgument');
    expect(result).toEqual('success-result-for-anArgument-myMember');
    expect.assertions(4);
  });

});
